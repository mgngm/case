import { useRef, useEffect } from 'react';
import type { RefObject } from 'react';
import clsx from 'clsx';
import * as d3 from 'd3';
import type { Selection } from 'd3';
import chartStyles from 'src/components/page-sections/report-blocks/base/bar-chart.module.scss';
import { BUSINESS_CHART_OPTIONS } from 'src/constants/graphic-options';
import {
  buildRoundedBarPath,
  calculateChartScales,
  clearChart,
  drawAxes,
  drawChartFrame,
  getMinMaxValues,
} from 'src/logic/libs/charts/bar-chart';
import { formatCount } from 'src/logic/libs/helpers';
import type { BusinessChartOptions, Scales } from 'src/types/scores';
import type { ChartTooltip } from 'src/types/slices';

const drawBars = (
  svg: Selection<SVGSVGElement | null, unknown, null, undefined>,
  tooltip: Selection<HTMLDivElement, unknown, null, undefined>,
  { xScale, yScale }: Scales,
  chartData: Record<string, number>,
  chartTooltip: Record<string, ChartTooltip>,
  chartOptions: BusinessChartOptions
) => {
  const x = (d: number): number => xScale(d) || 0;
  const y = (d: string): number => yScale(d) || 0;
  const width = (d: string | number): number => xScale(chartData[d]) - chartOptions.margins.left;
  const height = yScale.bandwidth() / 2;

  //Bars
  svg
    .selectAll('bars')
    .data(Object.keys(chartData))
    .enter()
    .append('path')
    .attr('d', buildRoundedBarPath(x, y, width, height, chartOptions.margins.left))
    .attr('class', (d) => chartStyles[d])
    .attr('transform', `translate(0,${yScale.bandwidth() / 4})`)
    .style('fill', 'url(#businessGradient)')
    .on('mouseover', (d, i) => {
      tooltip.transition().duration(100).style('opacity', 1);
      tooltip
        .html(
          `
            <div class="${chartStyles.tooltipWrapper}">
              <div class="${clsx(chartStyles.tooltipHeader, chartStyles[`tooltipHeader_${i}`])}">
                  <p>${i}</p>
              </div>
              <div class="${chartStyles.tooltipInner}">
                  <p>Employees: <b>${formatCount(chartTooltip[i]?.employees)}</b> </p>
                  <p>Total number of days lost: <b>${formatCount(chartTooltip[i]?.wastedDays)} days</b></p>
                  <p>Average number of days lost: <b>${formatCount(chartTooltip[i]?.mean)} days</b></p>
              </div>
            </div>
            `
        )
        .style('position', 'absolute');
    })
    .on('mouseout', () => {
      tooltip.transition().style('opacity', 0);
      tooltip.html('');
    })
    .on('mousemove', (d) => {
      tooltip.style('top', d.pageY - 100 + 'px').style('left', d.pageX + 5 + 'px');
    });

  // Create a gradient for our fill line (Colors are defined in the chart constants).
  const gradient = svg
    .append('defs')
    .append('linearGradient')
    .attr('id', 'businessGradient')
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '100%')
    .attr('y2', '100%')
    .attr('spreadMethod', 'pad');

  //Apply the gradient to the bar
  gradient
    .append('stop')
    .attr('offset', '0%')
    .attr('stop-color', chartOptions.colors.start ?? 'red')
    .attr('stop-opacity', 1);

  gradient
    .append('stop')
    .attr('offset', '100%')
    .attr('stop-color', chartOptions.colors.end ?? 'blue')
    .attr('stop-opacity', 1);
};

/**
 * Sets up chart svg, draws axes on the chart and then depending on if you're on the overview or breakdown view, will call the relevant draw function
 * @param svgRef - Ref of the SVG object we'll be drawing the chart in
 * @param data - formatted chart data
 * @param chartState - what chart view we're looking at.
 */
const drawBusinessChart = (
  svgRef: RefObject<SVGSVGElement>,
  wrapperRef: RefObject<HTMLDivElement>,
  chartData: Record<string, number>,
  chartTooltip: Record<string, ChartTooltip>
): void => {
  if (!chartData || chartData.length === 0) {
    return;
  }

  const svg = d3.select(svgRef.current);
  const wrapper = d3.select(wrapperRef.current);

  clearChart(svg, wrapper, BUSINESS_CHART_OPTIONS);

  //This needs to go after the cleaer as we remove the tooltip as a part of the clear
  const tooltip = wrapper.append('div').attr('class', chartStyles.tooltip).style('opacity', 0);
  const ranges = getMinMaxValues(chartData);

  const { xScale, yScale } = calculateChartScales(chartData, ranges.max, BUSINESS_CHART_OPTIONS);

  drawBars(svg, tooltip, { xScale, yScale }, chartData, chartTooltip, BUSINESS_CHART_OPTIONS);
  drawChartFrame(svg, { xScale, yScale }, chartData, BUSINESS_CHART_OPTIONS);
  drawAxes(svg, { xScale, yScale }, BUSINESS_CHART_OPTIONS, 'Average Days Lost', ranges.max, false, { y: -30, x: -60 });
};

//TODO: Fix parse to change x-axis values to be number of days lost, EMPLOYEE COUNT goes in the TOOLTIP item!
const BusinessChart = ({
  chartData,
  chartTooltip,
}: {
  chartData: Record<string, number>;
  chartTooltip: Record<string, ChartTooltip>;
}) => {
  const svg = useRef<SVGSVGElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    drawBusinessChart(svg, wrapper, chartData, chartTooltip);
  }, [svg, chartData, chartTooltip]);

  return (
    <>
      <div ref={wrapper} className={chartStyles.chartAreaWrapper}>
        <svg ref={svg} />
      </div>
    </>
  );
};

export default BusinessChart;
