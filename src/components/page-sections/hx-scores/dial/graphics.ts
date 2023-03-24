import * as d3 from 'd3';
import { GRAPHIC_OPTIONS_HX_DIAL } from 'src/constants/graphic-options';
import { ANIMATION_TIME } from 'src/constants/scores';
import type { HXScoreChartOptions } from 'src/types/scores';

export function drawHXScoreDial(svgRef: React.RefObject<SVGSVGElement>, score: number): void {
  //Allow for overrides.
  const chartOptions: HXScoreChartOptions = {
    ...GRAPHIC_OPTIONS_HX_DIAL,
  };

  // calculate a rounded score in the same way countup.js (via react-countup)
  // rounds the final number for display, so we can use this number to
  // correctly colour the dial
  const roundedScore = Number(Math.abs(score).toFixed(score === 10 ? 0 : 1));

  let colors = chartOptions.colors.high;
  if (roundedScore < 5) {
    colors = chartOptions.colors.low;
  } else if (roundedScore < 8) {
    colors = chartOptions.colors.mid;
  }

  //Next we define our angles
  //We start at the W position on a compass, so -90 degrees.
  const startAngle = -0.5 * Math.PI;
  /**
   * End angle calculation.
   * Max score 10. Beginning Angle = -90. Max angle +90.
   * Range of 180 - so a score of 5 would result in us moving 90 degrees along the dial.
   */
  const scoreAngle = score * 18;
  //We do -90 because d3 starts it's arcs at 0 degrees facing N so we shift it 90degrees to be horizontal.
  const endAngle = (scoreAngle - 90) * (Math.PI / 180);
  const endArcAngle = 0.5 * Math.PI;

  //Inner and outer edge of arc radii
  const innerRadius = chartOptions.dimensions.innerRadius;
  const outerRadius = chartOptions.dimensions.innerRadius + chartOptions.dimensions.dialWidth;

  //Round the edges of the bar
  const cornerRadius = chartOptions.dimensions.cornerRadius;

  //Viewbox dimensions.
  const viewbox = `0 0 ${outerRadius * 2} ${outerRadius}`;

  //Begin our SVG generation.
  const svg = d3.select(svgRef.current);
  svg.attr('viewBox', viewbox);

  // Remove any other paths (in case of re-render fuckery);
  svg.selectAll('path').remove();
  svg.selectAll('g').remove();
  //You need this because when the chart is initially rendered, it creates the gradient for the arc bar with a score of 0 (always red)
  //So we remove ALL gradients & defenitions before we add anything new, to make sure it's always picked up.
  svg.selectAll('defs').remove();

  //To get the animation working, we need to move from start to finish, so create a data 'array' with one entry (our score)
  const dataArc = [{ startAngle, endAngle }];

  //Create the d3 arc
  const arc = d3.arc().outerRadius(outerRadius).innerRadius(innerRadius).cornerRadius(cornerRadius);

  //Create the background arc (the outline) and style it.
  const backgroundArc = d3
    .arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .startAngle(startAngle)
    .endAngle(endArcAngle)
    .cornerRadius(cornerRadius);

  svg
    .append('path')
    // @ts-expect-error: arc is OK.
    .attr('d', backgroundArc)
    .attr('fill', '#FFFFFF')
    .attr('fill-opacity', 0.04)
    .style('stroke', '#FFFFFF')
    .style('stroke-width', 1)
    .attr('stroke-opacity', 0.15)
    .attr('transform', `translate(${outerRadius},${outerRadius})`);

  //The innner arc, here we go!
  const glowPath = svg
    .append('g')
    .attr('class', 'glow-g')
    .attr('filter', 'url(#gdrop)')
    .selectAll('path.glow')
    .data(dataArc);

  const path = svg.append('g').attr('class', 'arc-g').selectAll('path.arc').data(dataArc);

  // Create a gradient for our fill line (Colors are defined in the chart constants).
  const gradient = svg
    .append('defs')
    .append('linearGradient')
    .attr('id', 'gradient')
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '100%')
    .attr('y2', '100%')
    .attr('spreadMethod', 'pad');

  //Apply the gradient to the bar
  gradient.append('stop').attr('offset', '0%').attr('stop-color', colors.start).attr('stop-opacity', 1);

  gradient.append('stop').attr('offset', '100%').attr('stop-color', colors.end).attr('stop-opacity', 1);

  // add a drop shadow filter effect for the glow
  svg
    .select('defs')
    .append('filter')
    .attr('id', 'gdrop')
    .append('feDropShadow')
    .attr('stdDeviation', '2')
    .attr('dx', 2)
    .attr('dy', 2)
    .attr('flood-color', colors.end)
    .attr('flood-opacity', '0.8');

  // define animation function
  // @ts-expect-error: passing functions into d3 is fun...
  const animate = (d) => {
    //Finally :sob: - start is whereever we want it to start, d is datum (and we only have one) so interpolate a nice transition between those two spots.
    const start = { startAngle, endAngle: startAngle };
    const end = d;
    const interpolate = d3.interpolate(start, end);
    return function (t: number) {
      return arc(interpolate(t));
    };
  };

  //Draw and animate the bar filling up
  path
    .enter()
    .append('path')
    .attr('transform', `translate(${outerRadius},${outerRadius})`)
    .attr('class', 'arc')
    .style('fill', 'url(#gradient)')
    .style('opacity', 1)
    // @ts-expect-error: arc is OK.
    .attr('d', arc)
    //Here begins the transition to move the arc from 0 - > <SCORE>
    .transition()
    .duration(ANIMATION_TIME)
    //@ts-expect-error: more d3 fun
    .attrTween('d', animate);

  // add the path for the glow effect
  glowPath
    .enter()
    .append('path')
    .attr('transform', `translate(${outerRadius},${outerRadius})`)
    .attr('class', 'glow')
    .style('fill', 'transparent')
    .style('stroke', 'url(#gradient)')
    .style('stroke-width', 1)
    // @ts-expect-error: arc is OK.
    .attr('d', arc)
    //Here begins the transition to move the arc from 0 - > <SCORE>
    .transition()
    .duration(ANIMATION_TIME)
    //@ts-expect-error: more d3 fun
    .attrTween('d', animate);
}
