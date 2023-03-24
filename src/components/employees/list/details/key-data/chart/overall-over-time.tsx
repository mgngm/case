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

type OverallOverTimeProps = {
  employee: DU;
};

const ratios: number[] = [
  //this is genius btw, I hope you all praise me for it.
  0, 0.52, 0.525, 0.55, 0.55, 0.58,
];

const drawByLocationOverTimeBars = (
  svg: Selection<SVGSVGElement | null, unknown, null, undefined>,
  { xScale, yScale }: HXScales,
  chartData: FormattedDUHXScore[],
  chartOptions = BY_LOCATION_OVER_TIME_CHART_OPTIONS
) => {
  const x = (d: string): number => xScale(d) || 0;
  const y = (d: number): number => yScale(d) || 0;
  const width = xScale.bandwidth() * 0.5; //bar width.

  const barClass = (d: string) => {
    const val = chartData[parseInt(d)].overallHX;
    if (val > 8) {
      return styles.satisfied;
    } else if (val > 5) {
      return styles.frustrated;
    } else {
      return styles.suffering;
    }
  };

  const selection = svg.selectAll('bars').data(Object.keys(chartData)).enter();
  const textOffset = 20;

  selection
    .append('path')
    .attr('d', buildRoundedHXBarPath(x, y, width, chartData, 'overallHX', chartOptions))
    .attr('transform', `translate(${xScale.bandwidth() * 0.25},0)`)
    .attr('class', (d) => barClass(d));

  selection
    .append('text')
    .attr('class', styles.barLabel)
    .attr('text-anchor', 'end')
    .attr('x', (d) => xScale(d) || 0)
    .attr('y', (d) => (yScale(chartData[parseInt(d)].overallHX) || 0) + textOffset)
    .attr('transform', `translate(${xScale.bandwidth() * ratios[chartData.length]},0)`)
    .text((d) => (chartData[parseInt(d)].overallHX > 0 ? round(chartData[parseInt(d)].overallHX, 1) : ''));
};

const drawLegend = (svg: Selection<SVGSVGElement | null, unknown, null, undefined>): void => {
  const legendY = BY_LOCATION_OVER_TIME_CHART_OPTIONS.dimensions.height - 10;
  const satisfiedLegendX = BY_LOCATION_OVER_TIME_CHART_OPTIONS.dimensions.width * 0.1;
  const frustratedLegendX = BY_LOCATION_OVER_TIME_CHART_OPTIONS.dimensions.width * 0.25;
  const sufferingLegendX = BY_LOCATION_OVER_TIME_CHART_OPTIONS.dimensions.width * 0.4;
  const satisfiedBandingLegendX = BY_LOCATION_OVER_TIME_CHART_OPTIONS.dimensions.width * 0.55;
  const frustratedBandingLegendX = BY_LOCATION_OVER_TIME_CHART_OPTIONS.dimensions.width * 0.78;

  const circleOffset = {
    x: 5,
    y: 15,
  };

  const lineOffset = {
    x: 4,
    y: 20,
    length: 15,
  };

  svg.append('text').attr('class', styles.legend).attr('x', satisfiedLegendX).attr('y', legendY).text('Satisfied');
  svg.append('text').attr('class', styles.legend).attr('x', frustratedLegendX).attr('y', legendY).text('Frustrated');
  svg.append('text').attr('class', styles.legend).attr('x', sufferingLegendX).attr('y', legendY).text('Suffering');
  svg
    .append('text')
    .attr('class', styles.legend)
    .attr('x', satisfiedBandingLegendX)
    .attr('y', legendY)
    .text('Satisfied Banding');
  svg
    .append('text')
    .attr('class', styles.legend)
    .attr('x', frustratedBandingLegendX)
    .attr('y', legendY)
    .text('Frustrated Banding');

  svg
    .append('circle')
    .attr('cy', legendY - circleOffset.x)
    .attr('cx', satisfiedLegendX - circleOffset.y)
    .attr('r', '5px')
    .attr('class', styles.satisfied);

  svg
    .append('circle')
    .attr('cy', legendY - circleOffset.x)
    .attr('cx', frustratedLegendX - circleOffset.y)
    .attr('r', '5px')
    .attr('class', styles.frustrated);

  svg
    .append('circle')
    .attr('cy', legendY - circleOffset.x)
    .attr('cx', sufferingLegendX - circleOffset.y)
    .attr('r', '5px')
    .attr('class', styles.suffering);

  svg
    .append('line')
    .attr('x1', satisfiedBandingLegendX - lineOffset.y)
    .attr('x2', satisfiedBandingLegendX - lineOffset.y + lineOffset.length)
    .attr('y1', legendY - lineOffset.x)
    .attr('y2', legendY - lineOffset.x)
    .style('stroke-dasharray', '3, 3')
    .attr('class', styles.satisfiedBandingLegend);

  svg
    .append('line')
    .attr('x1', frustratedBandingLegendX - lineOffset.y)
    .attr('x2', frustratedBandingLegendX - lineOffset.y + lineOffset.length)
    .attr('y1', legendY - lineOffset.x)
    .attr('y2', legendY - lineOffset.x)
    .style('stroke-dasharray', '3, 3')
    .attr('class', styles.frustratedBandingLegend);
};

/**
 * Draws us a chart.
 * @param svgRef - Ref of the SVG object we'll be drawing the chart in
 * @param data - chart data
 */
const drawOverallOverTimeChart = (svgRef: RefObject<SVGSVGElement>, data: FormattedDUHXScore[]): void => {
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

export const OverallOverTime = ({ employee }: OverallOverTimeProps) => {
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
      drawOverallOverTimeChart(svg, data);
    }
  }, [svg, data]);

  return (
    <div className={styles.overallOverTimeInner}>
      <div className={styles.subtitleMargin}>Overall HX Score over time</div>
      <div className={styles.chartAreaWrapper}>
        <svg ref={svg} />
      </div>
    </div>
  );
};
