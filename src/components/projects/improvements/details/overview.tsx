import { useCallback } from 'react';
import { getHxIcon } from 'src/components/employees/list/details/overview';
import { banding } from 'src/components/employees/list/list-row';
import StatusUpdate from 'src/components/projects/improvements/details/status-update';
import { ImprovementType } from 'src/components/projects/improvements/table';
import Hero from 'src/components/shared/hero';
import { DEFAULT_CURRENCY } from 'src/constants/report';
import type { Project } from 'src/graphql';
import useReport from 'src/hooks/use-report';
import DaysLostIcon from 'src/icons/report-blocks/days-lost.svg';
import EmployeesIcon from 'src/icons/report-blocks/group.svg';
import PayrollLostIcon from 'src/icons/report-blocks/payroll-lost.svg';
import { constructValueDisplayString, nonNullable } from 'src/logic/libs/helpers';
import { selectCurrency } from 'src/slices/dashboard';
import styles from './details.module.scss';

enum HeroType {
  HX_SCORE = 'hxScore',
  TIME_LOST = 'timeLost',
  PAYROLL = 'payroll',
  EMPLOYEE_COUNT = 'employeeCount',
}

const Overview = ({ project, refProject }: { project: Project; refProject?: Project }) => {
  const { report } = useReport();
  const currency = selectCurrency(report?.reportData) ?? DEFAULT_CURRENCY;

  const getHeroDeltaProps = useCallback(
    (heroType: HeroType) => {
      if (!refProject) {
        return {};
      }

      switch (heroType) {
        case HeroType.HX_SCORE: {
          if (nonNullable(refProject?.hxScore)) {
            return {
              deltaValue: refProject.hxScore,
              deltaString: `${Number(
                Math.abs(refProject.hxScore).toFixed(refProject.hxScore === 10 ? 0 : 1)
              )} ${banding(refProject.hxScore)}`,
              invert: true,
            };
          } else {
            return {};
          }
        }
        case HeroType.TIME_LOST: {
          if (nonNullable(refProject?.timeLost)) {
            return {
              deltaValue: refProject.timeLost,
              deltaString: `${constructValueDisplayString(refProject.timeLost)} days`,
            };
          } else {
            return {};
          }
        }
        case HeroType.PAYROLL: {
          if (nonNullable(refProject?.payroll)) {
            return {
              deltaValue: refProject.payroll,
              deltaString: `${constructValueDisplayString(refProject.payroll, 0, true, currency)}`,
            };
          } else {
            return {};
          }
        }
        case HeroType.EMPLOYEE_COUNT: {
          if (nonNullable(refProject?.employeeCount)) {
            return {
              deltaValue: refProject.employeeCount,
              deltaString: `${refProject.employeeCount ?? 0}`,
            };
          } else {
            return {};
          }
        }
        default:
          return {};
      }
    },
    [currency, refProject]
  );

  return (
    <div className={styles.tabContentWrap}>
      <h2>Overview</h2>
      <div className={styles.overviewInfo}>
        <div className={styles.tableWrap}>
          <table className={styles.infoTable}>
            <tbody>
              <tr>
                <td className={styles.labelWrapper}>
                  <label>Status:</label>
                </td>
                <td>
                  <StatusUpdate className={styles.projectInfo} project={project} />
                </td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td className={styles.labelWrapper}>
                  <label>Project ID:</label>
                </td>
                <td>
                  <span id="project-id" className={styles.projectInfo}>
                    {project.projectId ?? 'n/a'}
                  </span>
                </td>
              </tr>
              <tr>
                <td className={styles.labelWrapper}>
                  <label>Date identified:</label>
                </td>
                <td>
                  <span id="project-date" className={styles.projectInfo}>
                    {project.projectDate ?? 'n/a'}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <table className={styles.infoTable}>
            <tbody>
              <tr>
                <td className={styles.labelWrapper}>
                  <label>Improvement type:</label>
                </td>
                <td>
                  <span id="project-id" className={styles.projectInfo}>
                    {ImprovementType[project.projectType!] ?? 'n/a'}
                  </span>
                </td>
              </tr>
              <tr>
                <td className={styles.labelWrapper}>
                  <label>Date completed:</label>
                </td>
                <td>
                  <span id="project-complete" className={styles.projectInfo}>
                    {/* TODO: we don't know this info, show something else here */}
                    n/a
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className={styles.overviewMetrics}>
        <Hero
          id="project-hx-hero"
          className={styles.projectHero}
          icon={getHxIcon(project.hxScore ?? 0)}
          title="HX Score"
          subtitle={`${Number(Math.abs(project.hxScore ?? 0).toFixed((project.hxScore ?? 0) === 10 ? 0 : 1))} ${banding(
            project.hxScore ?? 0
          )}`}
          large
          value={project.hxScore ?? 0}
          {...getHeroDeltaProps(HeroType.HX_SCORE)}
        />
        <Hero
          id="project-du-hero"
          className={styles.projectHero}
          icon={EmployeesIcon}
          title="Employees Affected"
          subtitle={project.employeeCount ?? 0}
          large
          value={project.employeeCount ?? 0}
          {...getHeroDeltaProps(HeroType.EMPLOYEE_COUNT)}
        />
        <Hero
          id="project-timelost-hero"
          className={styles.projectHero}
          icon={DaysLostIcon}
          title="Average time lost"
          subtitle={`${constructValueDisplayString(project.timeLost ?? 0)} days`}
          large
          value={project.timeLost ?? 0}
          {...getHeroDeltaProps(HeroType.TIME_LOST)}
        />
        <Hero
          id="project-payroll-hero"
          className={styles.projectHero}
          icon={PayrollLostIcon}
          title="Payroll opportunity up to"
          subtitle={`${constructValueDisplayString(project.payroll ?? 0, 0, true, currency)}`}
          large
          value={project.payroll ?? 0}
          {...getHeroDeltaProps(HeroType.PAYROLL)}
        />
      </div>
    </div>
  );
};

export default Overview;
