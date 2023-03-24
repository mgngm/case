import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import { IconButton, TableCell, TableRow, Tooltip } from '@mui/material';
import ConfirmDeleteDialog from 'src/components/admin/context-tab/dialogs/delete';
import EditDialog, { EditType } from 'src/components/admin/context-tab/dialogs/edit';
import { DeleteType } from 'src/constants/api';
import type { Organisation } from 'src/graphql';
import { ContextStatus } from 'src/graphql';
import useContextInfo from 'src/hooks/use-context-info';
import { useEditOrganisationMutation } from 'src/slices/organisations';

const OrganisationRow = ({ organisation }: { organisation: Organisation }) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [editOrganisation, { isLoading: isEditLoading, reset: resetEdit }] = useEditOrganisationMutation({
    selectFromResult: ({ isLoading }) => ({ isLoading }),
  });

  const { organisationName, organisationId, id } = organisation;

  const contextInfo = useContextInfo();
  //Don't let the user delete/edit either their own org or the one they're currently looking at.
  const currentContextSelected = id === contextInfo.adminContext.id || id === contextInfo.userContext.id;
  return (
    <TableRow id={`organisation-row-${id}`}>
      <TableCell>{organisationId.split('/')[1]}</TableCell>
      <TableCell>{organisationName}</TableCell>
      <TableCell padding="checkbox">
        {organisation.status === ContextStatus.FOR_DELETION ? (
          <Tooltip title={'This org has been marked for deletion, it will disappear soon...'}>
            <span>
              <IconButton size="small" color="inherit" disabled={true} id={`deleting-org-icon-${id}`}>
                <HourglassTopIcon />
              </IconButton>
            </span>
          </Tooltip>
        ) : (
          <>
            <IconButton
              color="inherit"
              size="small"
              disabled={currentContextSelected}
              id={`edit-organisation-button-${id}`}
              onClick={() => {
                if (!currentContextSelected) {
                  setEditOpen(true);
                }
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color="inherit"
              size="small"
              disabled={currentContextSelected}
              id={`delete-organisation-button-${id}`}
              onClick={() => {
                if (!currentContextSelected) {
                  setDeleteOpen(true);
                }
              }}
            >
              <DeleteIcon />
            </IconButton>
          </>
        )}
      </TableCell>
      {deleteOpen ? (
        <ConfirmDeleteDialog
          type={DeleteType.organisation}
          displayName={organisation?.organisationName ?? 'N/A'}
          id={organisation.id}
          isOpen={deleteOpen}
          handleClose={() => setDeleteOpen(false)}
          contextInfo={organisation}
        />
      ) : null}

      {editOpen ? (
        <EditDialog
          organisation={organisation}
          type={EditType.organisation}
          isOpen={editOpen}
          handleClose={() => setEditOpen(false)}
          onAction={editOrganisation}
          reset={resetEdit}
          isLoading={isEditLoading}
        />
      ) : null}
    </TableRow>
  );
};

export default OrganisationRow;
