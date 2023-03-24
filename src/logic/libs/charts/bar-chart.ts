import * as d3 from 'd3';
import type { Selection } from 'd3';
import { CarbonEmissionChartDatum } from 'src/components/page-sections/carbon-emissions';
import chartStyles from 'src/components/page-sections/report-blocks/base/bar-chart.module.scss';
import { constructValueDisplayString } from 'src/logic/libs/helpers';
import type { BaseChartOptions, BusinessChartOptions, Scales, WorstOfficesOptions } from 'src/types/scores';

type ChartRanges = {
  min: number;
  max: number;
  range: number;
};

/**
 * Uses D3 to calculate min/max values of the chart data, and also gives you the range, just in case.
 * @param {Record<string, number>} chartData
 * @returns {ChartRanges}
 */
export const getMinMaxValues = (chartData: Record<string, number>): ChartRanges => {
  const chartValues = Object.values(chartData);
  const min = d3.min(chartValues) as number;
  const max = d3.max(chartValues) as number;

  const range = max - min;

  return { range, min, max };
};

/**
 * Takes the maximum value of the X axis of a chart and splits it (hopefully) into equidistant tick values
 * @param {number} maxVal - Maximum value
 * @returns {number[]} array of tick values
 */
const calculateTickValues = (maxVal: number): number[] => {
  let numberOfTicks = 4;
  if (maxVal >= 1000) {
    //arbitrary, can change, answers on a postcard.
    numberOfTicks = 8;
  }

  //If we have a very low max val (say 7 from the first live data report) the scale can short out here and stop halfway. I'm going safe and saying anything less than 10 can stick at 10.
  if (maxVal < 10) {
    maxVal = 10;
  }

  //Calculate the interval based on how many ticks we want
  const interval = Math.floor(maxVal / numberOfTicks);
  const values = [];
  //Create an array of these values starting with 0 hopefully up to the max value)
  for (let i = 0; i <= numberOfTicks; i++) {
    values.push(i * interval);
  }

  return values;
};

/**
 * Draws a chart frame around the horizontal bars and one on the right side of the yaxis.
 *
 * @param svg - svg selection
 * @param scales { xScale, yScale} - scales used to calculate your chart positioning
 * @param chartData - Chart Data Object
 * @param chartOptions - ChartOptions object.
 */
export const drawChartFrame = (
  svg: Selection<SVGSVGElement | null, unknown, null, undefined>,
  { xScale, yScale }: Scales,
  chartData: Record<string, number> = {},
  chartOptions: BaseChartOptions | BusinessChartOptions
) => {
  const maxValue = d3.max(Object.values(chartData)) || 0;

  //Horizontal Lines
  svg
    .selectAll('.frameLines')
    .data(Object.keys(chartData))
    .enter()
    .append('line')
    .attr('x1', xScale(0))
    .attr('x2', xScale(maxValue))
    .attr('y1', (d): number => yScale(d) || 0)
    .attr('y2', (d): number => yScale(d) || 0)
    .attr('class', chartStyles.chartFrame);

  //Cheeky line on the far right of the x-axis (vertical)
  svg
    .append('line')
    .attr('x1', xScale(maxValue))
    .attr('x2', xScale(maxValue))
    .attr('y1', chartOptions.dimensions.height - chartOptions.margins.bottom || 0)
    .attr('y2', chartOptions.margins.top)
    .attr('class', chartStyles.chartFrame);
};

/**
 * Calculates chart scales
 * @param chartData - raw chart data, for things like max values
 * @param chartOptions - Chart options (dimensions, margins etc.)
 * @returns Scales
 */
