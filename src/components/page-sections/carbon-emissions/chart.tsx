import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import * as d3 from 'd3';
import type { Selection } from 'd3';
import type { CarbonEmissionChartDatum } from 'src/components/page-sections/carbon-emissions';
import chartStyles from 'src/components/page-sections/report-blocks/base/bar-chart.module.scss';
import { CARBON_EMISSIONS_CHART_OPTIONS } from 'src/constants/graphic-options';
import { buildRoundedBarPath } from 'src/logic/libs/charts/bar-chart';
import { constructValueDisplayString } from 'src/logic/libs/helpers';
import type { Scales } from 'src/types/scores';
import styles from './carbon-emissions.module.scss';

type Offset = {
  x: number;
  y: number;
};

export const drawAxes = (
  svg: Selection<SVGSVGElement | null, unknown, null, undefined>,
  maxCarbonVal: number,
  { xScale, yScale }: Scales,
  xLabel: string,
  yLabel: string,
  offset: Offset = { x: 0, y: -32 }
) => {
  const xAxisYTranslate =
    CARBON_EMISSIONS_CHART_OPTIONS.dimensions.height - CARBON_EMISSIONS_CHART_OPTIONS.margins.bottom;

  //Inner dashed line height
  const innerTickHeight = xAxisYTranslate - CARBON_EMISSIONS_CHART_OPTIONS.margins.top;

  //Arbitrary - may be funky with different data sets.
  const ticks = 9;
  const tickValues = [];

  //Inner dashes - go and figure out where to put our lines and draw them on
  for (let i = 0; i <= ticks; i++) {
    const val = (maxCarbonVal / ticks) * i;
    tickValues.push(val);
    svg
      .append('line')
      .attr('class', chartStyles.innerTickDashed)
      .style('stroke-dasharray', '3, 3')
      .attr('transform', `translate(0, ${xAxisYTranslate})`)
      .attr('width', '1px')
      .attr('x1', xScale(val))
      .attr('x2', xScale(val))
      .attr('y1', '0')
      .attr('y2', innerTickHeight * -1);
  }

  //Draw the x axis on
  const xAxis = d3
    .axisBottom(xScale)
    .tickValues(tickValues)
    .tickFormat((d) => constructValueDisplayString(`${d}`, 1, true))
    .tickSize(3)
    .tickPadding(5);

  svg
    .append('g')
    .attr('transform', `translate(0, ${xAxisYTranslate})`)
    .attr('class', clsx(chartStyles.axis, styles.xAxis))
    .call(xAxis);

  const yAxis = d3
    .axisLeft(yScale)
    .tickSize(0)
    .tickFormat(() => '');

  svg
    .append('g')
    .attr('class', clsx([chartStyles.axis, chartStyles.noLine]))
    .attr('transform', `translate(${CARBON_EMISSIONS_CHART_OPTIONS.margins.left}, 0)`)
    .call(yAxis);

  //Draw X-Axis Label
  if (xLabel) {
    svg
      .append('text')
      .attr('class', styles.axisLabel)
      .attr('text-anchor', 'end')
      .attr('x', CARBON_EMISSIONS_CHART_OPTIONS.dimensions.width * 0.6 + offset.x)
      .attr('y', CARBON_EMISSIONS_CHART_OPTIONS.dimensions.height + offset.y)
      .text(xLabel);
  }

  //Draw y-Axis Label
  if (yLabel) {
    svg
      .append('text')
      .attr('class', styles.axisLabel)
      .attr('text-anchor', 'middle')
      .attr('transform', 'translate(-260,275)rotate(-90)') //this is hard coded and if we change the text w'ell need to figure something out - probably something smarter.
      .attr('x', CARBON_EMISSIONS_CHART_OPTIONS.margins.left * 0.5)
      .attr('y', CARBON_EMISSIONS_CHART_OPTIONS.dimensions.height * 0.5 + offset.y)
      .text(yLabel);
  }
};

