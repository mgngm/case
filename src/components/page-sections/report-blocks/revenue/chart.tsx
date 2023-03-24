import { useRef, useEffect } from 'react';
import type { RefObject } from 'react';
import * as d3 from 'd3';
import type { Selection } from 'd3';
import chartStyles from 'src/components/page-sections/report-blocks/base/bar-chart.module.scss';
import { REVENUE_CHART_OPTIONS } from 'src/constants/graphic-options';
import useReport from 'src/hooks/use-report';
import {
  buildRoundedBarPath,
  calculateChartScales,
  clearChart,
  drawAxes,
  drawChartFrame,
  getMinMaxValues,
} from 'src/logic/libs/charts/bar-chart';
import { constructValueDisplayString, formatCount, round } from 'src/logic/libs/helpers';
import { selectCurrency } from 'src/slices/dashboard';
import type { Scales } from 'src/types/scores';
import type { ChartTooltip } from 'src/types/slices';
import exports from 'styles/_exports.module.scss';

const drawBars = (
  svg: Selection<SVGSVGElement | null, unknown, null, undefined>,
  tooltip: Selection<HTMLDivElement, unknown, null, undefined>,
  { xScale, yScale }: Scales,
  chartData: Record<string, number>,
  chartTooltip: Record<string, ChartTooltip>,
  averageRevenue: number,
  currency = '£',
  chartOptions = REVENUE_CHART_OPTIONS
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
    .attr('transform', `translate(0,${yScale.bandwidth() / 4})`)
    .attr('class', (d) => chartStyles[d])
    .style('fill', 'url(#revenueGradient)')
    .on('mouseover', (d, i) => {
      tooltip.transition().duration(100).style('opacity', 1);
      tooltip
        .html(
          `
          <div class="${chartStyles.tooltipWrapper}">
          <div class="${chartStyles.tooltipHeader}">
              <p>${i}</p>
              </div>
              <div class="${chartStyles.tooltipInner}">
                  <p>Employees: <b>${formatCount(chartTooltip[i]?.employees || 0)}</b> </p>
                  <p>Revenue opportunity: <b>${constructValueDisplayString(
                    chartData[i] || 0,
                    1,
                    true,
                    currency
                  )}</b> </p>
                  <p>Mean operational Loss: <b>${constructValueDisplayString(
                    chartTooltip[i]?.mean || 0,
                    1,
                    true,
                    currency
                  )}</b></p>
                  <p>Average daily wasted minutes: <b>${formatCount(
                    round(chartTooltip[i]?.wastedMinutes || 0)
                  )} mins</b></p>
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
    .attr('id', 'revenueGradient')
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

  svg
    .append('line')
    .attr('x1', xScale(averageRevenue || 0))
    .attr('x2', xScale(averageRevenue || 0))
    .attr('y1', chartOptions.dimensions.height - chartOptions.margins.bottom)
    .attr('y2', chartOptions.margins.top)
    .style('stroke-dasharray', '3, 3')
    .attr('class', chartStyles.average);
};

const drawRevenueLegend = (
  svg: Selection<SVGSVGElement | null, unknown, null, undefined>,
  averageRevenue: number,
  currency = '£',
  chartOptions = REVENUE_CHART_OPTIONS
): void => {
  const legendY = chartOptions.dimensions.height - 20;
  const legendX = chartOptions.dimensions.width / 1.75;

  svg
    .append('text')
    .attr('class', chartStyles.legend)
    .attr('x', legendX)
    .attr('y', legendY)
    .text(`Average (${constructValueDisplayString(averageRevenue, 1, true, currency)})`);

  svg
    .append('text')
    .attr('class', chartStyles.legend)
    .attr('x', legendX - 100)
    .attr('y', legendY)
    .text(`Revenue ${currency}`);

  svg
    .append('line')
    .attr('x1', legendX - 5)
    .attr('x2', legendX - 15)
    .attr('y1', legendY - 5)
    .attr('y2', legendY - 5)
    .attr('class', chartStyles.average)
    .style('stroke-dasharray', '3, 3');

  svg
    .append('line')
    .attr('x1', legendX - 105)
    .attr('x2', legendX - 115)
    .attr('y1', legendY - 5)
    .attr('y2', legendY - 5)
    .style('stroke', chartOptions.colors?.start ?? exports.buttonLight)
    .style('stroke-width', 2);
};

/**
 * Sets up chart svg, draws axes on the chart and then depending on if you're on the overview or breakdown view, will call the relevant draw function
 * @param svgRef - Ref of the SVG object we'll be drawing the chart in
 * @param data - formatted chart data
 * @param chartState - what chart view we're looking at.
 */
const drawRevenueChart = (
  svgRef: RefObject<SVGSVGElement>,
  wrapperRef: RefObject<HTMLDivElement>,
  chartData: Record<string, number>,
  chartTooltip: Record<string, ChartTooltip>,
  currency = '£'
): void => {
  if (!chartData || chartData.length === 0) {
    return;
  }
  const svg = d3.select(svgRef.current);
  const wrapper = d3.select(wrapperRef.current);

  clearChart(svg, wrapper, REVENUE_CHART_OPTIONS);
  //This needs to go after the cleaer as we remove the tooltip as a part of the clear
  const tooltip = wrapper.append('div').attr('class', chartStyles.tooltip).style('opacity', 0);
  const ranges = getMinMaxValues(chartData);

  const { xScale, yScale } = calculateChartScales(chartData, ranges.max, REVENUE_CHART_OPTIONS);
  //Draw the average line now.
  const averageValue = d3.mean(Object.values(chartData)) || 0;

  drawBars(svg, tooltip, { xScale, yScale }, chartData, chartTooltip, averageValue, currency);
  drawChartFrame(svg, { xScale, yScale }, chartData, REVENUE_CHART_OPTIONS);
  drawAxes(svg, { xScale, yScale }, REVENUE_CHART_OPTIONS, `Revenue Opportunity (${currency})`, ranges.max, true, {
    x: -20,
    y: -45,
  });
  drawRevenueLegend(svg, averageValue, currency, REVENUE_CHART_OPTIONS);
};

const RevenueChart = ({
  chartData,
  chartTooltip,
}: {
  chartData: Record<string, number>;
  chartTooltip: Record<string, ChartTooltip>;
}) => {
  const svg = useRef<SVGSVGElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);

  const { report } = useReport();
  const currency = selectCurrency(report?.reportData);

  useEffect(() => {
    drawRevenueChart(svg, wrapper, chartData, chartTooltip, currency);
  }, [svg, chartData, chartTooltip, currency]);

  return (
    <>
      <div ref={wrapper} className={chartStyles.chartAreaWrapper}>
        <svg ref={svg} />
      </div>
    </>
  );
};

export default RevenueChart;
