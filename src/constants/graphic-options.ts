import { PAYROLL_CATEGORIES } from 'src/constants/crossfilter';
import type {
  SingleBarGraphicOptions,
  HXScoreChartOptions,
  ChartGradientColor,
  BaseChartOptions,
  BusinessChartOptions,
  WorstOfficesOptions,
  HXOverTimeOptions,
  CarbonEmissionsOtions,
} from 'src/types/scores';
import exports from 'styles/_exports.module.scss';

export const BAD_COLORS: ChartGradientColor = {
  start: exports.sufferingLight,
  end: exports.sufferingDark,
};
export const OK_COLORS: ChartGradientColor = { start: exports.frustratedLight, end: exports.frustratedDark };
export const GOOD_COLORS: ChartGradientColor = { start: exports.satisfiedLight, end: exports.satisfiedDark };

export const GRAPHIC_OPTIONS_SINGLE_BAR: SingleBarGraphicOptions = {
  dimensions: {
    width: 20,
    height: 128,
  },
  colors: {
    suffering: BAD_COLORS,
    frustrated: OK_COLORS,
    satisfied: GOOD_COLORS,
  },
};

export const GRAPHIC_OPTIONS_HX_DIAL: HXScoreChartOptions = {
  dimensions: {
    //inner part of arc
    innerRadius: 250,
    dialWidth: 25,
    //higher number == more rounded ends of bar.
    cornerRadius: 0,
  },
  colors: {
    low: BAD_COLORS,
    mid: OK_COLORS,
    high: GOOD_COLORS,
  },
};

export const BASE_CHART_OPTIONS: BaseChartOptions = {
  dimensions: {
    height: 400,
    width: 600,
  },
  margins: {
    top: 30,
    bottom: 60,
    left: 75,
    right: 30,
  },
  colors: {
    start: exports.buttonDark,
    end: exports.buttonLight,
    gradient: true,
  },
};

export const WORST_OFFICES_CHART_OPTIONS: WorstOfficesOptions = {
  ...BASE_CHART_OPTIONS,
  dimensions: {
    height: 650,
    width: 1000,
  },
  margins: {
    ...BASE_CHART_OPTIONS.margins,
    left: 10,
    right: 10,
    bottom: 100,
  },
  colors: {
    suffering: BAD_COLORS,
    frustrated: OK_COLORS,
    satisfied: GOOD_COLORS,
  },
  bandOverrides: {
    sortKey: 'hxScore',
  },
};

export const WELLBEING_CHART_OPTIONS: BaseChartOptions = {
  ...BASE_CHART_OPTIONS,
  margins: {
    ...BASE_CHART_OPTIONS.margins,
    bottom: 80,
  },
};

export const PAYROLL_CHART_OPTIONS: BaseChartOptions = {
  ...BASE_CHART_OPTIONS,
  dimensions: {
    height: 400,
    width: 600,
  },
  margins: {
    ...BASE_CHART_OPTIONS.margins,
    left: 85,
    bottom: 80,
  },
  bandOverrides: PAYROLL_CATEGORIES,
};

export const REVENUE_CHART_OPTIONS: BaseChartOptions = {
  ...BASE_CHART_OPTIONS,
  dimensions: {
    height: 420,
    width: 600,
  },
  margins: {
    ...BASE_CHART_OPTIONS.margins,
    bottom: 110,
    left: 100,
  },
};

export const BUSINESS_CHART_OPTIONS: BusinessChartOptions = {
  ...BASE_CHART_OPTIONS,
  dimensions: {
    height: 300,
    width: 600,
  },
  margins: {
    ...BASE_CHART_OPTIONS.margins,
    bottom: 90,
    left: 95,
  },
};

export const BY_LOCATION_OVER_TIME_CHART_OPTIONS: HXOverTimeOptions = {
  dimensions: {
    height: 400,
    width: 600,
  },
  margins: {
    top: 30,
    bottom: 70,
    left: 60,
    right: 30,
  },
  colors: {
    remote: exports.remoteWorking,
    office: exports.officeWorking,
    suffering: exports.sufferingMain,
    frustrated: exports.frustratedMain,
    satisfied: exports.satisfiedMain,
  },
};

export const CARBON_EMISSIONS_CHART_OPTIONS: CarbonEmissionsOtions = {
  dimensions: {
    height: 600,
    width: 1000,
  },
  margins: {
    top: 15,
    bottom: 80,
    left: 30,
    right: 30,
  },
  colors: {
    saved: exports.carbonSaved,
    potential: exports.carbonTotal,
  },
};
