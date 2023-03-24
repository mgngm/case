import { useRef, useEffect } from 'react';
import type { RefObject } from 'react';
import * as d3 from 'd3';
import type { Selection } from 'd3';
import chartStyles from 'src/components/page-sections/report-blocks/base/bar-chart.module.scss';
import { PAYROLL_CHART_OPTIONS } from 'src/constants/graphic-options';
import useReport from 'src/hooks/use-report';
import {
  buildRoundedBarPath,
  calculateChartScales,
  clearChart,
  drawAxes,
  drawChartFrame,
  getMinMaxValues,
} from 'src/logic/libs/charts/bar-chart';
import { constructValueDisplayString, formatCount } from 'src/logic/libs/helpers';
import { selectCurrency } from 'src/slices/dashboard';
import type { Scales, BaseChartOptions } from 'src/types/scores';
import type { ChartTooltip } from 'src/types/slices';

const drawBars = (
  svg: Selection<SVGSVGElement | null, unknown, null, undefined>,
  tooltip: Selection<HTMLDivElement, unknown, null, undefined>,
  { xScale, yScale }: Scales,
  chartData: Record<string, number>,
  chartTooltip: Record<string, ChartTooltip>,
  chartOptions: BaseChartOptions
) => {
  const x = (d: number): number => xScale(d) || 0;
  const y = (d: string): number => yScale(d) || 0;
  const width = (d: string | number): number => xScale(chartData[d]) - chartOptions.margins.left;
  const height = yScale.bandwidth() / 2;

  //If the csv doesn't have a category we don't want to start throwing errors out
  const chartCategories =
    chartOptions.bandOverrides?.filter((payrollCat) => chartData[payrollCat]) || Object.keys(chartData);

  //Bars
  svg
    .selectAll('bars')
    .data(chartCategories)
    .enter()
    .append('path')
    .attr('d', buildRoundedBarPath(x, y, width, height, chartOptions.margins.left))
    .attr('class', (d) => chartStyles[d])
    .attr('transform', `translate(0,${yScale.bandwidth() / 4})`)
    .style('fill', chartOptions.colors?.gradient ? 'url(#payrollGradient)' : '')
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
                  ${
                    Object.keys(chartTooltip).length > 0
                      ? `<p>Employees: <b>${formatCount(chartTooltip[i].employees)}</b></p>`
                      : `<p><b>${constructValueDisplayString(chartData[i])}</b></p>`
                  }
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

  const maxValue = d3.max(Object.values(chartData)) || 10;
  const yTranslate = yScale.bandwidth() / 2 + 5;

  const xBarLabel = xScale(maxValue / 20) + 5;
  svg
    .selectAll('bars')
    .data(chartCategories)
    .enter()
    .append('text')
    .attr('class', chartStyles.barText)
    .attr('x', xBarLabel)
    .attr('y', (d): number => yScale(d) || 0)
    .text((d) => (chartTooltip[d] !== undefined ? constructValueDisplayString(chartTooltip[d]?.employees || 0) : ''))
    .attr('transform', `translate(0,${yTranslate})`);

  svg
    .selectAll('bars')
    .data(chartCategories)
    .enter()
    .append('image')
    .attr('xlink:href', '/assets/charts/user-icon.svg')
    .attr('width', (d) => (chartTooltip[d] !== undefined ? 20 : 0))
    .attr('height', 20)
    .attr('x', xBarLabel - 25)
    .attr('y', (d): number => yScale(d) || 0)
    .attr('transform', `translate(0,${yTranslate - 15})`); // 15 = height - padding = 20 - 5

  // Create a gradient for our fill line (Colors are defined in the chart constants).
  const gradient = svg
    .append('defs')
    .append('linearGradient')
    .attr('id', 'payrollGradient')
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
const drawPayrollChart = (
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

  clearChart(svg, wrapper, PAYROLL_CHART_OPTIONS);
  //This needs to go after the cleaer as we remove the tooltip as a part of the clear
  const tooltip = wrapper.append('div').attr('class', chartStyles.tooltip).style('opacity', 0);
  const ranges = getMinMaxValues(chartData);

  const { xScale, yScale } = calculateChartScales(chartData, ranges.max, PAYROLL_CHART_OPTIONS);

  drawBars(svg, tooltip, { xScale, yScale }, chartData, chartTooltip, PAYROLL_CHART_OPTIONS);
  drawChartFrame(svg, { xScale, yScale }, chartData, PAYROLL_CHART_OPTIONS);
  drawAxes(
    svg,
    { xScale, yScale },
    PAYROLL_CHART_OPTIONS,
    `Payroll Opportunity (${currency || '£'})`,
    ranges.max,
    true,
    {
      x: -60,
      y: -15,
    }
  );
};

const PayrollChart = ({
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
    drawPayrollChart(svg, wrapper, chartData, chartTooltip, currency);
  }, [svg, chartData, chartTooltip, currency]);

  return (
    <>
      <div ref={wrapper} className={chartStyles.chartAreaWrapper}>
        <svg ref={svg} />
      </div>
    </>
  );
};

export default PayrollChart;
