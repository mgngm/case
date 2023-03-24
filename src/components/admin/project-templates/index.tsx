import { useMemo, useState } from 'react';
import { Refresh } from '@mui/icons-material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  useTheme,
} from '@mui/material';
import Button from '@mui/material/Button';
import type { EntityId } from '@reduxjs/toolkit';
import { MoonLoader } from 'react-spinners';
import { TableEmptyBody } from 'src/components/shared/table';
import useContextInfo from 'src/hooks/use-context-info';
import { useMuiTablePagination } from 'src/hooks/use-pagination';
import useSort from 'src/hooks/use-sort';
import { satisfies, sortByKey } from 'src/logic/libs/helpers';
import { selectAllTemplates, selectTemplateMap, useListProjectTemplatesQuery } from 'src/slices/project-templates';
import type { ProjectTemplate } from 'src/types/projects';
import DeleteProjectTemplateDialog from './delete';
import styles from './index.module.scss';
import ProjectTemplateRow from './list-row';
import CreateOrEditProjectTemplateDialog from './project-template-dialog';
import baseAdminStyles from 'styles/Admin.module.scss';

const sortableKeys = satisfies<(keyof ProjectTemplate)[]>()(['name', 'templateId']);

const ProjectTemplates = () => {
  const theme = useTheme();
  const {
    column: sortCol,
    direction: sortDir,
    getCellProps,
    getSortLabelProps,
  } = useSort<typeof sortableKeys[number]>('name');
  const [createProjectTemplateOpen, setCreateProjectTemplateOpen] = useState(false);
  const [editProjectTemplate, setEditProjectTemplate] = useState<EntityId>('');
  const [deleteProjectTemplate, setDeleteProjectTemplate] = useState<EntityId>('');

  const contextInfo = useContextInfo();

  const { templates, templateMap, isFetching, isLoading, isError, isUninitialized, refetch } =
    useListProjectTemplatesQuery(
      {
        filter: { context: { eq: contextInfo.adminContext.prettyId } },
        context: contextInfo.adminContext.prettyId as string,
      },
      {
        skip: !contextInfo.adminContext.prettyId,
        selectFromResult: ({ isFetching, isLoading, isError, isUninitialized, data }) => ({
          isFetching,
          isLoading,
          isError,
          isUninitialized,
          templates: data && selectAllTemplates(data.data),
          templateMap: data && selectTemplateMap(data.data),
        }),
      }
    );

  const renderList = useMemo(() => {
    return templates ? [...templates].sort(sortByKey(sortCol, sortDir)) : [];
    //If we want to add search on here? Can probably make this a base fn as well.
    // if (search !== '') {
    //   const searchLower = search.toLocaleLowerCase();
    //   sortedList = sortedList.filter((datum) => datum[key]toLocaleLowerCase().includes(searchLower));
    // }
    // return sortedList;
  }, [templates, sortDir, sortCol]);

  const { sliceArgs, getPaginationProps } = useMuiTablePagination({ total: renderList.length });
  const paginatedList = useMemo(() => renderList.slice(...sliceArgs), [renderList, sliceArgs]);

  const templateIds = useMemo(() => renderList.map(({ templateId }) => templateId), [renderList]);

  const loading = isLoading || isError || isUninitialized;

  const listContent = loading ? (
    <div className={baseAdminStyles.loadingWrapper}>
      <MoonLoader color={theme.palette.primary.main} />
    </div>
  ) : (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell id="project-template-name-heading" align="left" {...getCellProps('name')}>
              <TableSortLabel {...getSortLabelProps('name')}>Project Name</TableSortLabel>
            </TableCell>
            <TableCell align="left" {...getCellProps('templateId')} id="actions-heading">
              <TableSortLabel {...getSortLabelProps('templateId')}>Project Id</TableSortLabel>
            </TableCell>
            <TableCell align="center" id="admin-heading">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        {paginatedList.length ? (
          <TableBody>
            {paginatedList.map((projectTemplate) => (
              <ProjectTemplateRow
                key={projectTemplate.id}
                projectTemplate={projectTemplate}
                handleEdit={() => setEditProjectTemplate(projectTemplate.id ?? '')}
                handleDelete={() => setDeleteProjectTemplate(projectTemplate.id ?? '')}
              />
            ))}
          </TableBody>
        ) : (
          <TableEmptyBody id="project-templates-list-empty">No project templates found</TableEmptyBody>
        )}
        <TableFooter>
          <TableRow>
            <TablePagination {...getPaginationProps('project-templates-list')} />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.preTable}>
          <h2 className={styles.subtitle}>Project Templates</h2>
          <IconButton
            id="project-templates-refresh-button"
            sx={{ color: 'white' }}
            className={styles.refreshButton}
            onClick={refetch}
          >
            {isFetching ? (
              <span className={styles.loadingContainer}>
                <MoonLoader size={18} color={theme.palette.primary.main} />
              </span>
            ) : (
              <Refresh />
            )}
          </IconButton>
          <Button
            id="create-project-template-button"
            variant="outlined"
            startIcon={<AddCircleIcon />}
            color="secondary"
            sx={(theme) => theme.mixins.adminButton()}
            className={styles.createButton}
            onClick={() => setCreateProjectTemplateOpen(true)}
          >
            Add project template
          </Button>
        </div>
        {listContent}
      </div>
      <CreateOrEditProjectTemplateDialog
        open={createProjectTemplateOpen || !!templateMap?.[editProjectTemplate]}
        projectTemplate={templateMap?.[editProjectTemplate]}
        onClose={() =>
          templateMap?.[editProjectTemplate] ? setEditProjectTemplate('') : setCreateProjectTemplateOpen(false)
        }
        templateIds={templateIds}
      />
      <DeleteProjectTemplateDialog
        open={!!templateMap?.[deleteProjectTemplate]}
        onClose={() => setDeleteProjectTemplate('')}
        projectTemplate={templateMap?.[deleteProjectTemplate] ?? ({} as ProjectTemplate)}
      />
    </div>
  );
};

export default ProjectTemplates;
