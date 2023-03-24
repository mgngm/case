import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { memoizeWithArgs } from 'proxy-memoize';
import type { RootState } from 'src/store';
import { ALL_EMPLOYEES } from 'src/constants/report';
import { sortStringsAscending } from 'src/logic/libs/helpers';
import { userSignedOut } from 'src/slices/users';
import type { PersonaHybridBreakdown } from 'src/types/csv';
import type { DataSources } from 'src/types/data';
import type { DashboardData } from 'src/types/slices';

const emptyData: DashboardData = {
  empty: true,
  organisation: '',
  employees: {
    total: 0,
    home: 0,
    office: 0,
    hybrid: 0,
    levers: {
      hybridLower: 0.05,
      hybridUpper: 0.95,
    },
    hybridBreakdown: {
      0: 0, //0-1
      20: 0, //1-2
      40: 0, //2-3
      60: 0, //3-4
      80: 0, //4-5
    },
    personas: {},
  },
  hxScore: { value: 0, delta: 0 },
  workingLocations: {
    home: {
      score: 0.0,
      percentages: {
        suffering: 0,
        frustrated: 0,
        satisfied: 0,
      },
    },
    office: {
      score: 0.0,
      percentages: {
        suffering: 0,
        frustrated: 0,
        satisfied: 0,
      },
    },
    personas: {},
  },
  scores: {
    suffering: {
      employeeCount: 0,
      countValues: { 1: 0, 2: 0, 3: 0, 4: 0 },
    },
    frustrated: { employeeCount: 0, countValues: { 5: 0, 6: 0, 7: 0 } },
    satisfied: { employeeCount: 0, countValues: { 8: 0, 9: 0, 10: 0 } },
  },
  metrics: {
    currency: '£',
    wellbeing: {
      value: 0,
      delta: 0,
    },
    equality: {
      value: '',
      delta: 0,
    },
    payroll: {
      value: 0,
      delta: 0,
    },
    efficiency: {
      value: 0,
      delta: 0,
    },
    revenue: {
      value: 0,
      delta: 0,
    },
  },
  worstOffices: {},
  blockData: {},
};

export const selectAllDashboardData = (data: DashboardData | null | undefined = emptyData) => data;
export const selectOrganisationId = (data: DashboardData | null | undefined = emptyData) => data?.organisation;
export const selectEmployeeCounts = (data: DashboardData | null | undefined = emptyData) => data?.employees;
export const selectEmployeeCountsByPersona = (
  data: DashboardData | null | undefined = emptyData,
  persona = ALL_EMPLOYEES
): PersonaHybridBreakdown => {
  if (persona === ALL_EMPLOYEES) {
    return data?.employees as PersonaHybridBreakdown;
  } else {
    return data?.employees?.personas[persona] as PersonaHybridBreakdown;
  }
};
export const selectHXScore = (data: DashboardData | null | undefined = emptyData) => data?.hxScore;
export const selectBandedScores = (data: DashboardData | null | undefined = emptyData) => data?.scores;
export const selectMetrics = (data: DashboardData | null | undefined = emptyData) => data?.metrics;
export const selectAllReportBlocks = (data: DashboardData | null | undefined = emptyData) => data?.blockData;
export const selectAllWorkingLocationData = (data: DashboardData | null | undefined = emptyData) =>
  data?.workingLocations;
export const selectWorkingLocationDataByPersona = (
  data: DashboardData | null | undefined = emptyData,
  persona = ALL_EMPLOYEES
) => {
  if (persona === ALL_EMPLOYEES) {
    return data?.workingLocations;
  } else {
    return data?.workingLocations?.personas[persona];
  }
};

export const selectCurrency = (data: DashboardData | null | undefined = emptyData) => data?.metrics?.currency;
export const selectWorstOffices = (data: DashboardData | null | undefined = emptyData) => data?.worstOffices ?? {};

export const selectPersonasFromEmployeeCounts = memoizeWithArgs(
  (data: DashboardData | null | undefined = emptyData) => {
    const personas = data?.employees?.personas;
    return personas ? Object.keys(personas).sort(sortStringsAscending) : [];
  }
);
export const selectPersonasFromWorkingLocations = memoizeWithArgs(
  (data: DashboardData | null | undefined = emptyData) => {
    const personas = data?.workingLocations?.personas;
    return personas ? Object.keys(personas).sort(sortStringsAscending) : [];
  }
);

export const selectDataListByAdminContext = memoizeWithArgs((listData: DataSources, adminContext: string) =>
  Object.fromEntries(Object.entries(listData).filter(([key]) => key.startsWith(adminContext)))
);

type DashboardState = {
  reportSelectorOpenState: boolean;
  reportPersonaFilter: string;
};

export const initialState: DashboardState = {
  reportSelectorOpenState: false,
  reportPersonaFilter: ALL_EMPLOYEES,
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    reportSelectorOpenStateChanged: (state, { payload }: PayloadAction<boolean>) => {
      state.reportSelectorOpenState = payload;
    },
    setReportPersonaFilter: (state, { payload }: PayloadAction<string>) => {
      state.reportPersonaFilter = payload;
    },
    resetReportPersonaFilter: (state) => {
      state.reportPersonaFilter = ALL_EMPLOYEES;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userSignedOut, () => initialState);
  },
});

export const { reportSelectorOpenStateChanged, setReportPersonaFilter, resetReportPersonaFilter } =
  dashboardSlice.actions;

export const selectReportSelectorOpenState = (state: RootState) => state.dashboard.reportSelectorOpenState;
export const selectReportPersonaFilter = (state: RootState) => state.dashboard.reportPersonaFilter;

// exporting the reducer here, as we need to add this to the store
export default dashboardSlice.reducer;
