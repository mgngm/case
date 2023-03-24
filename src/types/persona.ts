export type Application = Record<string, number>;

export type InputAssumption = {
  TIME_WORKED_PER_DAY: number;
  DAILY_DIGITAL_PERCENTAGE: number;
  PAYROLL_PER_EMPLOYEE: number;
  REVENUE_PER_EMPLOYEE: number;
  NUMBER_OF_EMPLOYEES: number;
  applications: Application;
};

export type Settings = {
  termType: string;
  term: string;
  inputAssumptions: Record<string, InputAssumption>;
};
