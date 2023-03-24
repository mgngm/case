import type { WorstOfficesChart } from 'lambda/parse/report/chart-data';
import type { PersonaHybridBreakdown, WorkingLocations } from 'src/types/csv';

export interface ReportBlockDatum {
  value: number | string;
  label?: string;
  suffix?: string;
  prefix?: string;
}

export type ChartTooltip = {
  label?: string;
  mean?: number;
  employees?: number;
  wastedMinutes?: number;
  wastedDays?: number;
};

export interface BaseBlockData {
  title: string;
  subtitle: string;
  text: string[];
  metrics: Record<string, unknown>;
  chartData: Record<string | number, number>;
  chartTooltip?: Record<string, ChartTooltip>;
}

export interface WellbeingBlockData extends BaseBlockData {
  metrics: {
    averageDaysLost: ReportBlockDatum;
    payrollLost: ReportBlockDatum;
    revenueOpportunity: ReportBlockDatum;
    carbonReduction: ReportBlockDatum;
  };
  table: {
    title: string;
    rows: ReportBlockDatum[];
  };
}

export interface PayrollBlockData extends BaseBlockData {
  metrics: {
    opportunity: ReportBlockDatum;
    averageOpportunity: ReportBlockDatum;
  };
}

export interface RevenueBlockData extends BaseBlockData {
  metrics: {
    opportunity: ReportBlockDatum;
    averageOpportunity: ReportBlockDatum;
  };
}
export interface BusinessBlockData extends BaseBlockData {
  metrics: {
    averageDaysLost: ReportBlockDatum;
    suffering: ReportBlockDatum;
    frustrated: ReportBlockDatum;
    satisfied: ReportBlockDatum;
    personaTerm: ReportBlockDatum;
  };
}

export type ReportBlocks = {
  wellbeingBlockData?: WellbeingBlockData;
  payrollBlockData?: PayrollBlockData;
  revenueBlockData?: RevenueBlockData;
  businessBlockData?: BusinessBlockData;
};

export interface WorkingLocationPercentages {
  suffering: number;
  frustrated: number;
  satisfied: number;
}

export interface WorkingLocation {
  score: number;
  percentages: WorkingLocationPercentages;
}

export type WorstOffices = Record<string, WorstOfficesChart> | WorstOfficesChart;

export type BandedScores = {
  suffering: {
    employeeCount: number;
    countValues: { 1: number; 2: number; 3: number; 4: number };
  };
  frustrated: { employeeCount: number; countValues: { 5: number; 6: number; 7: number } };
  satisfied: { employeeCount: number; countValues: { 8: number; 9: number; 10: number } };
};

export type Metrics = {
  currency: string;
  wellbeing: {
    value: number;
    delta: number;
  };
  equality: {
    value: string;
    delta: number;
  };
  payroll: {
    value: number;
    delta: number;
  };
  efficiency: {
    value: number;
    delta: number;
  };
  revenue: {
    value: number;
    delta: number;
  };
};

export type EmployeeCounts = {
  total: number;
  home: number;
  office: number;
  hybrid: number;
  levers?: {
    hybridUpper?: number;
    hybridLower?: number;
  };
  hybridBreakdown: {
    0: number; //0-1 days
    20: number; //1-2 days
    40: number; ///2-3 days
    60: number; //3-4 days
    80: number; //4-5 days
  };
  personas: Record<string, PersonaHybridBreakdown>;
};

export interface DashboardData {
  empty?: boolean;
  organisation: string;
  employees: EmployeeCounts;
  workingLocations: {
    home: WorkingLocation;
    office: WorkingLocation;
    personas: Record<string, WorkingLocations>;
  };
  worstOffices: WorstOffices;
  hxScore: { value: number; delta: number };
  scores: BandedScores;
  metrics: Metrics;
  blockData: ReportBlocks;
}
