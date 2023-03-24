/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const jscodeshift = require('jscodeshift');
// eslint-disable-next-line no-relative-import-paths/no-relative-import-paths
const prettier = require('prettier');
const { default: transformer } = require('../transforms/generate-graphql-map');

const source = transformer({ source: '' }, { jscodeshift });

fs.writeFileSync(
  'src/logic/client/graphql/autogen.ts',
  prettier.format(source, { parser: 'typescript', ...prettier.resolveConfig.sync() })
);
