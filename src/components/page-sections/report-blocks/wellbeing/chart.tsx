import { useRef, useEffect, useState } from 'react';
import type { RefObject } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import clsx from 'clsx';
import * as d3 from 'd3';
import type { Selection, ScaleLinear } from 'd3';
import chartStyles from 'src/components/page-sections/report-blocks/base/bar-chart.module.scss';
import { WELLBEING_CHART_OPTIONS } from 'src/constants/graphic-options';
import { OVERVIEW_DATA_VIEW_STRING, TOP_10_DATA_VIEW_STRING, BOTTOM_90_DATA_VIEW_STRING } from 'src/constants/scores';
import { calculateChartScales } from 'src/logic/libs/charts/wellbeing';
import { constructValueDisplayString, formatCount } from 'src/logic/libs/helpers';
import { pluralise } from 'src/logic/libs/string';
import type { BreakdownCoordinates, DatumCoordinates, FormattedWellbeingChartData } from 'src/types/scores';

/**
 * Draws the axes on the wellbeing chart
 * @param svg - D3 selection object
 * @param chartData - Formatted chart data for rendering
 */
const drawAxes = (
  svg: Selection<SVGSVGElement | null, unknown, null, undefined>,
  maxEmployees: number,
  startEmployees = 0,
  //eslint-disable-next-line
  { xScale, yScale }: { xScale: ScaleLinear<number, number, any>; yScale: ScaleLinear<number, number, any> }
): void => {
  //Calculate inner width of chart for our gridline size.
  const xTotalMargin = WELLBEING_CHART_OPTIONS.margins.left + WELLBEING_CHART_OPTIONS.margins.right;
  const innerWidth = WELLBEING_CHART_OPTIONS.dimensions.width - xTotalMargin;

  // Create the Axis objects using d3 magic.
  const xAxis = d3.axisBottom(xScale).tickValues([startEmployees, maxEmployees]).tickSize(0).tickPadding(15); //we only want two ticks on the bottom axis, 0 and max employees.
  const yAxis = d3.axisLeft(yScale).tickSize(0).tickPadding(15);
  const yAxisGrid = d3
    .axisLeft(yScale)
    .tickSize(-innerWidth) //negative inner width here so it goes into the graph as a gridline.
    //You need a fn here for typing.
    .tickFormat(() => ''); //We want no tick text on this gridline thing

  //See how far we need to bump the x-axis so it's at the bottom of the chart rather than the top.
  const xAxisYTranslate = WELLBEING_CHART_OPTIONS.dimensions.height - WELLBEING_CHART_OPTIONS.margins.bottom;

  //Add our grid lines (we do this first so the bottom axis line just draws over the bottom 'tick' and it doesn't look weird.)
  svg
    .append('g')
    .attr('class', chartStyles.yAxisGrid)
    .attr('transform', `translate(${WELLBEING_CHART_OPTIONS.margins.left}, 0)`)
    .call(yAxisGrid);

  //Draw x & y axes.
  svg.append('g').attr('transform', `translate(0, ${xAxisYTranslate})`).attr('class', chartStyles.axis).call(xAxis);
  svg
    .append('g')
    .attr('class', chartStyles.axis)
    .attr('transform', `translate(${WELLBEING_CHART_OPTIONS.margins.left}, 0)`)
    .call(yAxis)
    //Hides the main axis line
    .call((g) => g.select('.domain').remove());

  //Append axis labels.
  svg
    .append('text')
    .attr('class', chartStyles.axisLabel)
    .attr('text-anchor', 'end')
    .attr('y', 10)
    .attr('x', -WELLBEING_CHART_OPTIONS.dimensions.height / 2 + 80)
    .attr('dy', '.75em')
    .attr('transform', 'rotate(-90)')
    .text('Number of Days Lost');

  svg
    .append('text')
    .attr('class', chartStyles.axisLabel)
    .attr('text-anchor', 'end')
    .attr('x', WELLBEING_CHART_OPTIONS.dimensions.width / 1.5)
    .attr('y', WELLBEING_CHART_OPTIONS.dimensions.height - 50)
    .text('Number Of Employees');
};

