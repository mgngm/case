import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import * as d3 from 'd3';
import type { Selection } from 'd3';
import styles from 'src/components/employees/list/details/key-data/key-data.module.scss';
import { BY_LOCATION_OVER_TIME_CHART_OPTIONS } from 'src/constants/graphic-options';
import type { DU } from 'src/graphql';
import useContextInfo from 'src/hooks/use-context-info';
import {
  buildRoundedHXBarPath,
  drawHXChartAxes,
  drawHXChartLines,
  calculateHXChartScales,
} from 'src/logic/libs/charts/hxscore-charts';
import { round } from 'src/logic/libs/helpers';
import type { FormattedDUHXScore } from 'src/slices/du';
import { selectFiveMostRecentHXScores, useGetDuByNameAndContextQuery } from 'src/slices/du';
import type { HXScales } from 'src/types/scores';

type ByLocationOverTimeProps = {
  employee: DU;
};

const ratios: Record<'remote' | 'office', number>[] = [
  //this is genius btw, I hope you all praise me for it.
  { remote: 0, office: 0 },
  { remote: 0.65, office: 0.385 },
  { remote: 0.675, office: 0.39 },
  { remote: 0.7, office: 0.4 },
  { remote: 0.725, office: 0.415 },
  { remote: 0.75, office: 0.42 },
];

const drawByLocationOverTimeBars = (
  svg: Selection<SVGSVGElement | null, unknown, null, undefined>,
  { xScale, yScale }: HXScales,
  chartData: FormattedDUHXScore[],
  chartOptions = BY_LOCATION_OVER_TIME_CHART_OPTIONS
) => {
  const x = (d: string): number => xScale(d) || 0;
  const y = (d: number): number => yScale(d) || 0;
  const width = xScale.bandwidth() * 0.25; //bar width.

  const gap = 4;
  const textOffset = 20;
  const remoteRatio = ratios[chartData.length].remote;
  const officeRatio = ratios[chartData.length].office;
  const selection = svg.selectAll('bars').data(Object.keys(chartData)).enter();

  selection
    .append('path')
    .attr('d', buildRoundedHXBarPath(x, y, width, chartData, 'officeHX', chartOptions))
    .attr('transform', `translate(${xScale.bandwidth() * 0.25 - gap},0)`)
    .attr('class', styles.office);

  selection
    .append('text')
    .attr('class', styles.barLabel)
    .attr('text-anchor', 'end')
    .attr('x', (d) => xScale(d) || 0)
    .attr('y', (d) => (yScale(chartData[parseInt(d)].officeHX) || 0) + textOffset)
    .attr('transform', `translate(${xScale.bandwidth() * officeRatio},0)`)
    .text((d) => (chartData[parseInt(d)].officeHX > 0 ? round(chartData[parseInt(d)].officeHX, 1) : ''));

  selection
    .append('path')
    .attr('d', buildRoundedHXBarPath(x, y, width, chartData, 'remoteHX', chartOptions))
    .attr('transform', `translate(${xScale.bandwidth() * 0.5 + gap},0)`)
    .attr('class', styles.remote);

  selection
    .append('text')
    .attr('class', styles.barLabel)
    .attr('text-anchor', 'end')
    .attr('x', (d) => xScale(d) || 0)
    .attr('y', (d) => (yScale(chartData[parseInt(d)].remoteHX) || 0) + textOffset)
    .attr('transform', `translate(${xScale.bandwidth() * remoteRatio},0)`)
    .text((d) => (chartData[parseInt(d)].remoteHX > 0 ? round(chartData[parseInt(d)].remoteHX, 1) : ''));
};

/**
 * Draws the legend on the chart below the x-axis label
 * @param svg
 */
