import clsx from 'clsx';
import type { Selection } from 'd3';
import * as d3 from 'd3';
import chartStyles from 'src/components/page-sections/report-blocks/base/bar-chart.module.scss';
import type { FormattedDUHXScore } from 'src/slices/du';
import type { HXOverTimeOptions, HXScales } from 'src/types/scores';

export const calculateHXChartScales = (data: FormattedDUHXScore[], chartOptions: HXOverTimeOptions) => {
  const innerWidth = chartOptions.dimensions.width - chartOptions.margins.left - chartOptions.margins.right;
  const xAxisStart = 0 + chartOptions.margins.left;
  const xAxisEnd = xAxisStart + innerWidth;

  const yAxisStart = chartOptions.dimensions.height - chartOptions.margins.bottom;
  const yAxisEnd = 0 + chartOptions.margins.top;

  //Create our scales
  const yScale = d3.scaleLinear().domain([0, 10]).range([yAxisStart, yAxisEnd]);

  const xBands = Object.keys(data);
  const xScale = d3.scaleBand().domain(xBands).rangeRound([xAxisStart, xAxisEnd]);

  const xLinear = d3.scaleLinear().domain([0, data.length]).range([xAxisStart, xAxisEnd]); //Linear scale for things like tick boundaries.

  return { xScale, yScale, xLinear };
};

type Offset = {
  x: number;
  y: number;
};

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export const drawHXChartAxes = (
  svg: Selection<SVGSVGElement | null, unknown, null, undefined>,
  data: FormattedDUHXScore[],
  { xScale, yScale, xLinear }: HXScales,
  chartOptions: HXOverTimeOptions,
  xLabel: string,
  yLabel: string,
  offset: Offset = { x: 0, y: -35 }
) => {
  //X axis first.
  const xAxis = d3
    .axisBottom(xScale)
    .tickFormat((d) => `${months[data[parseInt(d)]?.month]}`)
    .tickSize(0)
    .tickPadding(10);

  const xTickAxis = d3
    .axisBottom(xLinear)
    .tickFormat(() => '')
    .tickValues([...Array(data.length).keys()])
    .tickSize(10);

  const xAxisYTranslate = chartOptions.dimensions.height - chartOptions.margins.bottom;
  svg.append('g').attr('transform', `translate(0, ${xAxisYTranslate})`).attr('class', chartStyles.HXaxis).call(xAxis);
  svg
    .append('g')
    .attr('transform', `translate(0, ${xAxisYTranslate})`)
    .attr('class', chartStyles.HXaxis)
    .call(xTickAxis);

  const yAxis = d3
    .axisLeft(yScale)
    .tickSize(0)
    .tickFormat((d) => `${d}`)
    .tickPadding(15);

  svg
    .append('g')
    .attr('class', clsx([chartStyles.HXaxis, chartStyles.noLine]))
    .attr('transform', `translate(${chartOptions.margins.left}, 0)`)
    .call(yAxis);

  //Append a html title to each thing (in case something is sliced in half)
  svg
    .selectAll(`.${chartStyles.axis}>.tick`)
    .append('svg:title')
    .text((d) => d as string);

  //Draw X-Axis Label
  if (xLabel) {
    svg
      .append('text')
      .attr('class', chartStyles.axisLabel)
      .attr('text-anchor', 'end')
      .attr('x', chartOptions.dimensions.width * 0.53 + offset.x)
      .attr('y', chartOptions.dimensions.height + offset.y)
      .text(xLabel);
  }

  if (yLabel) {
    svg
      .append('text')
      .attr('class', chartStyles.axisLabel)
      .attr('text-anchor', 'middle')
      .attr('transform', 'translate(-145,225)rotate(-90)') //this is hard coded and if we change the text w'ell need to figure something out - probably something smarter.
      .attr('x', chartOptions.margins.left * 0.5)
      .attr('y', chartOptions.dimensions.height * 0.5 + offset.y)
      .text(yLabel);
  }
};

/**
 * Draws horizontal lines on the chart
 *
 * @param svg - svg selection
 * @param scales { xScale, yScale} - scales used to calculate your chart positioning
 * @param chartData - Chart Data Object
 * @param chartOptions - ChartOptions object.
 */
export const drawHXChartLines = (
  svg: Selection<SVGSVGElement | null, unknown, null, undefined>,
  { yScale }: HXScales,
  chartOptions: HXOverTimeOptions
) => {
  const chartData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  //Horizontal Lines
  svg
    .selectAll('.frameLines')
    .data(chartData)
    .enter()
    .append('line')
    .attr('x1', 0 + chartOptions.margins.left)
    .attr('x2', chartOptions.dimensions.width - chartOptions.margins.right)
    .attr('y1', (d) => yScale(d) || 0)
    .attr('y2', (d) => yScale(d) || 0)
    .attr('class', chartStyles.chartFrame);

  //boundary lines
  svg
    .append('line')
    .attr('class', chartStyles.satisfiedBoundary)
    .attr('x1', 0 + chartOptions.margins.left)
    .attr('x2', chartOptions.dimensions.width - chartOptions.margins.right)
    .attr('y1', yScale(8))
    .attr('y2', yScale(8));

  svg
    .append('line')
    .attr('class', chartStyles.frustratedBoundary)
    .attr('x1', 0 + chartOptions.margins.left)
    .attr('x2', chartOptions.dimensions.width - chartOptions.margins.right)
    .attr('y1', yScale(5))
    .attr('y2', yScale(5));
};

/**
 * Calculate a path to draw a vertical bar with rounded ends
 *
 * @param x function to calculate the x coordinate to start the bar -> Banded scale typically.
 * @param y function to calculate the y coordinate to start the bar -> Linear scale (HX Score.)
 * @param width width of the bars
 * @param chartData - > array of score objects
 * @param key - Key to specify which dat afrom the formatted DU Score object you want.
 * @param chartOptions - Chart meta, height/ margins etc.
 * @returns function to generate svg path string
 */
export const buildRoundedHXBarPath =
  (
    x: (v: string) => number,
    y: (v: number) => number,
    width: number,
    chartData: FormattedDUHXScore[],
    key: 'remoteHX' | 'officeHX' | 'overallHX',
    chartOptions: HXOverTimeOptions
  ) =>
  (d: string) => {
    const value = chartData[parseInt(d)][key];

    if (value <= 0) {
      return '';
    }

    let radius = key === 'overallHX' ? 25 : 13;

    // calculate the bar with the addition of the rounded end
    // such that the arc doesn't increase the total width
    const height = chartOptions.dimensions.height - chartOptions.margins.bottom - y(value);

    if (height <= radius) {
      radius = 5;
    }

    /**
     * M - MOVE to point
     * A - ARC around point
     * H - Horizontal line
     * V - Vertical Line
     */

    return `
      M${x(d)},${y(value) + radius} 
      a${radius},${radius} 0 0 1 ${radius},${-radius}
      h${width - 2 * radius}
      a${radius},${radius} 0 0 1 ${radius},${radius}
      v${height - radius}
      h${-width}Z
    `;
  };