/**
 * Draws the overview chart lines (so curvy line & average line)
 * @param svg - D3 SVG selection
 * @param data - Formatted chart data for rendering.
 */
const drawOverviewChartLines = (
  svg: Selection<SVGSVGElement | null, unknown, null, undefined>,
  data: FormattedWellbeingChartData
) => {
  //We can safely do this scale here as it's not used anywhere else.
  const { yScale, xScale } = calculateChartScales(data.totalEmployees, data.highestDaysLost);

  //AVERAGE LINE
  svg
    .append('line')
    .attr('class', chartStyles.average)
    .attr('x1', xScale(0)) // x position of the first end of the line
    .attr('y1', yScale(data.averageDaysLost)) // y position of the first end of the line
    .attr('x2', xScale(data.totalEmployees)) //you get the idea, this is the end points
    .attr('y2', yScale(data.averageDaysLost));

  //We are telling d3 here to make a line and use a curve following along the x,y values of an object passed to it, and using the `curveBasis` type of curve
  // There are several pre-defined functions for curve interpolation in D3; curveNatural is one.
  // https://github.com/d3/d3-shape/blob/master/README.md#curves
  const curve = d3
    .line(
      (d: DatumCoordinates) => d.x,
      (d: DatumCoordinates) => d.y
    )
    .curve(d3.curveBasis);

  //Now we want to put this curve on the graph, easy as pie.
  svg
    .append('path')
    .attr('d', curve(data.coordinates.overview))
    .attr('class', chartStyles.dataLine)
    .attr('fill', 'none');
};

