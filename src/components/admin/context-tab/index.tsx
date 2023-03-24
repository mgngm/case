import { useMemo, useState } from 'react';
import { Refresh } from '@mui/icons-material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { IconButton, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import { MoonLoader } from 'react-spinners';
import CreateDialog, { CreateType } from 'src/components/admin/context-tab/dialogs/create';
import styles from 'src/components/admin/context-tab/index.module.scss';
import PartnerContext from 'src/components/admin/context-tab/partner';
import type { Partner } from 'src/graphql';
import { AccessLevel } from 'src/graphql';
import { useAppSelector } from 'src/hooks';
import { createPartnerGroup } from 'src/logic/client/groups';
import { sortByKey } from 'src/logic/libs/helpers';
import { selectAvailablePartners, useGetUserContextQuery } from 'src/slices/context';
import { useCreatePartnerMutation } from 'src/slices/partners';
import { selectCurrentUserSub, selectUserAccessLevel } from 'src/slices/users';

const Context = () => {
  const theme = useTheme();
  const [partnerCreateOpen, setPartnerCreateOpen] = useState(false);
  const userSub = useAppSelector(selectCurrentUserSub);
  const userAccessLevel = useAppSelector(selectUserAccessLevel);
  const [createPartner, { isLoading: createIsLoading, reset: resetCreate }] = useCreatePartnerMutation({
    selectFromResult: ({ isLoading }) => ({ isLoading }),
  });

  const closePartnerCreate = () => setPartnerCreateOpen(false);

  const {
    data: availablePartners,
    isFetching,
    isError,
    isLoading,
    isUninitialized,
    refetch,
  } = useGetUserContextQuery(
    { userSub },
    {
      selectFromResult: ({ isFetching, isLoading, isError, data, isUninitialized }) => ({
        isFetching,
        isLoading,
        isError,
        isUninitialized,
        data: selectAvailablePartners(data),
      }),
    }
  );

  const hasData = !isLoading && !isError && !isUninitialized && !!availablePartners;
  const loading = (!isUninitialized && isLoading) || isFetching;

  const renderList = useMemo(() => availablePartners?.slice()?.sort(sortByKey('partnerName')), [availablePartners]);

  return (
    <div className={styles.contextContent}>
      <div className={styles.contextTitle}>
        <h2 className={styles.title}>Partners & Organisations</h2>
        <IconButton sx={{ color: 'white', ml: 1 }} onClick={refetch}>
          {isFetching ? (
            <span className={styles.loadingContainer}>
              <MoonLoader color={theme.palette.primary.main} size={18} />
            </span>
          ) : (
            <Refresh />
          )}
        </IconButton>
        {userAccessLevel === AccessLevel.GLOBAL && (
          <Button
            variant="outlined"
            color="secondary"
            sx={(theme) => ({ ...theme.mixins.adminButton(), ml: 'auto' })}
            startIcon={<AddCircleIcon />}
            onClick={() => setPartnerCreateOpen(true)}
          >
            Add partner
          </Button>
        )}
      </div>
      <div className={styles.partnerWrap}>
        {loading ? (
          <div className={styles.loader}>
            <MoonLoader color={theme.palette.primary.main} size={48} />
          </div>
        ) : hasData ? (
          renderList?.map((partner: Partner) => <PartnerContext partner={partner} key={partner.id} />)
        ) : (
          <p>No partners available</p>
        )}
      </div>
      {partnerCreateOpen ? (
        <CreateDialog
          type={CreateType.partner}
          partnerIds={availablePartners?.map(({ partnerId }) => partnerId) || []}
          isOpen={partnerCreateOpen}
          handleClose={closePartnerCreate}
          onAction={createPartner}
          reset={resetCreate}
          isLoading={createIsLoading}
          onSuccess={(response) => response?.data?.createPartner && createPartnerGroup(response?.data?.createPartner)}
        />
      ) : null}
    </div>
  );
};

export default Context;
