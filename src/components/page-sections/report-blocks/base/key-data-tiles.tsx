import type { FunctionComponent, SVGProps } from 'react';
import TooltipTarget from 'src/components/shared/tooltip-target';
import { constructValueDisplayString } from 'src/logic/libs/helpers';
import type { ReportBlockDatum } from 'src/types/slices';
import styles from './key-data-tiles.module.scss';

export interface KeyData {
  datum?: ReportBlockDatum;
  label: string;
  Icon: FunctionComponent<SVGProps<SVGSVGElement>>;
  tooltip?: string;
  key?: string;
}

const KeyDataTiles = ({ data, flexBasis = 160 }: { data: KeyData[]; flexBasis?: number }) => {
  return (
    <div className={styles.keyData}>
      {data.map(({ datum, label, Icon, tooltip, key }) => {
        let value: string | number = (datum?.value as number) ?? 0;
        let suffix = datum?.suffix ?? '';
        let prefix = datum?.prefix ?? '';

        //RELEASE WEEK HACKS !!!! Hide value, prefix & suffix if negative value.
        if (value === -1) {
          suffix = '';
          prefix = '';
          value = 'N/A';
        }
        /*
        //If we are looking at the CarbonReduction tile (this is the only override) t
        if (label === CO2_REDUCTION_LABEL) {
          //If it's a tiny value, we want to display it in kg rather than tonnes.
          if (typeof value !== 'string' && value < 0.01) {
            value *= 1000;
            suffix = 'kg'; //This should change from tonnes to kg
          }
        }
        */
        return (
          <div className={styles.tile} style={{ flexBasis: flexBasis, position: 'relative' }} key={key ?? label}>
            {tooltip ? (
              <div style={{ position: 'absolute', bottom: 0, right: 3 }}>
                <TooltipTarget tooltip={tooltip} />
              </div>
            ) : null}
            <div className={styles.tile__icon}>
              <Icon />
            </div>
            <div>
              <div className={styles.tile__label}>{label}</div>
              {value && (
                <div className={styles.tile__value}>{`${constructValueDisplayString(
                  value,
                  undefined,
                  undefined,
                  prefix
                )} ${suffix}`}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KeyDataTiles;
