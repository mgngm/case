import type { EntityState } from '@reduxjs/toolkit';
import { createEntityAdapter } from '@reduxjs/toolkit';
import { PROJECT_TEMPLATES_TAG } from 'src/constants/slices';
import type {
  ModelProjectTemplateFilterInput,
  CreateProjectTemplateMutation,
  DeleteProjectTemplateMutation,
  DeleteProjectTemplateInput,
  UpdateProjectTemplateInput,
  ProjectStatus,
  ProjectType,
  UpdateProjectTemplateMutation,
  CreateProjectTemplateInput,
} from 'src/graphql';
import { createProjectTemplate, deleteProjectTemplate, updateProjectTemplate } from 'src/graphql/mutations';
import { listProjectTemplates } from 'src/graphql/queries';
import type { WithErrorPolicy } from 'src/logic/client/graphql/error';
import { baseApi } from 'src/slices/api';
import { graphQLHelper } from 'src/slices/graphql';
import type { ProjectTemplate } from 'src/types/projects';

/**
 * Formats project template to go into dynamo (stringifies the body object)
 * @param projectTemplate
 * @returns
 */
const formatProjectTemplateForDdbCreate = (projectTemplate: ProjectTemplate): CreateProjectTemplateInput => ({
  ...projectTemplate,
  status: projectTemplate.status as ProjectStatus,
  type: projectTemplate.type as ProjectType,
  body: JSON.stringify(projectTemplate.body),
});

const formatProjectTemplateForDdbDelete = (projectTemplate: ProjectTemplate): DeleteProjectTemplateInput => ({
  id: projectTemplate.id as string,
  _version: projectTemplate.version as number,
});

/* eslint-disable @typescript-eslint/no-non-null-assertion */
const formatProjectTemplateForDdbUpdate = (projectTemplate: ProjectTemplate): UpdateProjectTemplateInput => ({
  id: projectTemplate.id!,
  _version: projectTemplate.version!,
  body: JSON.stringify(projectTemplate.body),
  context: projectTemplate.context,
  status: projectTemplate.status as ProjectStatus,
  type: projectTemplate.type as ProjectType,
  templateId: projectTemplate.templateId,
  name: projectTemplate.name,
});
/* eslint-enable */

/**
 * Formats dynamo request back into our ProjectTemplate types (and gets rid of a load of metadata we don't really care about)
 * @param dynamoProjectTemplates
 * @returns
 */
const formatDynamoProjectTemplateForClient = (dynamoProjectTemplateItems: Array<any>): ProjectTemplate[] => {
  if (dynamoProjectTemplateItems.length === 0) {
    return [];
  } else {
    const formattedItems: ProjectTemplate[] = [];
    for (const _ddbItem of dynamoProjectTemplateItems) {
      //If the item is a valid one, dynamo may hold weird, strange things deemed to be evil
      if (
        _ddbItem &&
        !_ddbItem._deleted &&
        _ddbItem.type &&
        _ddbItem.status &&
        _ddbItem.name &&
        _ddbItem.context &&
        _ddbItem.templateId
      ) {
        formattedItems.push({
          id: _ddbItem?.id,
          version: _ddbItem?._version,
          body: JSON.parse(_ddbItem?.body ?? '{}'),
          type: _ddbItem?.type,
          status: _ddbItem?.status,
          name: _ddbItem?.name,
          context: _ddbItem?.context,
          templateId: _ddbItem?.templateId,
        });
      }
    }

    return formattedItems;
  }
};

const templateAdapter = createEntityAdapter<ProjectTemplate>();

export const projectTemplatesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listProjectTemplates: build.query<
      WithErrorPolicy<EntityState<ProjectTemplate>>,
      { filter?: ModelProjectTemplateFilterInput; context: string }
    >({
      providesTags: (res, err, arg) => [{ type: PROJECT_TEMPLATES_TAG, id: arg.context }],
      ...graphQLHelper({
        query: ({ filter }) => ({ query: listProjectTemplates, variables: { filter } }),
        transformResponse: ({ data, errors }) => ({
          data: templateAdapter.setAll(
            templateAdapter.getInitialState(),
            formatDynamoProjectTemplateForClient(data.listProjectTemplates?.items ?? [])
          ),
          errors,
        }),
      }),
    }),
    createNewProjectTemplate: build.mutation<
      WithErrorPolicy<CreateProjectTemplateMutation>,
      { projectTemplate: ProjectTemplate; context: string }
    >({
      invalidatesTags: (res, err, arg) =>
        res?.data?.createProjectTemplate?.createdAt ? [{ type: PROJECT_TEMPLATES_TAG, id: arg.context }] : [],
      ...graphQLHelper({
        query: ({ projectTemplate }) => ({
          query: createProjectTemplate,
          variables: {
            input: formatProjectTemplateForDdbCreate(projectTemplate),
          },
        }),
      }),
    }),
    deleteProjectTemplate: build.mutation<
      WithErrorPolicy<DeleteProjectTemplateMutation>,
      { projectTemplate: ProjectTemplate; context: string }
    >({
      invalidatesTags: (res, err, arg) =>
        res?.data?.deleteProjectTemplate?._deleted ? [{ type: PROJECT_TEMPLATES_TAG, id: arg.context }] : [],
      ...graphQLHelper({
        query: ({ projectTemplate }) => ({
          query: deleteProjectTemplate,
          variables: {
            input: formatProjectTemplateForDdbDelete(projectTemplate),
          },
        }),
      }),
    }),

    updateProjectTemplate: build.mutation<
      WithErrorPolicy<UpdateProjectTemplateMutation>,
      { projectTemplate: ProjectTemplate; context: string }
    >({
      invalidatesTags: (res, err, arg) =>
        res?.data?.updateProjectTemplate?._lastChangedAt ? [{ type: PROJECT_TEMPLATES_TAG, id: arg.context }] : [],
      ...graphQLHelper({
        query: ({ projectTemplate }) => ({
          query: updateProjectTemplate,
          variables: {
            input: formatProjectTemplateForDdbUpdate(projectTemplate),
          },
        }),
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useListProjectTemplatesQuery,
  useCreateNewProjectTemplateMutation,
  useDeleteProjectTemplateMutation,
  useUpdateProjectTemplateMutation,
} = projectTemplatesApi;

export const {
  selectAll: selectAllTemplates,
  selectById: selectTemplateById,
  selectEntities: selectTemplateMap,
  selectIds: selectTemplateIds,
  selectTotal: selectTemplatesTotal,
} = templateAdapter.getSelectors();