const drawBreakdownChart = (
  svg: Selection<SVGSVGElement | null, unknown, null, undefined>,
  tooltip: Selection<HTMLDivElement, unknown, null, undefined>,
  coords: BreakdownCoordinates[]
): void => {
  //Calculate the height of chart for our breakdown bar stuff
  const innerHeight = WELLBEING_CHART_OPTIONS.dimensions.height - WELLBEING_CHART_OPTIONS.margins.bottom;

  svg
    .selectAll('.bar')
    .data(coords)
    .enter()
    .append('rect')
    .attr('class', chartStyles.breakdownBar)
    .attr('x', (d) => d.x)
    .attr('y', (d) => d.y)
    .attr('width', (d) => d.width || 1)
    .attr('height', function (d) {
      return innerHeight - d.y; //Calculates height of the bar to show it properly on the chart.
    })
    // hover events
    .on('mouseover', (d, i) => {
      tooltip.transition().duration(100).style('opacity', 0.9);
      tooltip
        .html(
          pluralise`
            <div class="${chartStyles.tooltipWrapper}">
              <div class="${clsx(chartStyles.tooltipHeader_suffering, chartStyles.tooltipHeader)}">
                <p>${formatCount(i.employeeCount)} ${[i.employeeCount, 'Employee', 'Employees']}</p>
                </div>
              <div class="${chartStyles.tooltipInner}">
                  <p><b>${i.daysLost}</b> ${[i.daysLost, 'day', 'days']} lost</p>
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
      tooltip.style('top', d.pageY - 100 + 'px').style('left', d.pageX + 'px');
    });
};

/**
 * Draws the legend on the chart below the x-axis label
 * @param svg
 * @param averageDaysLost
 */
const drawOverviewLegend = (
  svg: Selection<SVGSVGElement | null, unknown, null, undefined>,
  averageDaysLost: number
): void => {
  const legendY = WELLBEING_CHART_OPTIONS.dimensions.height - 20;
  const legendX = WELLBEING_CHART_OPTIONS.dimensions.width / 2 - 60;
  const circleOffset = {
    x: 5,
    y: 15,
  };

  svg
    .append('text')
    .attr('class', chartStyles.legend)
    .attr('x', legendX)
    .attr('y', legendY)
    .text(`Average Days Lost (${constructValueDisplayString(averageDaysLost)} Day${averageDaysLost === 1 ? '' : 's'})`);

  svg
    .append('circle')
    .attr('cy', legendY - circleOffset.x)
    .attr('cx', legendX - circleOffset.y)
    .attr('r', '5px')
    .attr('class', chartStyles.average);
};

/**
 * Sets up chart svg, draws axes on the chart and then depending on if you're on the overview or breakdown view, will call the relevant draw function
 * @param svgRef - Ref of the SVG object we'll be drawing the chart in
 * @param data - formatted chart data
 * @param chartState - what chart view we're looking at.
 */
const drawOverviewWellbeingChart = (
  svgRef: RefObject<SVGSVGElement>,
  wrapperRef: RefObject<HTMLDivElement>,
  data: FormattedWellbeingChartData,
  chartState = OVERVIEW_DATA_VIEW_STRING
): void => {
  //Select our svg ref so we can start putting things in it
  const svg = d3.select(svgRef.current);
  const wrapper = d3.select(wrapperRef.current);

  //Clear any rogue tooltips from the chart.
  wrapper.selectAll('div').remove();
  const tooltip = wrapper.append('div').attr('class', chartStyles.tooltip).style('opacity', 0);

  const viewbox = `0 0 ${WELLBEING_CHART_OPTIONS.dimensions.width} ${WELLBEING_CHART_OPTIONS.dimensions.height}`;
  //Set attributes
  svg.attr('viewBox', viewbox);

  //Remove basically everything from the chart to redraw
  svg.selectAll('g').remove();
  svg.selectAll('line').remove();
  svg.selectAll('path').remove();
  svg.selectAll('text').remove();
  svg.selectAll('bar').remove();
  svg.selectAll('rect').remove();
  svg.selectAll('circle').remove();

  //LETS DRAW LINES!
  //Draw my axes please Barry. OK other barry.
  switch (chartState) {
    case TOP_10_DATA_VIEW_STRING:
      drawAxes(svg, data.tenPercentEmployees, 0, calculateChartScales(data.tenPercentEmployees, data.highestDaysLost));
      drawBreakdownChart(svg, tooltip, data.coordinates.tenPercent);
      break;
    case BOTTOM_90_DATA_VIEW_STRING:
      drawAxes(
        svg,
        data.totalEmployees,
        data.tenPercentEmployees,
        calculateChartScales(data.totalEmployees, data.tenPercentDaysLost, 0, data.tenPercentEmployees)
      );
      drawBreakdownChart(svg, tooltip, data.coordinates.ninetyPercent);
      break;
    case OVERVIEW_DATA_VIEW_STRING:
    default:
      drawAxes(svg, data.totalEmployees, 0, calculateChartScales(data.totalEmployees, data.highestDaysLost));
      drawOverviewChartLines(svg, data);
      drawOverviewLegend(svg, data.averageDaysLost);
      break;
  }
};

const WellbeingChartOverview = ({ data }: { data: FormattedWellbeingChartData }) => {
  const svg = useRef<SVGSVGElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const [chartView, setChartView] = useState(OVERVIEW_DATA_VIEW_STRING);

  useEffect(() => {
    drawOverviewWellbeingChart(svg, wrapper, data, chartView);
  }, [svg, data, chartView]);

  return (
    <>
      <div className={chartStyles.header}>
        <div className={chartStyles.title}>Number of Days Lost</div>
        <ToggleButtonGroup value={chartView} onChange={(e, val) => setChartView(val)} exclusive>
          <ToggleButton value={OVERVIEW_DATA_VIEW_STRING}>Overview</ToggleButton>
          <ToggleButton value={TOP_10_DATA_VIEW_STRING}>Worst affected</ToggleButton>
          <ToggleButton value={BOTTOM_90_DATA_VIEW_STRING}>Breakdown</ToggleButton>
        </ToggleButtonGroup>
      </div>

      <div ref={wrapper} className={chartStyles.chartAreaWrapperWellbeing}>
        <svg ref={svg} />
      </div>
    </>
  );
};

export default WellbeingChartOverview;
