import { useRef, useState } from 'react';
import SortIcon from '@mui/icons-material/Sort';
import TocIcon from '@mui/icons-material/Toc';
import { ToggleButton, ToggleButtonGroup, toggleButtonGroupClasses } from '@mui/material';
import KeyDataTiles from 'src/components/page-sections/report-blocks/base/key-data-tiles';
import PageSection from 'src/components/ui/page-section';
import CarbonEmissionIcon from 'src/icons/report-blocks/carbon-emissions.svg';
import Co2 from 'src/icons/report-blocks/CO2.svg';
import styles from './carbon-emissions.module.scss';
import CarbonEmissionsChart from './chart';
import CarbonEmissionsTable from './table';

export type CarbonEmissionChartDatum = {
  locationName: string;
  employeeCount: number;
  co2TotalSaved: number;
  co2TotalPotential: number;
  co2AverageSaved: number;
  co2AveragePotential: number;
};

const keyData = [
  {
    label: 'Total CO2 Emissions from Office Commuting',
    datum: 100, //TODO : Create Datums out of this.
    Icon: CarbonEmissionIcon,
    // tooltip: CO2_WELLBEING_HEADLINE_TOOLTIP,
    key: 'carbon-emissions',
  },
  {
    label: 'Total CO2 Reduction from Remote Working',
    datum: 100,
    Icon: Co2,
    // tooltip: CO2_WELLBEING_HEADLINE_TOOLTIP,
    key: 'carbon-reductions',
  },
];

//Leave for debugging.
const dummyData: CarbonEmissionChartDatum[] = Array.from({ length: 10 }, (_, i) => i).map(() => ({
  locationName: 'Test Location 1',
  employeeCount: 100,
  co2TotalSaved: 70123,
  co2TotalPotential: 85992,
  co2AverageSaved: 123,
  co2AveragePotential: 456,
}));

const CarbonEmissions = () => {
  const wrapper = useRef<HTMLDivElement>(null);

  const [valueType, setValueType] = useState<'average' | 'total'>('total');
  const [viewType, setViewType] = useState<'asc' | 'desc' | 'table'>('desc');

  const content =
    viewType === 'table' ? (
      <CarbonEmissionsTable data={dummyData} />
    ) : (
      <CarbonEmissionsChart valueType={valueType} data={dummyData} />
    );

  return (
    <PageSection title="Carbon Emissions">
      <div className={styles.carbonEmissions}>
        <div className={styles.keyData}>
          {/** @ts-expect-error I havent' set the datums up yes, this will change. */}
          <KeyDataTiles data={keyData} />
        </div>
        <div className={styles.chartWrapper}>
          <div className={styles.chartInfo}>
            <span>CO2 Emissions reduced by Hybrid Working by Location </span>
            <div className={styles.chartTotalAveragePill}>
              <ToggleButtonGroup
                value={valueType}
                onChange={(e, val) => {
                  if (val !== null) {
                    setValueType(val);
                  }
                }}
                exclusive
                className={styles.dataTypePill}
                id="chart-view-type-wrapper"
                sx={{}}
              >
                <ToggleButton value={'total'} className={styles.dataType} id="chart-view-total-btn">
                  <div id="chart-view-total-btn-title" className={styles.pillText}>
                    Total per office
                  </div>
                </ToggleButton>
                <ToggleButton value={'average'} className={styles.dataType} id="chart-view-average-btn">
                  <div id="chart-view-average-btn-title" className={styles.pillText}>
                    Average Per Employee
                  </div>
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
          </div>
          <div>
            <div ref={wrapper} className={styles.chartAreaWrapper}>
              <div className={styles.chartViewButtons}>
                <ToggleButtonGroup
                  value={viewType}
                  onChange={(e, val) => {
                    if (val !== null) {
                      setViewType(val);
                    }
                  }}
                  exclusive
                  className={styles.dataTypePill}
                  id="chart-view-type-wrapper"
                  sx={{
                    '.MuiButtonBase-root': {
                      padding: '5px 10px',
                      borderRadius: '10px',
                      borderColor: '#53387e',
                    },
                    '.Mui-selected': {
                      fontWeight: 'regular',
                      color: 'white',
                      background: '#53387e',
                      borderColor: '#53387e',
                      [`&.${toggleButtonGroupClasses.grouped}:not(:first-of-type)`]: {
                        borderLeftColor: '#53387e',
                      },
                      [`svg`]: {
                        fill: 'white',
                      },
                    },
                    '.Mui-selected:hover': {
                      fontWeight: 'regular',
                      color: 'white',
                      background: '#53387e',
                      [`svg`]: {
                        fill: 'white',
                      },
                    },
                    '.MuiToggleButton-root:hover': {
                      fontWeight: 'regular',
                      color: 'white',
                      background: '#53387e',
                      [`svg`]: {
                        fill: 'white',
                      },
                    },
                  }}
                >
                  <ToggleButton value={'desc'} className={styles.dataType} id="chart-view-desc-btn">
                    <div id="chart-view-desc-btn-title" className={styles.pillIcon}>
                      <SortIcon />
                    </div>
                  </ToggleButton>
                  <ToggleButton value={'asc'} className={styles.dataType} id="chart-view-asc-btn">
                    <div id="chart-view-asc-btn-title" className={styles.pillIcon}>
                      <SortIcon className={styles.invertedSort} />
                    </div>
                  </ToggleButton>
                  <ToggleButton value={'table'} className={styles.dataType} id="chart-view-table-btn">
                    <div id="chart-view-table-btn-title" className={styles.pillIcon}>
                      <TocIcon />
                    </div>
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>

              {content}
            </div>
          </div>
        </div>
      </div>
    </PageSection>
  );
};

export default CarbonEmissions;
