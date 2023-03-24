/* eslint-disable no-relative-import-paths/no-relative-import-paths */
import type { API, FileInfo } from 'jscodeshift';
import * as customQueries from '../src/graphql/custom-queries';
import * as mutations from '../src/graphql/mutations';
import * as queries from '../src/graphql/queries';
import * as subscriptions from '../src/graphql/subscriptions';

export default function transformer(
  { source }: Pick<FileInfo, 'source'>,
  { jscodeshift: j }: Pick<API, 'jscodeshift'>
) {
  const root = j(source);

  root.find(j.Program).forEach((program) => {
    const typeImports = j.importDeclaration([], j.stringLiteral('src/graphql'), 'type');
    const customQueryImports = j.importDeclaration([], j.stringLiteral('src/graphql/custom-queries'), 'type');
    const mutationImports = j.importDeclaration([], j.stringLiteral('src/graphql/mutations'), 'type');
    const queryImports = j.importDeclaration([], j.stringLiteral('src/graphql/queries'), 'type');
    const subscriptionImports = j.importDeclaration([], j.stringLiteral('src/graphql/subscriptions'), 'type');
    const mapProperties = j.tsTypeLiteral([]);
    const subscriptionMap = j.tsTypeLiteral([]);

    const imports = {
      CustomQuery: customQueryImports,
      Mutation: mutationImports,
      Query: queryImports,
      Subscription: subscriptionImports,
    };

    const addEntry = (name: string, type: keyof typeof imports) => {
      const returnName = name[0].toUpperCase() + name.slice(1) + (type === 'CustomQuery' ? 'Query' : type);
      const variableName = returnName + 'Variables';

      // add type imports
      (typeImports.specifiers ??= []).push(
        j.importSpecifier(j.identifier(returnName)),
        j.importSpecifier(j.identifier(variableName))
      );

      // add to correct import (mutation/query)
      (imports[type].specifiers ??= []).push(j.importSpecifier(j.identifier(name)));

      // add an entry to the map
      (type === 'Subscription' ? subscriptionMap : mapProperties).members.push(
        j.tsPropertySignature.from({
          key: j.identifier(name),
          computed: true,
          typeAnnotation: j.tsTypeAnnotation(
            j.tsTypeReference(
              j.identifier('GraphQLEntry'),
              j.tsTypeParameterInstantiation([
                j.tsTypeReference(j.identifier(returnName)),
                j.tsTypeReference(j.identifier(variableName)),
              ])
            )
          ),
        })
      );
    };

    // getting loopy
    Object.keys(customQueries).map((name) => addEntry(name, 'CustomQuery'));
    Object.keys(queries).map((name) => addEntry(name, 'Query'));
    Object.keys(mutations).map((name) => addEntry(name, 'Mutation'));
    Object.keys(subscriptions).map((name) => addEntry(name, 'Subscription'));

    // all together now
    program.value.body = [
      typeImports,
      customQueryImports,
      mutationImports,
      queryImports,
      subscriptionImports,
      j.importDeclaration([j.importSpecifier(j.identifier('GraphQLEntry'))], j.stringLiteral('./types'), 'type'),
      j.exportNamedDeclaration(j.tsTypeAliasDeclaration(j.identifier('GraphQLMap'), mapProperties)),
      j.exportNamedDeclaration(j.tsTypeAliasDeclaration(j.identifier('GraphQLSubscriptionMap'), subscriptionMap)),
    ];

    // add warning
    (program.value.body[0].comments ??= []).push(
      j.commentBlock.from({
        value: `*
 *  WARNING: DO NOT EDIT. This file is automatically updated by running \`npm run generate-graphql-map\`. It will be overwritten.
 *  Add custom queries to GraphQLMapCustom in ./types.ts and custom subscriptions to GraphQLSubscriptionMapCustom instead.
 `,
        leading: true,
      })
    );
  });

  return root.toSource();
}
