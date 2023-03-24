import * as d3 from 'd3';
import type { ScaleLinear } from 'd3';
import { WELLBEING_CHART_OPTIONS } from 'src/constants/graphic-options';
import type { BreakdownCoordinates, DatumCoordinates, FormattedWellbeingChartData } from 'src/types/scores';
/**
 * Formats raw chart data (in this case days lost) into something we can use for the charts.
 *
 * @param chartData - Raw data from csv to be managed
 * @returns object - formatted chart data
 */
export const formatDataForWellbeingOverviewChart = (
  chartData: Record<number, number>,
  chartOptions = WELLBEING_CHART_OPTIONS
): FormattedWellbeingChartData => {
  const chartDataKeys = Object.keys(chartData);
  //reverse this here because we always go top down
  chartDataKeys.reverse();
  const chartDataKeysInt = chartDataKeys.map((datum) => parseInt(datum));

  //We should calculate the total employees here rather than using the total number
  //from the CSV just in case of a discrepancy, this chart will then be representative of the data inside the chartData object
  const totalEmployees = d3.sum(Object.values(chartData));

  //Reusuable counter!!!! Thanks other Barry.
  let currentEmployeeCount = 0;

  //Calculate 10% threshold here for chart breakdown
  let tenPercentEmployees = Math.round(totalEmployees / 10);
  let tenPercentDaysLost = 0;

  //We need to find the threshold of the number of days the top 10% of employees lose per month Grim. We don't need it for the 90% as that can start from 0.
  chartDataKeys.some((datum) => {
    const keyInt = parseInt(datum);
    currentEmployeeCount += chartData[keyInt];

    if (currentEmployeeCount > tenPercentEmployees) {
      tenPercentDaysLost = keyInt;
      tenPercentEmployees = currentEmployeeCount;
      return true;
    }
    return false;
  });

  const ninetyPercentEmployees = totalEmployees - tenPercentEmployees;

  //Bump the days lost down just by 1 so the lowest data entry in the array isn't display on the chart as a 0 height bar.
  tenPercentDaysLost = tenPercentDaysLost - 1;
  let totalDaysLost = 0;
  const highestDaysLost = d3.max(chartDataKeysInt) || 0;

  //OVERVIEW SCALES
  const { xScale, yScale } = calculateChartScales(totalEmployees, highestDaysLost, 0, 0, chartOptions);
  //TOP10PERCENT SCALES
  //for this we set the highest days lost as the highest days, and the startDays lost as our threshold number
  const { xScale: tenPercentXScale, yScale: tenPercentYScale } = calculateChartScales(
    tenPercentEmployees,
    highestDaysLost,
    0,
    0,
    chartOptions
  );

  //TOP90PERCENT SCALES
  //And here we will set the startDays lost as 0 and then the HIGHEST this chart should go up to is the 10% threshold days count. The x-Axis count will start at the 10 percent threshold so we don't have gaps
  const { xScale: ninetyPercentXScale, yScale: ninetyPercentYScale } = calculateChartScales(
    totalEmployees,
    tenPercentDaysLost,
    0,
    tenPercentEmployees,
    chartOptions
  );

  const tenPercentCoords: BreakdownCoordinates[] = [];
  const ninetyPercentCoords: BreakdownCoordinates[] = [];
  const overviewCoords: DatumCoordinates[] = [];

  //reset the counter for this.
  currentEmployeeCount = 0;

  //Map into a coordinate array here for the overview chart line - AT THE SAME TIME populate the top 10% / bottom 90% of employees with coordinates for each chart 3 birds with one .map, not bad Barry.
  chartDataKeys.forEach((element) => {
    const keyInt = parseInt(element);
    const val = chartData[keyInt];
    const startEmployeeCount = currentEmployeeCount;
    //If there is no employee on this day we don't really care
    if (val && val > 0) {
      //First up lets append the total number of days lost to the value above
      totalDaysLost += keyInt * val;
      //If we are creating a 'bar' and creating a spot halfway at the top of that bar, we'll need to make the spot halfway across the width of the bar, right ?
      //So spot width will be currentEmployeecount (across the x scale) + currentNumber of employees for this bar / 2 (to get halfway)
      //But then we add on the full number of employees for this bar at the end so the next bar can calculate properly.
      const tempEmployeeCount = currentEmployeeCount + Math.round(val / 2);
      const x = xScale(tempEmployeeCount);
      //Cumulative employee count here
      currentEmployeeCount += val;

      //Here we add the threshold for top 10% employees and the 90% employees
      if (currentEmployeeCount <= tenPercentEmployees) {
        //We want the xScale to be calculated off of the start employee count to get the left side of the bar as an xcoord, we can then use the updated currentEmployeeCount to see how wide the bar should be.
        tenPercentCoords.push({
          x: tenPercentXScale(startEmployeeCount),
          y: tenPercentYScale(keyInt),
          width: tenPercentXScale(currentEmployeeCount) - tenPercentXScale(startEmployeeCount),
          daysLost: keyInt,
          employeeCount: val,
        });
      } else {
        //nintypercenter here
        ninetyPercentCoords.push({
          x: ninetyPercentXScale(startEmployeeCount),
          y: ninetyPercentYScale(keyInt),
          width: ninetyPercentXScale(currentEmployeeCount) - ninetyPercentXScale(startEmployeeCount),
          daysLost: keyInt,
          employeeCount: val,
        });
      }
      //Add overview coordinate to it's array
      overviewCoords.push({ x, y: yScale(keyInt) });
    }
  });

  const returnObject: FormattedWellbeingChartData = {
    averageDaysLost: Math.floor(totalDaysLost / totalEmployees),
    totalEmployees,
    highestDaysLost,
    tenPercentDaysLost,
    tenPercentEmployees,
    ninetyPercentEmployees,
    coordinates: {
      overview: overviewCoords,
      tenPercent: tenPercentCoords,
      ninetyPercent: ninetyPercentCoords,
    },
  };

  return returnObject;
};

//Disable eslint for return type because ScaleLinear takes an any
export const calculateChartScales = (
  totalEmployees: number,
  highestDaysLost: number,
  startDaysLost = 0,
  startEmployeeCount = 0,
  chartOptions = WELLBEING_CHART_OPTIONS
  //eslint-disable-next-line
): { xScale: ScaleLinear<number, number, any>; yScale: ScaleLinear<number, number, any> } => {
  //Calculate the pixels at which each axis should start/end
  const xAxisStart = 0 + chartOptions.margins.left;
  const xAxisEnd = chartOptions.dimensions.width - chartOptions.margins.right;
  const yAxisEnd = 0 + chartOptions.margins.top;
  const yAxisStart = chartOptions.dimensions.height - chartOptions.margins.bottom;

  //Create our scales
  const xScale = d3.scaleLinear().domain([startEmployeeCount, totalEmployees]).range([xAxisStart, xAxisEnd]);
  //yScale range is inverted because we go from 0 at the bottom
  const yScale = d3.scaleLinear().domain([highestDaysLost, startDaysLost]).range([yAxisEnd, yAxisStart]);

  return { xScale, yScale };
};
