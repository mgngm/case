import { formatDataForWellbeingOverviewChart } from 'src/logic/libs/charts/wellbeing';

const testData: Record<string, number> = {
  0: 89,
  1: 34,
  2: 55,
  3: 77,
  4: 123,
  5: 12,
  6: 65,
  7: 88,
  8: 12,
  9: 55,
  10: 100,
  11: 34,
  12: 65,
  13: 12,
  14: 22,
  15: 32,
  16: 12,
  17: 15,
  18: 8,
  19: 7,
  20: 0,
  21: 0,
  22: 0,
  23: 0,
  24: 0,
  25: 0,
  26: 0,
  27: 1,
  28: 2,
  29: 0,
  30: 0,
  31: 1,
  32: 1,
  33: 1,
  34: 1,
  35: 1,
};

const testOptions = {
  dimensions: {
    height: 400,
    width: 600,
  },
  margins: {
    top: 30,
    bottom: 60,
    left: 60,
    right: 30,
  },
  colors: {
    start: exports.buttonDark,
    end: exports.buttonLight,
    gradient: true,
  },
};

//NOTE if you fuck with the chartOptions for this chart it will break allll of these coordinates so you'll need to remake the testOutput variable.
//in the fn put console.log(JSON.stringify(returnObject); to remake it
const testOutput = {
  averageDaysLost: 7,
  totalEmployees: 925,
  highestDaysLost: 35,
  tenPercentDaysLost: 13,
  tenPercentEmployees: 104,
  ninetyPercentEmployees: 821,
  coordinates: {
    overview: [
      { x: 60.55135135135135, y: 30 },
      { x: 61.1027027027027, y: 38.85714285714286 },
      { x: 61.65405405405406, y: 47.71428571428572 },
      { x: 62.20540540540541, y: 56.571428571428584 },
      { x: 62.75675675675676, y: 65.42857142857144 },
      { x: 63.30810810810811, y: 91.99999999999999 },
      { x: 64.41081081081082, y: 100.85714285714285 },
      { x: 66.61621621621622, y: 171.71428571428572 },
      { x: 70.47567567567567, y: 180.57142857142858 },
      { x: 77.09189189189189, y: 189.42857142857142 },
      { x: 84.25945945945946, y: 198.2857142857143 },
      { x: 96.38918918918918, y: 207.14285714285714 },
      { x: 111.27567567567567, y: 216 },
      { x: 120.64864864864865, y: 224.85714285714286 },
      { x: 142.15135135135134, y: 233.7142857142857 },
      { x: 169.16756756756757, y: 242.57142857142856 },
      { x: 206.10810810810813, y: 251.42857142857144 },
      { x: 249.1135135135135, y: 260.2857142857143 },
      { x: 267.3081081081081, y: 269.1428571428571 },
      { x: 294.87567567567567, y: 278 },
      { x: 337.3297297297297, y: 286.8571428571429 },
      { x: 358.2810810810811, y: 295.7142857142857 },
      { x: 395.772972972973, y: 304.57142857142856 },
      { x: 450.90810810810814, y: 313.4285714285714 },
      { x: 487.2972972972973, y: 322.2857142857143 },
      { x: 511.5567567567567, y: 331.1428571428571 },
      { x: 545.7405405405406, y: 340 },
    ],
    tenPercent: [
      { x: 60, y: 30, width: 4.90384615384616, daysLost: 35, employeeCount: 1 },
      { x: 64.90384615384616, y: 38.85714285714286, width: 4.903846153846146, daysLost: 34, employeeCount: 1 },
      { x: 69.8076923076923, y: 47.71428571428572, width: 4.903846153846146, daysLost: 33, employeeCount: 1 },
      { x: 74.71153846153845, y: 56.571428571428584, width: 4.90384615384616, daysLost: 32, employeeCount: 1 },
      { x: 79.61538461538461, y: 65.42857142857144, width: 4.90384615384616, daysLost: 31, employeeCount: 1 },
      { x: 84.51923076923077, y: 91.99999999999999, width: 9.807692307692292, daysLost: 28, employeeCount: 2 },
      { x: 94.32692307692307, y: 100.85714285714285, width: 4.90384615384616, daysLost: 27, employeeCount: 1 },
      { x: 99.23076923076923, y: 171.71428571428572, width: 34.326923076923094, daysLost: 19, employeeCount: 7 },
      { x: 133.55769230769232, y: 180.57142857142858, width: 39.230769230769226, daysLost: 18, employeeCount: 8 },
      { x: 172.78846153846155, y: 189.42857142857142, width: 73.55769230769226, daysLost: 17, employeeCount: 15 },
      { x: 246.3461538461538, y: 198.2857142857143, width: 58.84615384615387, daysLost: 16, employeeCount: 12 },
      { x: 305.1923076923077, y: 207.14285714285714, width: 156.9230769230769, daysLost: 15, employeeCount: 32 },
      { x: 462.1153846153846, y: 216, width: 107.88461538461542, daysLost: 14, employeeCount: 22 },
    ],
    ninetyPercent: [
      { x: 60, y: 30, width: 7.4543239951278935, daysLost: 13, employeeCount: 12 },
      { x: 67.4543239951279, y: 53.846153846153825, width: 40.377588306942755, daysLost: 12, employeeCount: 65 },
      { x: 107.83191230207065, y: 77.6923076923077, width: 21.120584652862348, daysLost: 11, employeeCount: 34 },
      { x: 128.952496954933, y: 101.53846153846153, width: 62.11936662606578, daysLost: 10, employeeCount: 100 },
      { x: 191.07186358099878, y: 125.3846153846154, width: 34.16565164433618, daysLost: 9, employeeCount: 55 },
      { x: 225.23751522533496, y: 149.2307692307692, width: 7.454323995127879, daysLost: 8, employeeCount: 12 },
      { x: 232.69183922046284, y: 173.0769230769231, width: 54.665042630937876, daysLost: 7, employeeCount: 88 },
      { x: 287.3568818514007, y: 196.9230769230769, width: 40.377588306942755, daysLost: 6, employeeCount: 65 },
      { x: 327.73447015834347, y: 220.7692307692308, width: 7.454323995127879, daysLost: 5, employeeCount: 12 },
      { x: 335.18879415347135, y: 244.6153846153846, width: 76.40682095006099, daysLost: 4, employeeCount: 123 },
      { x: 411.59561510353234, y: 268.4615384615384, width: 47.831912302070634, daysLost: 3, employeeCount: 77 },
      { x: 459.427527405603, y: 292.3076923076923, width: 34.16565164433615, daysLost: 2, employeeCount: 55 },
      { x: 493.5931790499391, y: 316.1538461538462, width: 21.120584652862306, daysLost: 1, employeeCount: 34 },
      { x: 514.7137637028014, y: 340, width: 55.28623629719857, daysLost: 0, employeeCount: 89 },
    ],
  },
};

describe('logic/libs/charts/wellbeing.ts', () => {
  describe('formatDataForWellbeingOverviewChart', () => {
    it(`Formats test data correctly for chart rendering`, () => {
      expect(formatDataForWellbeingOverviewChart(testData, testOptions)).toStrictEqual(testOutput);
    });
  });
});
