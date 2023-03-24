import type { ApexOptions } from 'apexcharts';
// https://github.com/apexcharts/react-apexcharts/issues/240
import dynamic from 'next/dynamic';
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });
import { BAD_COLORS, OK_COLORS, GOOD_COLORS } from 'src/constants/graphic-options';
import useBreakpoint from 'src/hooks/use-breakpoint';

interface KeyDataDonutProps {
  score: number;
}

const KeyDataDonut = ({ score }: KeyDataDonutProps) => {
  const matches = useBreakpoint('md');

  //Because score is out of 10 and we need it out of 100 we just multiply by 10.
  const radialScore = score < 0 ? 0 : score * 10;

  let barColor = BAD_COLORS.start;
  if (score >= 8) {
    barColor = GOOD_COLORS.start;
  } else if (score >= 5) {
    barColor = OK_COLORS.start;
  }

  //Have to set this or it matches bar color.
  const textColor = 'white';
  const chartOptions: ApexOptions = {
    chart: {
      type: 'radialBar',
    },
    stroke: {
      width: 20,
      lineCap: 'round',
    },
    states: {
      hover: {
        filter: {
          type: 'none',
        },
      },
    },
    labels: ['HX Score'],
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 100,
          size: '65%',
          background: '#31185D',
        },
        track: {
          background: '#4D347A',
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: matches ? '18px' : '16px',
            fontFamily: 'mulish',
            fontWeight: 300,
            color: textColor,
            offsetY: matches ? 50 : 35,
          },
          value: {
            offsetY: matches ? 0 : -10,
            color: textColor,
            fontSize: '50px',
            fontWeight: 700,
            fontFamily: 'mulish',
            show: true,
            //We format this this way as it's a number to a string back to a number, then we want to keep the decimal point.
            formatter: (val: number): string => (val === 0 ? 'N/A' : `${(val / 10).toFixed(1)}`),
          },
        },
      },
    },
    fill: {
      colors: [barColor],
    },
  };

  return <ApexCharts options={chartOptions} series={[radialScore]} type="radialBar" height={350} />;
};

export default KeyDataDonut;
