/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useCallback } from 'react';
import { banding } from 'src/components/employees/list/list-row';
import Hero from 'src/components/shared/hero';
import TooltipTarget from 'src/components/shared/tooltip-target';
import { DEFAULT_CURRENCY } from 'src/constants/report';
import type { DU } from 'src/graphql';
import useReport from 'src/hooks/use-report';
import DaysLostIcon from 'src/icons/report-blocks/days-lost.svg';
import RevenueIcon from 'src/icons/report-blocks/du-revenue.svg';
import FrustratedIcon from 'src/icons/report-blocks/frustrated.svg';
import PayrollLostIcon from 'src/icons/report-blocks/payroll-lost.svg';
import SatisfiedIcon from 'src/icons/report-blocks/satisfied.svg';
import SufferingIcon from 'src/icons/report-blocks/suffering.svg';
import { constructValueDisplayString, nonNullable } from 'src/logic/libs/helpers';
import { selectAllReportBlocks, selectCurrency } from 'src/slices/dashboard';
import { useGetDuByNameAndReportQuery } from 'src/slices/du';
import type { BusinessBlockData } from 'src/types/slices';
import styles from './overview.module.scss';

export const getHxIcon = (score: number) => {
  switch (true) {
    case score < 5:
      return SufferingIcon;
    case score < 8:
      return FrustratedIcon;
    default:
      return SatisfiedIcon;
  }
};

type OverviewProps = {
  employee: DU;
};

enum HeroType {
  HX_SCORE = 'hxScore',
  TIME_LOST = 'timeLost',
  PAYROLL = 'payroll',
  REVENUE = 'revenue',
}

const Overview = ({ employee }: OverviewProps) => {
  const { report, ids } = useReport();
  const { refReportId } = ids;

  // persona term name (ie "Organisation") is stored in business block data
  // so we can use the report to get it, rather than a new query
  const blocks = selectAllReportBlocks(report?.reportData);
  const blockData = blocks?.businessBlockData as BusinessBlockData;

  const currency = selectCurrency(report?.reportData) ?? DEFAULT_CURRENCY;

  const { data: refDu } = useGetDuByNameAndReportQuery(
    {
      name: employee.name!,
      reportId: refReportId!,
    },
    {
      skip: !refReportId || !employee || !employee.name,
      selectFromResult: ({ data }) => ({ data: data?.data?.[0] }), // DU name is unique within a report so we can safely grab the first
    }
  );

  const getHeroDeltaProps = useCallback(
    (heroType: HeroType) => {
      if (!refDu) {
        return {};
      }

      switch (heroType) {
        case HeroType.HX_SCORE: {
          if (nonNullable(refDu?.hxScore)) {
            return {
              deltaValue: refDu.hxScore,
              deltaString: `${Number(Math.abs(refDu.hxScore).toFixed(refDu.hxScore === 10 ? 0 : 1))} ${banding(
                refDu.hxScore
              )}`,
              invert: true,
            };
          } else {
            return {};
          }
        }
        case HeroType.TIME_LOST: {
          if (nonNullable(refDu?.timeLost)) {
            return {
              deltaValue: refDu.timeLost,
              deltaString: `${constructValueDisplayString(refDu.timeLost)} days`,
            };
          } else {
            return {};
          }
        }
        case HeroType.PAYROLL:
        case HeroType.REVENUE: {
          if (nonNullable(refDu?.[heroType])) {
            return {
              deltaValue: refDu[heroType],
              deltaString: `${constructValueDisplayString(refDu[heroType]!, 0, true, currency)}`,
            };
          } else {
            return {};
          }
        }
        default:
          return {};
      }
    },
    [currency, refDu]
  );

  return (
    <div className={styles.overviewWrapper}>
      <h2 className={styles.heading}>Overview</h2>
      <div className={styles.duInfoWrapper}>
        <table className={styles.infoTable}>
          <tbody>
            <tr>
              <td className={styles.labelWrapper}>
                <label>DU:</label>
              </td>
              <td>
                <span id="employee-name" className={styles.duInfo}>
                  {employee.name ?? 'Digital user'}
                </span>
              </td>
            </tr>
            <tr>
              <td className={styles.labelWrapper}>
                <label>Country:</label>
              </td>
              <td>
                <span id="employee-country" className={styles.duInfo}>
                  {employee.country ?? 'Unknown'}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <table className={styles.infoTable}>
          <tbody>
            <tr>
              <td className={styles.labelWrapper}>
                <label>Office:</label>
                <TooltipTarget tooltip="The office location where the employee has spent the majority of their time based on connectivity." />
              </td>
              <td>
                <span id="employee-office" className={styles.duInfo}>
                  {employee.office ?? 'Remote'}
                </span>
              </td>
            </tr>
            <tr>
              <td className={styles.labelWrapper}>
                <label>{blockData?.metrics.personaTerm.value ?? 'Persona'}:</label>
              </td>
              <td>
                <span id="employee-persona" className={styles.duInfo}>
                  {employee.persona ?? 'Unknown'}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={styles.duMetricsWrapper}>
        <Hero
          id="employee-hx-hero"
          className={styles.employeeHero}
          icon={getHxIcon(employee.hxScore ?? 0)}
          title="HX Score"
          subtitle={`${Number(
            Math.abs(employee.hxScore ?? 0).toFixed((employee.hxScore ?? 0) === 10 ? 0 : 1)
          )} ${banding(employee.hxScore ?? 0)}`}
          large
          value={employee.hxScore ?? 0}
          {...getHeroDeltaProps(HeroType.HX_SCORE)}
        />
        <Hero
          id="employee-timelost-hero"
          className={styles.employeeHero}
          icon={DaysLostIcon}
          title="Average time lost"
          subtitle={`${constructValueDisplayString(employee.timeLost ?? 0)} days`}
          large
          value={employee.timeLost ?? 0}
          {...getHeroDeltaProps(HeroType.TIME_LOST)}
        />
        <Hero
          id="employee-payroll-hero"
          className={styles.employeeHero}
          icon={PayrollLostIcon}
          title="Payroll lost"
          subtitle={`${constructValueDisplayString(employee.payroll ?? 0, 0, true, currency)}`}
          large
          value={employee.payroll ?? 0}
          {...getHeroDeltaProps(HeroType.PAYROLL)}
        />
        <Hero
          id="employee-revenue-hero"
          className={styles.employeeHero}
          icon={RevenueIcon}
          title="Revenue opportunity"
          subtitle={`${constructValueDisplayString(employee.revenue ?? 0, 0, true, currency)}`}
          large
          value={employee.revenue ?? 0}
          {...getHeroDeltaProps(HeroType.REVENUE)}
        />
      </div>
    </div>
  );
};

export default Overview;
