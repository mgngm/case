import { useEffect, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { ListItem, ListItemButton, ListItemIcon, ListItemText, Radio, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import List from '@mui/material/List';
import { MoonLoader } from 'react-spinners';
import userStyles from 'src/components/admin/users/index.module.scss';
import ButtonLoadingIndicator from 'src/components/shared/button/loader';
import Input from 'src/components/shared/input';
import type { Organisation, Partner } from 'src/graphql';
import { useAppSelector } from 'src/hooks';
import {
  selectGivenUserHomeContext,
  selectAllContexts,
  selectPrettyId,
  useGetUserContextQuery,
} from 'src/slices/context';
import { selectCurrentUserSub, useChangeUserContextMutation } from 'src/slices/users';
import type { LocalUser } from 'src/types/user';

type ContextManagementProps = {
  user: LocalUser;
  onClose: () => void;
  tabValue: number;
};

/**
 * Generate Context Display Name
 * @param context - Context to display
 * @returns
 */
const contextDisplayName = (context: Partner | Organisation): string => {
  let name = 'N/A';
  if (context) {
    if ('organisationName' in context && context.organisationName) {
      name = context.organisationName as string;
    }

    if ('partnerName' in context) {
      name = `${context?.partnerName} (Partner Level)`;
    }
  }
  return name;
};

const ContextManagement = ({ user, onClose, tabValue }: ContextManagementProps) => {
  const [dialogError, setDialogError] = useState<string>('');
  const [newContext, setNewContext] = useState<string>('');
  const theme = useTheme();
  useEffect(() => {
    setDialogError('');
  }, [tabValue]);

  const [changeUserContext, changeUserContextRes] = useChangeUserContextMutation();

  //Select Current User Contexts (to show which contexts we can move someone to now)
  const currentUserSub = useAppSelector(selectCurrentUserSub);
  const {
    data: currentUserContexts,
    rawData,
    isFetching: currentUserFetching,
    isLoading: currentUserLoading,
  } = useGetUserContextQuery(
    { userSub: currentUserSub },
    {
      selectFromResult: ({ isFetching, isLoading, data }) => ({
        isFetching,
        isLoading,
        data: data && selectAllContexts(data),
        rawData: data,
      }),
    }
  );

  //Get the selected Users Context so we can disable it from selection etc.
  const {
    isFetching: selectedUserFetching,
    isLoading: selectedUserLoading,
    data: selectedUserContexts,
  } = useGetUserContextQuery(
    { userSub: user.userSub },
    {
      selectFromResult: ({ isFetching, isLoading, data }) => ({
        isFetching,
        isLoading,
        data,
      }),
    }
  );

  const loading = currentUserFetching || selectedUserFetching || currentUserLoading || selectedUserLoading;

  const [selectedUserCtx, setSelectedUserContext] = useState<Partner | Organisation | null>(null);

  useEffect(() => {
    if (selectedUserContexts) {
      const userContext = selectGivenUserHomeContext(selectedUserContexts);
      if (userContext) {
        setSelectedUserContext(userContext);
      }
    }
  }, [selectedUserContexts, user]);

  if (loading) {
    return (
      <div className={userStyles.loadingSpinner}>
        <MoonLoader color={theme.palette.primary.main} />
      </div>
    );
  }

  const handleSave = async () => {
    const prettyID = selectPrettyId(rawData, selectedUserCtx?.id) ?? undefined;
    await changeUserContext({
      userSub: user.userSub,
      currentContext: prettyID,
      newContext,
    });
    onClose();
  };

  return (
    <>
      <div className={userStyles.contextManagement}>
        <div className={userStyles.contextSegment}>
          <span className={userStyles.dialogSubtitle}>User:</span>
          <Input className={userStyles.contextInput} value={user.email} disabled={true} />
        </div>
        <div className={userStyles.contextSegment}>
          <span className={userStyles.dialogSubtitle}>Context:</span>
          <Input
            className={userStyles.contextInput}
            value={selectedUserCtx ? contextDisplayName(selectedUserCtx) : 'N/A'}
            disabled={true}
          />
        </div>
        <div className={userStyles.contextSegmentColumn}>
          <span className={userStyles.contextListHeader}>
            <span className={userStyles.dialogSubtitle}>Available Contexts:</span>
            <Button disabled={newContext === ''} onClick={() => setNewContext('')}>
              Clear selection
            </Button>
          </span>
          <List className={userStyles.contextList}>
            {currentUserContexts?.map((_context) => {
              if (!_context) {
                return null;
              }
              const { id } = _context;
              const prettyId = selectPrettyId(rawData, id);
              const currentContext = id === selectedUserCtx?.id;
              const selectedContext = newContext === prettyId;
              const labelId = `checkbox-list-label-${id}`;
              return (
                <ListItem key={id} selected={currentContext} disablePadding>
                  <ListItemButton
                    role={undefined}
                    onClick={() => {
                      if (!currentContext) {
                        setNewContext(prettyId as string);
                      }
                    }}
                    dense
                  >
                    <ListItemIcon>
                      <Radio
                        edge="start"
                        checked={selectedContext}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={_context?.name} secondary={_context?.partnerName} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </div>
      </div>
      {dialogError ? <span className={userStyles.deleteUserError}>{dialogError}</span> : null}

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton
          loading={changeUserContextRes.isLoading}
          loadingIndicator={<ButtonLoadingIndicator />}
          disabled={newContext === ''}
          variant="contained"
          onClick={handleSave}
        >
          Confirm
        </LoadingButton>
      </DialogActions>
    </>
  );
};

export default ContextManagement;
