import type { ReactNode, Dispatch, SetStateAction, ComponentType } from 'react';
import { useState, useEffect } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import { Button } from '@mui/material';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import DataSwitcher from 'src/components/header/data-switcher';
import ProfileModal from 'src/components/header/nav-drawer/profile-modal';
import { PREVIEW_WHITELIST } from 'src/constants/display';
import {
  ADMIN_INSIGHTS_ROUTE,
  ADMIN_PARTNERS_ORGS_ROUTE,
  ADMIN_PREVIEW_ROUTE,
  ADMIN_PROJECTS_ROUTE,
  ADMIN_REPORTS_ROUTE,
  ADMIN_USERS_ROUTE,
  EMPLOYEES_ROUTE,
  HOME_ROUTE,
  HYBRID_ROUTE,
  LOGOUT_ROUTE,
  PROJECTS_INSIGHTS_ROUTE,
  PROJECTS_PROJECT_ROUTE,
  PROJECTS_SUMMARY_ROUTE,
} from 'src/constants/routes';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import useIsPreview from 'src/hooks/use-is-preview';
import BusinessImpactIcon from 'src/icons/nav/business-impact.svg';
import EmployeesIcon from 'src/icons/nav/employees.svg';
import HybridWorkingIcon from 'src/icons/nav/hybrid-working.svg';
import ImprovementsIcon from 'src/icons/nav/improvements.svg';
import ProfileIcon from 'src/icons/nav/profile.svg';
import ReportIcon from 'src/icons/nav/reports.svg';
import AdminIcon from 'src/icons/nav/settings.svg';
import { reportSelectorOpenStateChanged } from 'src/slices/dashboard';
import { selectCurrentUserSub, selectUserAttribute, useGetCurrentUserQuery } from 'src/slices/users';
import styles from './navigation.module.scss';

