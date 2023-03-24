import type { ApexOptions } from 'apexcharts';
// https://github.com/apexcharts/react-apexcharts/issues/240
import dynamic from 'next/dynamic';
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

type DonutProps = {
  series: number;
  color: string;
};

const ChartDonut = ({ series, color }: DonutProps) => {
  const chartOptions: ApexOptions = {
    chart: {
      type: 'radialBar',
    },
    stroke: {
      lineCap: 'butt',
    },
    colors: [color],
    states: {
      hover: {
        filter: {
          type: 'none',
        },
      },
    },
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 0,
          size: '32%',
          background: '#fff',
        },
        track: {
          background: '#EAEEF8',
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            offsetY: 5,
            color,
            fontSize: '13px',
            fontWeight: 700,
            show: true,
            formatter: (val: number): string => `${val}%`,
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        gradientToColors: [color],
        stops: [0, 100],
      },
    },
  };

  return <ApexCharts options={chartOptions} series={[series]} type="radialBar" width={160} />;
};

export default ChartDonut;