const calculateChartScales = (chartData: CarbonEmissionChartDatum[], maxCarbonVal: number) => {
  //Calculate the pixels at which each axis should start/end
  const xAxisStart = 0 + CARBON_EMISSIONS_CHART_OPTIONS.margins.left;
  const xAxisEnd = CARBON_EMISSIONS_CHART_OPTIONS.dimensions.width - CARBON_EMISSIONS_CHART_OPTIONS.margins.right;
  const yAxisEnd = 0 + CARBON_EMISSIONS_CHART_OPTIONS.margins.top;
  const yAxisStart = CARBON_EMISSIONS_CHART_OPTIONS.dimensions.height - CARBON_EMISSIONS_CHART_OPTIONS.margins.bottom;

  //Create our scales
  const xScale = d3.scaleLinear().domain([0, maxCarbonVal]).range([xAxisStart, xAxisEnd]);
  const yScale = d3.scaleBand().domain(Object.keys(chartData)).rangeRound([yAxisStart, yAxisEnd]);

  return { xScale, yScale };
};

const labelYRatios = [0, 0.47, 0.47, 0.465, 0.44, 0.43, 0.43, 0.43, 0.43, 0.43, 0.43];
const barYRatios = [0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
const iconLabelYRatios = [0, 0.505, 0.515, 0.515, 0.53, 0.53, 0.53, 0.54, 0.54, 0.54, 0.54];
const barLabelYRatios = [0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];

const drawCarbonEmissionBars = (
  svg: Selection<SVGSVGElement | null, unknown, null, undefined>,
  data: CarbonEmissionChartDatum[],
  maxCarbonVal: number,
  { xScale, yScale }: Scales,
  savedKey: 'co2AverageSaved' | 'co2TotalSaved',
  potentialKey: 'co2AveragePotential' | 'co2TotalPotential'
) => {
  const x = (d: number): number => xScale(d) || 0;
  const y = (d: string): number => yScale(d) || 0;
  const savedWidth = (d: string | number): number =>
    xScale(data[d as number][savedKey]) - CARBON_EMISSIONS_CHART_OPTIONS.margins.left;

  const totalWidth = (d: string | number): number =>
    xScale(data[d as number][potentialKey]) - CARBON_EMISSIONS_CHART_OPTIONS.margins.left;

  const height = Math.min(yScale.bandwidth() * 0.5, 20);
  const labelYTranslate = yScale.bandwidth() * labelYRatios[data.length];
  const iconYTranslate = yScale.bandwidth() * iconLabelYRatios[data.length];
  const barLabelYTranslate = yScale.bandwidth() * barLabelYRatios[data.length];

  const selection = svg.selectAll('bars').data(Object.keys(data)).enter();

  //Bars
  selection
    .append('path')
    .attr('d', buildRoundedBarPath(x, y, totalWidth, height, CARBON_EMISSIONS_CHART_OPTIONS.margins.left))
    .attr('transform', `translate(0,${yScale.bandwidth() * barYRatios[data.length]})`)
    .attr('class', styles.totalBar);

  //Bars
  selection
    .append('path')
    .attr('d', buildRoundedBarPath(x, y, savedWidth, height, CARBON_EMISSIONS_CHART_OPTIONS.margins.left))
    .attr('transform', `translate(0,${yScale.bandwidth() * barYRatios[data.length]})`)
    .attr('class', styles.savedBar);

  selection
    .append('text')
    .attr('class', styles.barLabel)
    .attr('text-anchor', 'start')
    .attr('x', xScale(0))
    .attr('y', (d): number => yScale(d) || 0)
    .attr('transform', `translate(0,${labelYTranslate})`)
    .text((d) => data[parseInt(d)].locationName);

  selection
    .append('image')
    .attr('xlink:href', '/assets/charts/user-icon-white.svg')
    .attr('width', 15)
    .attr('height', 15)
    .attr('x', xScale(maxCarbonVal * 0.005))
    .attr('y', (d): number => yScale(d) || 0)
    .attr('transform', `translate(0,${iconYTranslate})`);

  selection
    .append('text')
    .attr('class', styles.barEmployeeCount)
    .attr('text-anchor', 'start')
    .attr('x', xScale(maxCarbonVal * 0.001))
    .attr('y', (d): number => (yScale(d) || 0) + 14)
    .attr('transform', `translate(25,${barLabelYTranslate})`)
    .text((d) => data[parseInt(d)].employeeCount);
};

/**
 * Draws the legend on the chart below the x-axis label
 * @param svg
 */
const drawLegend = (svg: Selection<SVGSVGElement | null, unknown, null, undefined>): void => {
  const legendY = CARBON_EMISSIONS_CHART_OPTIONS.dimensions.height - 5;
  const savedCarbonX = CARBON_EMISSIONS_CHART_OPTIONS.dimensions.width * 0.25;
  const totalCarbonX = CARBON_EMISSIONS_CHART_OPTIONS.dimensions.width * 0.36;
  const employeeCountX = CARBON_EMISSIONS_CHART_OPTIONS.dimensions.width * 0.6;

  const circleOffset = {
    x: -10,
    y: -5,
  };

  const imageOffset = {
    x: -18,
    y: -12,
  };

  svg.append('text').attr('class', styles.legend).attr('x', savedCarbonX).attr('y', legendY).text('CO2 Saved');
  svg
    .append('text')
    .attr('class', styles.legend)
    .attr('x', totalCarbonX)
    .attr('y', legendY)
    .text('Total Potential CO2 Emissions');
  svg
    .append('text')
    .attr('class', styles.legend)
    .attr('x', employeeCountX)
    .attr('y', legendY)
    .text('Total Employees At Location');

  svg
    .append('image')
    .attr('xlink:href', '/assets/charts/user-icon.svg')
    .attr('width', 15)
    .attr('height', 15)
    .attr('x', employeeCountX)
    .attr('y', legendY)
    .attr('transform', `translate(${imageOffset.x},${imageOffset.y})`);

  svg
    .append('circle')
    .attr('cy', legendY + circleOffset.y)
    .attr('cx', savedCarbonX + circleOffset.x)
    .attr('r', '5px')
    .attr('class', styles.savedBar);

  svg
    .append('circle')
    .attr('cy', legendY + circleOffset.y)
    .attr('cx', totalCarbonX + circleOffset.x)
    .attr('r', '5px')
    .attr('class', styles.totalBar);
};

const drawCarbonEmissionsChart = (
  svgRef: RefObject<SVGSVGElement>,
  data: CarbonEmissionChartDatum[],
  valueType: 'average' | 'total'
) => {
  //Select our svg ref so we can start putting things in it
  const svg = d3.select(svgRef.current);

  const viewbox = `0 0 ${CARBON_EMISSIONS_CHART_OPTIONS.dimensions.width} ${CARBON_EMISSIONS_CHART_OPTIONS.dimensions.height}`;
  svg.attr('viewBox', viewbox);

  //Remove basically everything from the chart to redraw
  svg.selectAll('g').remove();
  svg.selectAll('line').remove();
  svg.selectAll('path').remove();
  svg.selectAll('text').remove();
  svg.selectAll('bar').remove();
  svg.selectAll('rect').remove();
  svg.selectAll('circle').remove();
  svg.selectAll('image').remove();

  //Figure out which data we're looking at.
  const totalKey = valueType === 'average' ? 'co2AveragePotential' : 'co2TotalPotential';
  const savedKey = valueType === 'average' ? 'co2AverageSaved' : 'co2TotalSaved';

  //Find the maximum potential value to figure out how big our scale should be.
  const chartValues = data.map((_datum) => _datum[totalKey]);
  const max = d3.max(chartValues) as number;

  const scales = calculateChartScales(data, max);

  drawAxes(svg, max, scales, 'Amount of CO2 in Kg Tonnes', 'Location Name & Site Code');
  drawCarbonEmissionBars(svg, data, max, scales, savedKey, totalKey);
  drawLegend(svg);
};

const CarbonEmissionsChart = ({
  valueType,
  data,
}: {
  valueType: 'average' | 'total';
  data: CarbonEmissionChartDatum[];
}) => {
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    drawCarbonEmissionsChart(svg, data, valueType);
  }, [svg, data, valueType]);

  return (
    <>
      <svg ref={svg} />
    </>
  );
};

export default CarbonEmissionsChart;
