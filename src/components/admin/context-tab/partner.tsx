import { useMemo, useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Button from '@mui/material/Button';
import CreateDialog, { CreateType } from 'src/components/admin/context-tab/dialogs/create';
import ConfirmDeleteDialog from 'src/components/admin/context-tab/dialogs/delete';
import EditDialog, { EditType } from 'src/components/admin/context-tab/dialogs/edit';
import Organisations from 'src/components/admin/context-tab/organisations';
import { DeleteType } from 'src/constants/api';
import type { Partner } from 'src/graphql';
import { useAppSelector } from 'src/hooks';
import { createOrgGroup } from 'src/logic/client/groups';
import { selectAdminContextId, selectUserContextId } from 'src/slices/context';
import { useCreateOrganisationMutation } from 'src/slices/organisations';
import { useEditPartnerMutation } from 'src/slices/partners';
import styles from './partner.module.scss';

type PartnerContextProps = {
  partner: Partner;
};

const PartnerContext = ({ partner }: PartnerContextProps) => {
  const { partnerName, partnerId } = partner;

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [createOrgOpen, setCreateOrgOpen] = useState(false);

  const userContextId = useAppSelector(selectUserContextId);
  const adminContextId = useAppSelector(selectAdminContextId);

  const deleteDisabled = useMemo(() => {
    if (userContextId === partnerId || adminContextId === partnerId) {
      // we're in a partner context that matches this partner, so prevent delete
      return true;
    }

    if (userContextId.startsWith(`${partnerId}/`) || adminContextId.startsWith(`${partnerId}/`)) {
      // we're in an organisaton context that belongs to this partner, so prevent delete
      return true;
    }

    // you can delete this partner, go nuts!
    return false;
  }, [partnerId, userContextId, adminContextId]);

  const [createOrganisation, { isLoading: createIsLoading, reset: resetCreate }] = useCreateOrganisationMutation({
    selectFromResult: ({ isLoading }) => ({
      isLoading,
    }),
  });

  const [editPartner, { isLoading: editIsLoading, reset: resetEdit }] = useEditPartnerMutation({
    selectFromResult: ({ isLoading }) => ({ isLoading }),
  });

  return (
    <div className={styles.partnerWrapper}>
      <div className={styles.partnerTitle}>
        <h2 className={styles.partnerName}>
          <span>[{partnerId}]</span>
          {partnerName}
        </h2>
        <Button
          className={styles.deletePartnerButton}
          variant="text"
          color="error"
          onClick={() => setDeleteOpen(true)}
          disabled={deleteDisabled}
        >
          Delete partner
        </Button>
        <div className={styles.editPartnerButtonWrapper}>
          <Button className={styles.editPartnerButton} variant="text" color="primary" onClick={() => setEditOpen(true)}>
            Edit partner
          </Button>
        </div>
      </div>
      <div className={styles.orgTableWrapper}>
        <Organisations partner={partner} />
      </div>
      <div className={styles.createOrgButtonWrapper}>
        <Button
          variant="outlined"
          color="secondary"
          sx={(theme) => ({ ...theme.mixins.adminButton(), ml: 'auto' })}
          startIcon={<AddCircleIcon />}
          onClick={() => setCreateOrgOpen(true)}
          id="add-organisation-button"
        >
          Add organisation
        </Button>
      </div>
      {deleteOpen ? (
        <ConfirmDeleteDialog
          type={DeleteType.partner}
          id={partner.id}
          displayName={partner?.partnerName ?? 'N/A'}
          isOpen={deleteOpen}
          handleClose={() => setDeleteOpen(false)}
          contextInfo={partner}
        />
      ) : null}

      {editOpen ? (
        <EditDialog
          partner={partner}
          type={EditType.partner}
          isOpen={editOpen}
          handleClose={() => setEditOpen(false)}
          onAction={editPartner}
          reset={resetEdit}
          isLoading={editIsLoading}
        />
      ) : null}

      {createOrgOpen ? (
        <CreateDialog
          type={CreateType.organisation}
          partner={partner}
          isOpen={createOrgOpen}
          handleClose={() => setCreateOrgOpen(false)}
          onAction={createOrganisation}
          reset={resetCreate}
          isLoading={createIsLoading}
          onSuccess={(response) =>
            response?.data?.createOrganisation && createOrgGroup(response?.data?.createOrganisation)
          }
        />
      ) : null}
    </div>
  );
};

export default PartnerContext;
