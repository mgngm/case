import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { GRAPHIC_OPTIONS_SINGLE_BAR } from 'src/constants/graphic-options';
import { BAND_TYPE_FRUSTRATED, BAND_TYPE_SUFFERING } from 'src/constants/scores';
import type { SingleBarGraphicOptions } from 'src/types/scores';

type BarProps = {
  score: number;
  total: number;
  bandType: string;
};

const drawBar = (svgRef: React.RefObject<SVGSVGElement>, score: number, total: number, bandType: string) => {
  //Allow for overrides.
  const barOptions: SingleBarGraphicOptions = {
    ...GRAPHIC_OPTIONS_SINGLE_BAR,
  };

  let colors = barOptions.colors.satisfied.end;
  if (bandType === BAND_TYPE_SUFFERING) {
    colors = barOptions.colors.suffering.end;
  } else if (bandType === BAND_TYPE_FRUSTRATED) {
    colors = barOptions.colors.frustrated.end;
  }

  //Create SVG to start putting things in and set dimensions
  const svg = d3.select(svgRef.current);
  svg.selectAll('rect').remove();

  svg.attr('viewBox', `0 0 ${barOptions.dimensions.width} ${barOptions.dimensions.height}`);

  //Same as the arc, we are transitioning data from nothing to our value, so create a fake array.
  const data = [0, score];

  //Create our scale so the bars are sized correctly.
  const y = d3.scaleLinear().domain([0, total]).range([barOptions.dimensions.height, 0]);

  //Use this to calculate the bar height.
  const yInverse = d3.scaleLinear().domain([0, total]).range([0, barOptions.dimensions.height]);

  //Add the shadow bar background as it's static, nice and easy.
  svg
    .append('rect')
    .attr('x', 0)
    .attr('y', y(total))
    .attr('width', barOptions.dimensions.width)
    .attr('height', barOptions.dimensions.height)
    .attr('fill', '#FFFFFF')
    .attr('fill-opacity', 0.04)
    .attr('ry', 10)
    .style('stroke', '#FFFFFF')
    .style('stroke-width', 2)
    .attr('stroke-opacity', 0.15);

  // Add our bar, then animate it.
  const scoreBar = svg
    .selectAll('g')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', 0)
    .attr('y', (d) => y(d))
    .attr('width', barOptions.dimensions.width)
    //The height is the opposite to how far down the svg we want to go, so calculate it the other way.
    .attr('height', (d) => yInverse(d))
    .attr('fill', colors);

  /**
   * OK Buckle up. For the transition here, we are keeping the bar full height to begin with, and essentially
   * using some d3 wizardry to shift the bar UP from the bottom of the bar into view, so it looks like it's growing into view.
   * Shh don't tell.
   */
  // @ts-expect-error: it doesn't like interpolate with datums
  scoreBar
    .transition()
    .duration(2000)
    .attrTween('y', (d) => d3.interpolate(y(0), y(d)));
};

const Bar = (props: BarProps) => {
  const svg = useRef<SVGSVGElement>(null);
  useEffect(() => {
    drawBar(svg, props.score, props.total, props.bandType);
    // eslint-disable-next-line
  }, [svg, props.score, props.total]);

  return <svg ref={svg} />;
};

export default Bar;
