import type { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';
import exports from 'styles/_exports.module.scss';

// https://github.com/apexcharts/react-apexcharts/issues/240
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

const SufferingGauge = ({ percentage, employeeCount }: { percentage: number; employeeCount: number }) => {
  const options: ApexOptions = {
    chart: {
      type: 'radialBar',
    },
    stroke: {
      lineCap: 'round',
    },
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 0,
          size: '65%',
        },
        track: {
          background: exports.bgChartTrack,
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: '20px',
            fontFamily: 'mulish',
            fontWeight: 300,
            color: exports.sufferingDark,
            offsetY: 40,
          },
          value: {
            offsetY: -10,
            show: true,
            color: 'white',
            fontSize: '42px',
            fontWeight: 600,
            fontFamily: 'mulish',
          },
        },
      },
    },
    fill: { colors: [exports.sufferingMain] },
    labels: [`(${employeeCount})`],
  };

  return <ApexCharts options={options} series={[percentage]} type="radialBar" height={320} />;
};

export default SufferingGauge;
