/* eslint-disable @next/next/no-html-link-for-pages */ /* next/link doesn't seem to work with material-ui */
import { useEffect, useMemo, useState } from 'react';
import type { KeyboardEvent, MouseEvent, Dispatch, SetStateAction } from 'react';
import type { SvgIconComponent } from '@mui/icons-material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import headerStyles from 'src/components/header/header.module.scss';
import { NAV_MENU_ITEMS, PREVIEW_WHITELIST } from 'src/constants/display';
import { ADMIN_PREVIEW_ROUTE, ADMIN_REPORTS_ROUTE, ADMIN_ROUTE } from 'src/constants/routes';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import useBreakpoint from 'src/hooks/use-breakpoint';
import useIsPreview from 'src/hooks/use-is-preview';
import { selectCurrentUserSub, selectUserAttribute, useGetCurrentUserQuery } from 'src/slices/users';
import type { LocalUser } from 'src/types/user';
import styles from './nav-drawer.module.scss';
import ProfileModal from './profile-modal';

export interface NavItemProps {
  label: string;
  Icon: SvgIconComponent;
  subItems?: Omit<NavItemProps, 'subItems' | 'alwaysShowSubItems'>[]; // only allow one level of nesting
  href?: string;
  isSelected?: boolean;
  visible?: string;
  dialogFn?: Dispatch<SetStateAction<boolean>>;
  disabled?: boolean;
  className?: string;
  user?: LocalUser;
  id?: string;
}

const NavItem = ({ label, Icon, href, dialogFn, disabled, className, user, id, subItems }: NavItemProps) => {
  const router = useRouter();
  const preview = useIsPreview();

  const handleClick = (href: string | undefined) => {
    if (href) {
      let link = href;

      if (preview) {
        link = `${href}?preview=true&dataKey=${router.query.dataKey}`;
      }

      router.push(link);
    }
    dialogFn?.((curr) => !curr);
  };
  const adminDisabled = href === ADMIN_ROUTE && !user?.admin;
  const previewHidden = href === ADMIN_PREVIEW_ROUTE && router.pathname !== href;

  const subItemSelected = useMemo(
    () => subItems?.some(({ href }) => router.pathname === href),
    [subItems, router.pathname]
  );

  //Override for admin so it shows selected on any subroute.
  const selected = href === ADMIN_REPORTS_ROUTE ? router.pathname.includes(ADMIN_ROUTE) : router.pathname === href;
  return adminDisabled || previewHidden ? null : (
    <>
      <ListItemButton
        disabled={disabled}
        selected={selected}
        className={clsx(styles.navItem, subItemSelected && styles.subSelected, className)}
        onClick={() => handleClick(href)}
        id={id}
      >
        <ListItemIcon>
          <Icon className={styles.icon} />
        </ListItemIcon>
        <ListItemText primary={label} className={styles.label} />
      </ListItemButton>
      {subItems && (
        <div className={styles.subNavItems}>
          {subItems.map((item) => (
            <NavItem key={item.label} {...item} />
          ))}
        </div>
      )}
    </>
  );
};

/**
 * Checks if the user is on an SSO domain, so we don't show the account profile (you dont need it if you're sso)
 * @param setDisableProfileMenuItem - useState fn for the component.
 * @param domain - domain to be looked up
 */
const checkSSOUser = async (
  setDisableProfileMenuItem: Dispatch<SetStateAction<boolean>>,
  identities: string | undefined
) => {
  let res = false;

  if (identities) {
    try {
      const identitiesJson = JSON.parse(identities);
      res = identitiesJson[0]?.providerType === 'SAML';
    } catch (e) {
      console.error(e);
      //In case of emergency, scream and hide everything
      res = true;
    }
  }

  setDisableProfileMenuItem(res);
};

const NavDrawer = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const matches = useBreakpoint('md');
  const userSub = useAppSelector(selectCurrentUserSub);
  const { user } = useGetCurrentUserQuery(
    { userSub },
    {
      skip: !userSub,
      selectFromResult: ({ data }) => ({
        user: data,
      }),
    }
  );

  const dispatch = useAppDispatch();
  const toggleDrawer = (open: boolean) => (event: KeyboardEvent | MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as KeyboardEvent).key === 'Tab' || (event as KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setShowDrawer(open);
  };

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [disableProfileMenuItem, setDisableProfileMenuItem] = useState(false);

  const isPreview = useIsPreview();

  useEffect(() => {
    checkSSOUser(setDisableProfileMenuItem, selectUserAttribute(user, 'identities'));
  }, [user, dispatch]);

  return (
    <div className={headerStyles.menuIcon}>
      <ProfileModal dialogState={showProfileModal} dialogFn={setShowProfileModal} user={user} />
      <IconButton color="inherit" size="large" onClick={toggleDrawer(true)} id="open-nav-drawer">
        {matches ? <AccountCircleIcon /> : <MenuIcon />}
      </IconButton>
      <Drawer anchor="right" open={showDrawer} onClose={toggleDrawer(false)} className={styles.navDraw}>
        {!matches && (
          <IconButton sx={{ color: 'white' }} className={styles.closeNavButton} onClick={toggleDrawer(false)}>
            <CloseIcon />
          </IconButton>
        )}
        <List>
          <NavItem
            id="profile-nav-item"
            label={(selectUserAttribute(user, 'email') as string) || 'Profile'}
            Icon={AccountCircleIcon}
            dialogFn={disableProfileMenuItem ? undefined : setShowProfileModal}
            disabled={isPreview || disableProfileMenuItem}
            className={disableProfileMenuItem ? styles.disabledMenuItem : ''}
          />
          {/* list generation */}
          {NAV_MENU_ITEMS.map((item) =>
            isPreview ? (
              PREVIEW_WHITELIST.includes(item.href ?? '') ? (
                <NavItem key={item.label} {...item} user={user} />
              ) : null
            ) : (
              <NavItem key={item.label} {...item} user={user} />
            )
          )}
        </List>
      </Drawer>
    </div>
  );
};

export default NavDrawer;
