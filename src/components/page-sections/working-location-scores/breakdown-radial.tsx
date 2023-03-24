import type { ApexOptions } from 'apexcharts';
// https://github.com/apexcharts/react-apexcharts/issues/240
import dynamic from 'next/dynamic';
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });
import { BAD_COLORS, OK_COLORS, GOOD_COLORS } from 'src/constants/graphic-options';
import { BAND_CONSTANTS, BAND_TYPE_SUFFERING, BAND_TYPE_SATISFIED, BAND_TYPE_FRUSTRATED } from 'src/constants/scores';
import useBreakpoint from 'src/hooks/use-breakpoint';
import { round } from 'src/logic/libs/helpers';
import type { WorkingLocationPercentages } from 'src/types/slices';

interface BreakdownProps {
  percentages: WorkingLocationPercentages;
  score: number;
}

type ApexOptionsExtension = {
  plotOptions?: {
    radialBar?: {
      dataLabels?: {
        total?: {
          hxScore?: number;
        };
      };
    };
  };
};

const BreakdownRadial = ({ percentages, score }: BreakdownProps) => {
  const matches = useBreakpoint('md');

  //We want them in this order, with the satisfied score around the outside.
  const scores = [round(percentages.satisfied, 1), round(percentages.frustrated, 1), round(percentages.suffering, 1)];

  const chartOptions: ApexOptions & ApexOptionsExtension = {
    chart: {
      type: 'radialBar',
    },
    stroke: {
      width: 15,
      lineCap: 'round',
    },
    states: {
      hover: {
        filter: {
          type: 'none',
        },
      },
    },
    labels: [
      BAND_CONSTANTS[BAND_TYPE_SATISFIED].title,
      BAND_CONSTANTS[BAND_TYPE_FRUSTRATED].title,
      BAND_CONSTANTS[BAND_TYPE_SUFFERING].title,
    ],
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 20,
          size: '60%',
          background: '#31185D',
        },
        track: {
          margin: 10,
          background: '#4D347A',
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: matches ? '16px' : '14px',
            fontFamily: 'mulish',
            fontWeight: 300,
            color: 'white',
            offsetY: matches ? 50 : 35,
          },
          value: {
            offsetY: matches ? 0 : -10,
            color: 'white',
            fontSize: matches ? '66px' : '32px',
            fontWeight: 700,
            fontFamily: 'mulish',
            show: true,
          },
          total: {
            show: true,
            label: 'HX Score',
            formatter: function ({ config }: { config: ApexOptions & ApexOptionsExtension }) {
              return `${config.plotOptions?.radialBar?.dataLabels?.total?.hxScore?.toFixed(1)}`;
            },
            color: 'white',
            fontWeight: 300,
            fontFamily: 'mulish',
            hxScore: score,
          },
        },
      },
    },
    colors: [GOOD_COLORS.start, OK_COLORS.start, BAD_COLORS.start],
  };

  return <ApexCharts options={chartOptions} series={scores} type="radialBar" height={matches ? 400 : 320} />;
};

export default BreakdownRadial;