const drawLegend = (svg: Selection<SVGSVGElement | null, unknown, null, undefined>): void => {
  const legendY = BY_LOCATION_OVER_TIME_CHART_OPTIONS.dimensions.height - 10;
  const officeLegendX = BY_LOCATION_OVER_TIME_CHART_OPTIONS.dimensions.width * 0.15;
  const remoteLegendX = BY_LOCATION_OVER_TIME_CHART_OPTIONS.dimensions.width * 0.3;
  const satisfiedLegendX = BY_LOCATION_OVER_TIME_CHART_OPTIONS.dimensions.width * 0.53;
  const frustratedLegendX = BY_LOCATION_OVER_TIME_CHART_OPTIONS.dimensions.width * 0.75;

  const circleOffset = {
    x: 5,
    y: 15,
  };

  const lineOffset = {
    x: 4,
    y: 20,
    length: 15,
  };

  svg.append('text').attr('class', styles.legend).attr('x', officeLegendX).attr('y', legendY).text('Office HX');
  svg.append('text').attr('class', styles.legend).attr('x', remoteLegendX).attr('y', legendY).text('Remote HX');
  svg
    .append('text')
    .attr('class', styles.legend)
    .attr('x', satisfiedLegendX)
    .attr('y', legendY)
    .text('Satisfied Banding');
  svg
    .append('text')
    .attr('class', styles.legend)
    .attr('x', frustratedLegendX)
    .attr('y', legendY)
    .text('Frustrated Banding');

  svg
    .append('circle')
    .attr('cy', legendY - circleOffset.x)
    .attr('cx', officeLegendX - circleOffset.y)
    .attr('r', '5px')
    .attr('class', styles.office);

  svg
    .append('circle')
    .attr('cy', legendY - circleOffset.x)
    .attr('cx', remoteLegendX - circleOffset.y)
    .attr('r', '5px')
    .attr('class', styles.remote);

  svg
    .append('line')
    .attr('x1', satisfiedLegendX - lineOffset.y)
    .attr('x2', satisfiedLegendX - lineOffset.y + lineOffset.length)
    .attr('y1', legendY - lineOffset.x)
    .attr('y2', legendY - lineOffset.x)
    .style('stroke-dasharray', '3, 3')
    .attr('class', styles.satisfiedBandingLegend);

  svg
    .append('line')
    .attr('x1', frustratedLegendX - lineOffset.y)
    .attr('x2', frustratedLegendX - lineOffset.y + lineOffset.length)
    .attr('y1', legendY - lineOffset.x)
    .attr('y2', legendY - lineOffset.x)
    .style('stroke-dasharray', '3, 3')
    .attr('class', styles.frustratedBandingLegend);
};

/**
 * Draw us a chart please guvna
 * @param svgRef - Ref of the SVG object we'll be drawing the chart in
 * @param data - formatted chart data
 */
const drawByLocationOverTimeChart = (svgRef: RefObject<SVGSVGElement>, data: FormattedDUHXScore[]): void => {
  //Select our svg ref so we can start putting things in it
  const svg = d3.select(svgRef.current);

  const viewbox = `0 0 ${BY_LOCATION_OVER_TIME_CHART_OPTIONS.dimensions.width} ${BY_LOCATION_OVER_TIME_CHART_OPTIONS.dimensions.height}`;
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

  const scales = calculateHXChartScales(data, BY_LOCATION_OVER_TIME_CHART_OPTIONS);

  drawHXChartAxes(svg, data, scales, BY_LOCATION_OVER_TIME_CHART_OPTIONS, 'Month', 'HX Score');
  drawHXChartLines(svg, scales, BY_LOCATION_OVER_TIME_CHART_OPTIONS);
  //Draw my bars please Barry. OK other barry.
  drawByLocationOverTimeBars(svg, scales, data, BY_LOCATION_OVER_TIME_CHART_OPTIONS);
  //Now draw my legend. Sure other Barry.
  drawLegend(svg);
};

export const ByLocationOverTime = ({ employee }: ByLocationOverTimeProps) => {
  const contextInfo = useContextInfo();
  const svg = useRef<SVGSVGElement>(null);

  const { data } = useGetDuByNameAndContextQuery(
    {
      name: employee.name as string,
      context: contextInfo.reportContext.prettyId as string,
    },
    {
      skip: !contextInfo.reportContext.prettyId || !employee || !employee.name,
      selectFromResult: ({ data }) => ({ data: selectFiveMostRecentHXScores(data?.data ?? []) }), //Need to make this a smart selector
    }
  );

  useEffect(() => {
    if (data) {
      drawByLocationOverTimeChart(svg, data);
    }
  }, [svg, data]);

  return (
    <div className={styles.byLocationOverTimeInner}>
      <div className={styles.subtitleMargin}>HX Score over time by Location</div>
      <div className={styles.chartAreaWrapper}>
        <svg ref={svg} />
      </div>
    </div>
  );
};