export const calculateChartScales = (
  chartData: Record<string, any>,
  maxValue = 1,
  chartOptions: BaseChartOptions | BusinessChartOptions | WorstOfficesOptions
) => {
  const chartMaxVal = maxValue > 0 ? maxValue : 1;

  const innerWidth = chartOptions.dimensions.width - chartOptions.margins.left - chartOptions.margins.right;

  const xAxisStart = 0 + chartOptions.margins.left;
  const xAxisEnd = xAxisStart + innerWidth;
  const yAxisEnd = 0 + chartOptions.margins.top;
  const yAxisStart = chartOptions.dimensions.height - chartOptions.margins.bottom;

  //Create our scales
  let yBands = Object.keys(chartData);
  if (chartOptions.bandOverrides) {
    if (!Array.isArray(chartOptions.bandOverrides) && chartOptions.bandOverrides?.sortKey === 'hxScore') {
      yBands = Object.keys(chartData).sort((a, b) => chartData[b].hxScore - chartData[a].hxScore);
    } else {
      yBands = chartOptions.bandOverrides as string[];
    }
  }
  const yScale = d3.scaleBand().domain(yBands).rangeRound([yAxisStart, yAxisEnd]);
  const xScale = d3.scaleLinear().domain([0, chartMaxVal]).range([xAxisStart, xAxisEnd]);

  return { xScale, yScale };
};

type Offset = {
  x: number;
  y: number;
};

export const drawAxes = (
  svg: Selection<SVGSVGElement | null, unknown, null, undefined>,
  { xScale, yScale }: Scales,
  chartOptions: BaseChartOptions | BusinessChartOptions,
  xLabel: string,
  maxVal = 1,
  formatCounts = true,
  offset: Offset = { x: 0, y: 0 }
) => {
  //X axis first.
  const tickValues = calculateTickValues(maxVal);
  const xAxis = d3
    .axisBottom(xScale)
    .tickFormat((d) => constructValueDisplayString(`${d}`, 1, formatCounts))
    .tickValues(tickValues)
    .tickSize(10)
    .tickPadding(10);

  const xAxisYTranslate = chartOptions.dimensions.height - chartOptions.margins.bottom;
  svg.append('g').attr('transform', `translate(0, ${xAxisYTranslate})`).attr('class', chartStyles.axis).call(xAxis);

  const yAxis = d3
    .axisLeft(yScale)
    .tickSize(0)
    .tickFormat((d) => (d.length > 9 ? `${d.slice(0, 8)}...` : d))
    .tickPadding(15);

  svg
    .append('g')
    .attr('class', chartStyles.axis)
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
      .attr('x', chartOptions.dimensions.width / 1.4 + offset.x)
      .attr('y', chartOptions.dimensions.height + offset.y)
      .text(xLabel);
  }
};

export const clearChart = (
  svg: Selection<SVGSVGElement | null, unknown, null, undefined>,
  wrapper: Selection<HTMLDivElement | null, unknown, null, undefined> | null,
  chartOptions: BaseChartOptions | BusinessChartOptions | WorstOfficesOptions
) => {
  //Clear any rogue tooltips from the chart.
  wrapper && wrapper.selectAll('div').remove();

  //Remove basically everything from the chart
  svg.selectAll('g').remove();
  svg.selectAll('line').remove();
  svg.selectAll('path').remove();
  svg.selectAll('text').remove();
  svg.selectAll('bar').remove();
  svg.selectAll('rect').remove();
  svg.selectAll('defs').remove();
  svg.selectAll('image').remove();

  //Set viewbox why not
  const viewbox = `0 0 ${chartOptions.dimensions.width} ${chartOptions.dimensions.height}`;
  svg.attr('viewBox', viewbox);
};

/**
 * Calculate a path to draw a bar with rounded ends
 *
 * @param x function to calculate the x coordinate to start the bar
 * @param y function to calculate the y coordinate to start the bar
 * @param widthFn function to calculate the width of the bar
 * @param height height of the bar
 * @returns function to generate svg path string
 */
export const buildRoundedBarPath =
  (
    x: (v: number) => number,
    y: (v: string) => number,
    widthFn: (d: string | number) => number,
    height: number,
    offset = 0
  ) =>
  (d: string) => {
    if (widthFn(d) <= 0) {
      return '';
    }

    // calculate the bar with the addition of the rounded end
    // such that the arc doesn't increase the total width
    const arcWidth = widthFn(d) - height / 2;
    const width = Math.max(x(0) - offset, arcWidth);

    if (arcWidth <= 0) {
      // arc by the width and adjust y position to center the now smaller bar
      return `m ${x(0)} ${y(d) + widthFn(d) + 3} l 0 0 a 1 1 0 0 1 0 ${widthFn(d)}`;
    }
    // return the path
    return `m ${x(0)} ${y(d)} l ${width} 0 a 1 1 0 0 1 0 ${height} l ${width * -1} 0`;
  };