const NavItem = ({
  route,
  name,
  Icon,
  id,
  onClick,
  matchingRoutes,
}: {
  route?: string;
  name: string;
  // describe the props we intend to call it with, and let typescript work out if it's allowed
  Icon: ComponentType<{ width: number; height: number }>;
  id: string;
  onClick?: () => void;
  matchingRoutes?: string[];
}) => {
  const router = useRouter();
  const isPreview = useIsPreview();

  if (route && isPreview && !PREVIEW_WHITELIST.includes(route)) {
    return null;
  }

  const inner = (
    <div
      className={clsx(
        styles.menuItem,
        (router.pathname === route ||
          router.pathname === `${route}/` ||
          (matchingRoutes && matchingRoutes.includes(router.pathname))) &&
          styles.selected
      )}
    >
      <Icon width={25} height={25} />
      <span>{name}</span>
    </div>
  );

  if (!route && onClick) {
    return (
      <div id={id}>
        <Button
          onClick={(e) => {
            e.preventDefault();
            onClick();
          }}
          aria-label={id}
          className={styles.linkButton}
        >
          {inner}
        </Button>
      </div>
    );
  }

  if (route) {
    return (
      <div id={id}>
        <Button
          className={styles.linkButton}
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <Link
            href={isPreview ? `${route}?preview=true&dataKey=${router.query.dataKey}` : route}
            {...(onClick && {
              onClick: (e) => {
                e.preventDefault();
                onClick();
              },
            })}
          >
            {inner}
          </Link>
        </Button>
      </div>
    );
  }

  return null;
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

const Navigation = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const isPreview = useIsPreview();
  const dispatch = useAppDispatch();

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

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [disableProfileMenuItem, setDisableProfileMenuItem] = useState(false);

  useEffect(() => {
    checkSSOUser(setDisableProfileMenuItem, selectUserAttribute(user, 'identities'));
  }, [user, dispatch]);

  return (
    <div className={styles.navPageWrap}>
      <div className={styles.navBarOuter}>
        <div className={styles.navBarInner}>
          <div className={styles.navLogo}>
            <Link href={isPreview ? `${HOME_ROUTE}?preview=true&dataKey=${router.query.dataKey}` : HOME_ROUTE}>
              <a className={styles.topLeftLogo}>
                <Image
                  id="logo-arrow"
                  alt="Actual Experience"
                  src="/logo-icon.svg"
                  layout="fill"
                  objectFit="contain"
                  priority
                  className={styles.logoArrow}
                />
                <Image
                  id="logo-text"
                  alt="Actual Experience"
                  src="/logo-text.svg"
                  layout="fill"
                  objectFit="contain"
                  priority
                  className={styles.logoText}
                />
                {/* <Image id="logo-full" alt="Actual Experience" src="/logo.svg" layout="fill" objectFit="contain" priority className={styles.logoFull} /> */}
              </a>
            </Link>
          </div>
          <div className={styles.topMenuItems}>
            <NavItem
              route={HOME_ROUTE}
              name="Business Impact"
              id="business-impact-nav-link"
              Icon={BusinessImpactIcon}
            />
            <NavItem route={HYBRID_ROUTE} name="Hybrid Working" id="hybrid-nav-link" Icon={HybridWorkingIcon} />
            <NavItem
              route={PROJECTS_SUMMARY_ROUTE}
              name="Improvements"
              id="improvements-nav-link"
              Icon={ImprovementsIcon}
              matchingRoutes={[
                PROJECTS_SUMMARY_ROUTE,
                PROJECTS_PROJECT_ROUTE,
                PROJECTS_INSIGHTS_ROUTE,
                // sigh...
                `${PROJECTS_SUMMARY_ROUTE}/`,
                `${PROJECTS_PROJECT_ROUTE}/`,
                `${PROJECTS_INSIGHTS_ROUTE}/`,
              ]}
            />
            <NavItem route={EMPLOYEES_ROUTE} name="Your Employees" id="employees-nav-link" Icon={EmployeesIcon} />
          </div>
          <div className={styles.bottomMenuItems}>
            {user?.admin ? (
              <NavItem
                route={ADMIN_REPORTS_ROUTE}
                name="Admin"
                id="admin-nav-link"
                Icon={AdminIcon}
                matchingRoutes={[
                  ADMIN_REPORTS_ROUTE,
                  ADMIN_PREVIEW_ROUTE,
                  ADMIN_INSIGHTS_ROUTE,
                  ADMIN_PROJECTS_ROUTE,
                  ADMIN_USERS_ROUTE,
                  ADMIN_PARTNERS_ORGS_ROUTE,
                  // sigh...
                  `${ADMIN_REPORTS_ROUTE}/`,
                  `${ADMIN_PREVIEW_ROUTE}/`,
                  `${ADMIN_INSIGHTS_ROUTE}/`,
                  `${ADMIN_PROJECTS_ROUTE}/`,
                  `${ADMIN_USERS_ROUTE}/`,
                  `${ADMIN_PARTNERS_ORGS_ROUTE}/`,
                ]}
              />
            ) : null}
            {!isPreview ? (
              <>
                <NavItem
                  name="Report Data"
                  id="open-data-switcher"
                  Icon={ReportIcon}
                  onClick={() => dispatch(reportSelectorOpenStateChanged(true))}
                />
                {!disableProfileMenuItem ? (
                  <NavItem
                    name="Profile"
                    id="profile-nav-item"
                    Icon={ProfileIcon}
                    onClick={() => {
                      if (!disableProfileMenuItem) {
                        setShowProfileModal(true);
                      }
                    }}
                  />
                ) : null}
                <NavItem route={LOGOUT_ROUTE} name="Log out" id="logout-route-nav-link" Icon={LogoutIcon} />
              </>
            ) : null}
          </div>
        </div>
      </div>
      {children}
      {!isPreview ? <DataSwitcher /> : null}
      {!isPreview && !disableProfileMenuItem ? (
        <ProfileModal dialogState={showProfileModal} dialogFn={setShowProfileModal} user={user} />
      ) : null}
    </div>
  );
};

export default Navigation;
