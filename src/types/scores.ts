import type { ScaleLinear, ScaleBand } from 'd3';
import type { BAND_TYPE_FRUSTRATED, BAND_TYPE_SATISFIED, BAND_TYPE_SUFFERING } from 'src/constants/scores';

export interface ChartGradientColor {
  start: string;
  end: string;
}

export interface HXScoreChartOptions {
  dimensions: {
    innerRadius: number;
    dialWidth: number;
    cornerRadius: number;
  };
  colors: {
    low: ChartGradientColor;
    mid: ChartGradientColor;
    high: ChartGradientColor;
  };
}

export interface SingleBarGraphicOptions {
  dimensions: {
    height: number;
    width: number;
  };
  colors: {
    suffering: ChartGradientColor;
    frustrated: ChartGradientColor;
    satisfied: ChartGradientColor;
  };
}

export interface SingleScore {
  scores: {
    employeeCount: number;
    countValues: {
      [key: string]: number;
    };
  };
  employeeTotal: number;
  bandType: string;
}

export interface BaseChartOptions {
  dimensions: {
    height: number;
    width: number;
  };
  margins: {
    top: number;
    left: number;
    bottom: number;
    right: number;
  };
  colors: {
    start?: string;
    end?: string;
    fill?: string;
    gradient?: boolean;
  };
  bandOverrides?: string[];
}

export interface BusinessChartOptions extends BaseChartOptions {
  dimensions: {
    height: number;
    width: number;
  };
  margins: {
    top: number;
    left: number;
    bottom: number;
    right: number;
  };
  bandOverrides?: string[];
}

export interface WorstOfficesOptions {
  dimensions: {
    height: number;
    width: number;
  };
  margins: {
    top: number;
    left: number;
    bottom: number;
    right: number;
  };
  colors: {
    [BAND_TYPE_SUFFERING]: ChartGradientColor;
    [BAND_TYPE_FRUSTRATED]: ChartGradientColor;
    [BAND_TYPE_SATISFIED]: ChartGradientColor;
  };
  bandOverrides?: Record<string, any>;
}

export type DatumCoordinates = {
  x: number;
  y: number;
};

export interface BreakdownCoordinates extends DatumCoordinates {
  width: number;
  daysLost: number;
  employeeCount: number;
}

export type FormattedWellbeingChartData = {
  averageDaysLost: number;
  totalEmployees: number;
  highestDaysLost: number;
  tenPercentDaysLost: number;
  tenPercentEmployees: number;
  ninetyPercentEmployees: number;
  coordinates: {
    overview: DatumCoordinates[];
    tenPercent: BreakdownCoordinates[];
    ninetyPercent: BreakdownCoordinates[];
  };
};

export type Scales = {
  //eslint-disable-next-line
  xScale: ScaleLinear<number, number, any>;
  yScale: ScaleBand<string>;
};

export type HXScales = {
  //eslint-disable-next-line
  yScale: ScaleLinear<number, number, any>;
  xScale: ScaleBand<string>;
  xLinear: ScaleLinear<number, number, any>;
};

export interface HXOverTimeOptions {
  dimensions: {
    height: number;
    width: number;
  };
  margins: {
    top: number;
    left: number;
    bottom: number;
    right: number;
  };
  colors: {
    remote: string;
    office: string;
    suffering: string;
    frustrated: string;
    satisfied: string;
  };
}

export interface CarbonEmissionsOtions {
  dimensions: {
    height: number;
    width: number;
  };
  margins: {
    top: number;
    left: number;
    bottom: number;
    right: number;
  };
  colors: {
    saved: string;
    potential: string;
  };
}
