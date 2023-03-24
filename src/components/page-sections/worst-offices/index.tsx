import { useEffect, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import clsx from 'clsx';
import * as d3 from 'd3';
import type { Selection, ScaleLinear } from 'd3';
import { round } from 'lodash';
import type { WorstOfficesChart } from 'lambda/parse/report/chart-data';
import { WorstOfficesChartType } from 'lambda/parse/report/chart-data';
import chartStyles from 'src/components/page-sections/report-blocks/base/bar-chart.module.scss';
import TooltipTarget from 'src/components/shared/tooltip-target';
import PageSection from 'src/components/ui/page-section';
import { WORST_SITES_TYPE_LABELS, WORST_SITES_TYPE_TOOLTIPS } from 'src/constants/display';
import { WORST_OFFICES_CHART_OPTIONS } from 'src/constants/graphic-options';
import { BAND_TYPE_FRUSTRATED, BAND_TYPE_SATISFIED, BAND_TYPE_SUFFERING } from 'src/constants/scores';
import useBreakpoint from 'src/hooks/use-breakpoint';
import useReport from 'src/hooks/use-report';
import { buildRoundedBarPath, calculateChartScales, clearChart } from 'src/logic/libs/charts/bar-chart';
import { constructValueDisplayString } from 'src/logic/libs/helpers';
import { selectWorstOffices } from 'src/slices/dashboard';
import type { Scales } from 'src/types/scores';
import styles from './worst-offices.module.scss';

export const getOfficeForLegacyType = (
  worstOffices: WorstOfficesChart | Record<string, WorstOfficesChart>,
  chartType: WorstOfficesChartType,
  key: string
) => {
  if (worstOffices[chartType]) {
    return { ...(worstOffices as Record<string, WorstOfficesChart>)[chartType][key], key };
  } else {
    return { ...(worstOffices as WorstOfficesChart)[key], key };
  }
};

const WorstOfficesTable = ({
  worstOffices,
  chartType = WorstOfficesChartType.Worst10,
}: {
  worstOffices: WorstOfficesChart | Record<string, WorstOfficesChart>;
  chartType?: WorstOfficesChartType;
}) => {
  const chartData: WorstOfficesChart = (
    worstOffices[chartType] ? worstOffices[chartType] : worstOffices
  ) as WorstOfficesChart;

  const tableData = Object.keys(chartData)
    .map((key) => getOfficeForLegacyType(chartData, chartType, key))
    .sort((a, b) => a.hxScore - b.hxScore)
    .slice(0, 10);

  return (
    <table className={styles.table}>
      <thead className={styles.tableHead}>
        <tr className={styles.tableRow}>
          <th className={clsx(styles.tableCell, styles.rank)}>Rank</th>
          <th className={clsx(styles.tableCell, styles.office)}>Office Name</th>
          <th className={clsx(styles.tableCell, styles.hxScore)}>HX Score (Average)</th>
          <th className={clsx(styles.tableCell, styles.employeeCount)}>Employees</th>
        </tr>
      </thead>
      <tbody className={styles.tableBody}>
        {tableData.map(({ hxScore, employeeCount, key }, index) => {
          return (
            <tr className={styles.tableRow} key={key}>
              <th className={clsx(styles.tableCell, styles.rank)}>{index + 1}</th>
              <th className={clsx(styles.tableCell, styles.office)}>{key}</th>
              <th className={clsx(styles.tableCell, styles.hxScore)}>{round(hxScore, 1)}</th>
              <th className={clsx(styles.tableCell, styles.employeeCount)}>{employeeCount}</th>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const drawWorstOfficeLegend = (svg: Selection<SVGSVGElement | null, unknown, null, undefined>): void => {
  const legendY = WORST_OFFICES_CHART_OPTIONS.dimensions.height - 20;
  const legendX = WORST_OFFICES_CHART_OPTIONS.dimensions.width / 2;
  const circleRadius = 5;

  svg.selectAll('circle').remove();

  svg
    .append('circle')
    .attr('cy', legendY - circleRadius)
    .attr('cx', legendX)
    .attr('r', `${circleRadius}px`)
    .attr('class', styles.legendSuffering);

  svg
    .append('text')
    .attr('class', styles.legend)
    .attr('x', legendX + 10)
    .attr('y', legendY)
    .text(`Suffering`);

  svg
    .append('circle')
    .attr('cy', legendY - circleRadius)
    .attr('cx', legendX - 95)
    .attr('r', `${circleRadius}px`)
    .attr('class', styles.legendFrustrated);

  svg
    .append('text')
    .attr('class', styles.legend)
    .attr('x', legendX - 85)
    .attr('y', legendY)
    .text(`Frustrated`);

  svg
    .append('circle')
    .attr('cy', legendY - circleRadius)
    .attr('cx', legendX - 180)
    .attr('r', `${circleRadius}px`)
    .attr('class', styles.legendSatisfied);

  svg
    .append('text')
    .attr('class', styles.legend)
    .attr('x', legendX - 170)
    .attr('y', legendY)
    .text(`Satisfied`);

  svg
    .append('image')
    .attr('xlink:href', '/assets/charts/user-icon.svg')
    .attr('width', 17)
    .attr('height', 17)
    .attr('x', legendX + 80)
    .attr('y', legendY - 12)
    .attr('class', styles.legendIcon);

  svg
    .append('text')
    .attr('class', styles.legend)
    .attr('x', legendX + 103)
    .attr('y', legendY)
    .text(`Employees at location`);
};

const drawXAxis = (
  svg: Selection<SVGSVGElement | null, unknown, null, undefined>,
  xScale: ScaleLinear<number, number, never>
) => {
  const tickValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const xAxisYTranslate = WORST_OFFICES_CHART_OPTIONS.dimensions.height - WORST_OFFICES_CHART_OPTIONS.margins.bottom;
  const innerTickHeight = xAxisYTranslate - WORST_OFFICES_CHART_OPTIONS.margins.top;

  const xAxis = d3
    .axisBottom(xScale)
    .tickFormat((d) => constructValueDisplayString(`${d}`, 1, true))
    .tickValues(tickValues)
    .tickSize(0)
    .tickPadding(10);

  //Inner dashes
  for (const val of tickValues) {
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

  svg.append('g').attr('transform', `translate(0, ${xAxisYTranslate})`).attr('class', chartStyles.axis).call(xAxis);

  //Removes the actual x-axis line but keeps our ticks.
  svg.select('.domain').remove();

  svg
    .append('text')
    .attr('class', chartStyles.axisLabel)
    .attr('text-anchor', 'end')
    .attr('x', WORST_OFFICES_CHART_OPTIONS.dimensions.width / 1.7 + 0)
    .attr('y', WORST_OFFICES_CHART_OPTIONS.dimensions.height - 50)
    .text('HX Score (Average)');
};

const drawWorstOfficeBars = (
  svg: Selection<SVGSVGElement | null, unknown, null, undefined>,
  tooltip: Selection<HTMLDivElement, unknown, null, undefined>,
  { xScale, yScale }: Scales,
  worstOffices: WorstOfficesChart
) => {
  const x = (d: number): number => xScale(d) || 0;
  const y = (d: string): number => yScale(d) || 0;
  const width = (d: string | number): number =>
    xScale(worstOffices[d].hxScore) - WORST_OFFICES_CHART_OPTIONS.margins.left;
  const height = Math.min(yScale.bandwidth() / 2.5, 21);
  const yTranslate = yScale.bandwidth() / 2;

  const chartCategories = Object.keys(worstOffices).sort((a, b) => worstOffices[a].hxScore - worstOffices[b].hxScore);
  const selection = svg.selectAll('bars').data(chartCategories).enter();

  const getCatPrefix = (score: number): string => {
    let cat = BAND_TYPE_SATISFIED;
    if (score < 5) {
      cat = BAND_TYPE_SUFFERING;
    } else if (score < 8) {
      cat = BAND_TYPE_FRUSTRATED;
    }
    return cat;
  };

  selection
    .append('path')
    .attr('d', buildRoundedBarPath(x, y, width, height, WORST_OFFICES_CHART_OPTIONS.margins.left))
    .attr('class', 'worst-office-bar')
    .attr('transform', `translate(0,${yTranslate})`)
    .style('fill', (d) => `url(#${getCatPrefix(worstOffices[d].hxScore)}Gradient)`)
    .on('mouseover', (d, i) => {
      tooltip.transition().duration(100).style('opacity', 1);
      tooltip
        .html(
          `
            <div class="${chartStyles.tooltipWrapper}">
              <div class="${clsx(chartStyles.tooltipHeader_worstOffices, chartStyles.tooltipHeader)}">
                <p>${i}</p>
                </div>
              <div class="${chartStyles.tooltipInner}">
                 <p>HX Score: ${round(worstOffices[i].hxScore, 1)}</p>
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

  selection
    .append('text')
    .attr('class', styles.barLabel)
    .attr('text-anchor', 'end')
    .attr('x', xScale(0))
    .attr('y', (d): number => yScale(d) || 0)
    .attr('transform', `translate(0,${yTranslate - 10})`)
    .text((d) => `${d}`);

  selection
    .append('image')
    .attr('xlink:href', '/assets/charts/user-icon.svg')
    .attr('width', 15)
    .attr('height', 15)
    .attr('x', xScale(0.05))
    .attr('y', (d): number => yScale(d) || 0)
    .attr('transform', `translate(0,${yTranslate + 3})`);

  selection
    .append('text')
    .attr('class', styles.barEmployeeCount)
    .attr('text-anchor', 'end')
    .attr('x', xScale(0))
    .attr('y', (d): number => (yScale(d) || 0) + 14)
    .attr('transform', `translate(25,${yTranslate})`)
    .text((d) => worstOffices[d].employeeCount);
};

const createGradients = (svg: Selection<SVGSVGElement | null, unknown, null, undefined>) => {
  // Create a gradient for our fill lines (Colors are defined in the chart constants).
  const cats = [BAND_TYPE_SUFFERING, BAND_TYPE_FRUSTRATED, BAND_TYPE_SATISFIED] as const;

  for (const cat of cats) {
    const gradient = svg
      .append('defs')
      .append('linearGradient')
      .attr('id', `${cat}Gradient`)
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '100%')
      .attr('spreadMethod', 'pad');

    //Apply the gradient to the bar
    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', WORST_OFFICES_CHART_OPTIONS.colors[cat].start)
      .attr('stop-opacity', 1);

    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', WORST_OFFICES_CHART_OPTIONS.colors[cat].end)
      .attr('stop-opacity', 1);
  }
};

const drawWorstOffices = (
  svgRef: RefObject<SVGSVGElement>,
  wrapperRef: RefObject<HTMLDivElement>,
  worstOffices: WorstOfficesChart | Record<string, WorstOfficesChart>,
  chartType: WorstOfficesChartType = WorstOfficesChartType.Worst10
) => {
  const svg = d3.select(svgRef.current);
  const wrapper = d3.select(wrapperRef.current);

  let chartData: WorstOfficesChart;

  if (worstOffices[chartType]) {
    chartData = worstOffices[chartType] as WorstOfficesChart;
  } else {
    chartData = worstOffices as WorstOfficesChart;
  }

  // ensure chart data only shows max 10 bars
  const sortedChartData = Object.entries(chartData).sort((a, b) => a[1].hxScore - b[1].hxScore);
  const chartEntries = [...sortedChartData.slice(0, 10)];
  const sanitisedChartData = Object.fromEntries(chartEntries);

  //Clear any rogue tooltips from the chart.
  wrapper.selectAll('div').remove();
  const tooltip = wrapper.append('div').attr('class', chartStyles.tooltip).style('opacity', 0);
  //No tooltips on this chart so don't need a wrapper ref.
  clearChart(svg, null, WORST_OFFICES_CHART_OPTIONS);

  //we set the max to 10 here as it's HX SCore.
  const { xScale, yScale } = calculateChartScales(sanitisedChartData, 10, WORST_OFFICES_CHART_OPTIONS);
  drawXAxis(svg, xScale);
  createGradients(svg);
  drawWorstOfficeBars(svg, tooltip, { xScale, yScale }, sanitisedChartData);
  drawWorstOfficeLegend(svg);
};

const WorstOffices = () => {
  const biggerThanLg = useBreakpoint('lg');

  const { report } = useReport();
  const worstOffices = selectWorstOffices(report?.reportData);

  const [chartType, setChartType] = useState<WorstOfficesChartType>(WorstOfficesChartType.Worst10);
  const isLegacyData = useMemo(() => !worstOffices[WorstOfficesChartType.KeySites], [worstOffices]);

  const svg = useRef<SVGSVGElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    drawWorstOffices(svg, wrapper, worstOffices, chartType);
  }, [svg, worstOffices, biggerThanLg, chartType]);

  let sectionContent = <div className={styles.worstOfficesEmptyState}>There is no available data for this chart</div>;

  if (
    (isLegacyData && Object.keys(worstOffices).length > 0) ||
    (!isLegacyData && chartType && worstOffices[chartType] && Object.keys(worstOffices[chartType]).length > 0)
  ) {
    sectionContent = biggerThanLg ? (
      <div ref={wrapper} className={styles.worstOfficesWrapper}>
        <svg className={styles.chartSVG} ref={svg} />
      </div>
    ) : (
      <WorstOfficesTable worstOffices={worstOffices} chartType={chartType} />
    );
  }

  return (
    <PageSection title="Top 10 Worst Sites by HX Score" className={styles.workingLocationsWrapper}>
      {!isLegacyData ? (
        <div className={styles.worstSitesPill}>
          <ToggleButtonGroup
            value={chartType}
            onChange={(e, val) => {
              if (val !== null) {
                setChartType(val);
              }
            }}
            exclusive
            className={styles.dataTypePill}
            id="worst-sites-pill-wrapper"
            sx={{
              '.Mui-selected': {
                fontWeight: 'bold',
              },
            }}
          >
            <ToggleButton
              value={WorstOfficesChartType.Worst10}
              className={styles.dataType}
              id="worst-sites-worst10-btn"
            >
              <div id="worst-sites-worst10-btn-title" className={styles.pillName}>
                {WORST_SITES_TYPE_LABELS[WorstOfficesChartType.Worst10]}
              </div>
              <div id="worst-sites-worst10-btn-tooltip" className={styles.pillTooltip}>
                <TooltipTarget tooltip={WORST_SITES_TYPE_TOOLTIPS[WorstOfficesChartType.Worst10]} />
              </div>
            </ToggleButton>
            <ToggleButton
              value={WorstOfficesChartType.KeySites}
              className={styles.dataType}
              id="worst-sites-keysites-btn"
            >
              <div id="worst-sites-keysites-btn-title" className={styles.pillName}>
                {WORST_SITES_TYPE_LABELS[WorstOfficesChartType.KeySites]}
              </div>
              <div id="worst-sites-keysites-btn-tooltip" className={styles.pillTooltip}>
                <TooltipTarget tooltip={WORST_SITES_TYPE_TOOLTIPS[WorstOfficesChartType.KeySites]} />
              </div>
            </ToggleButton>
            <ToggleButton
              value={WorstOfficesChartType.Upgrading}
              className={styles.dataType}
              id="worst-sites-upgrading-btn"
            >
              <div id="worst-sites-upgrading-btn-title" className={styles.pillName}>
                {WORST_SITES_TYPE_LABELS[WorstOfficesChartType.Upgrading]}
              </div>
              <div id="worst-sites-upgrading-btn-tooltip" className={styles.pillTooltip}>
                <TooltipTarget tooltip={WORST_SITES_TYPE_TOOLTIPS[WorstOfficesChartType.Upgrading]} />
              </div>
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      ) : null}
      <div className={styles.worstSitesContainer}>{sectionContent}</div>
    </PageSection>
  );
};

export default WorstOffices;
