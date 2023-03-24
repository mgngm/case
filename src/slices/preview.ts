import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from 'src/store';

import type { Project } from 'src/graphql';
import { userSignedOut } from 'src/slices/users';
import type { CustomProject } from 'src/types/projects';
import type { DashboardData } from 'src/types/slices';

export interface PreviewState {
  customProjects: CustomProject[];
  insights: string[];
  reportData: DashboardData | null;
  projects: Project[];
  reportName: string | null;
  reportDate: string | null;
}

const initialState: PreviewState = {
  customProjects: [],
  insights: [],
  reportData: null,
  projects: [],
  reportName: null,
  reportDate: null,
};

export const previewSlice = createSlice({
  name: 'preview',
  initialState,
  reducers: {
    setPreviewReportData: (state, { payload }: PayloadAction<DashboardData>) => {
      state.reportData = payload;
    },
    setCustomProjects: (state, { payload }: PayloadAction<CustomProject[]>) => {
      state.customProjects = payload;
    },
    resetCustomProjects: (state) => {
      state.customProjects = initialState.customProjects;
    },
    setInsights: (state, { payload }: PayloadAction<string[]>) => {
      state.insights = payload;
    },
    resetInsights: (state) => {
      state.insights = initialState.insights;
    },
    setPreviewProjects: (state, { payload }: PayloadAction<Project[]>) => {
      state.projects = payload; // completely replace the current state with the new list
    },
    resetPreviewProjects: (state) => {
      state.projects = initialState.projects;
    },
    setPreviewReportName: (state, { payload }: PayloadAction<string>) => {
      state.reportName = payload;
    },
    setPreviewReportDate: (state, { payload }: PayloadAction<string>) => {
      state.reportDate = payload;
    },
    resetPreview: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(userSignedOut, () => initialState);
  },
});

export const {
  setCustomProjects,
  resetCustomProjects,
  setInsights,
  resetInsights,
  resetPreview,
  setPreviewReportData,
  setPreviewProjects,
  resetPreviewProjects,
  setPreviewReportDate,
  setPreviewReportName,
} = previewSlice.actions;

export const selectCustomProjects = ({ preview }: RootState) => preview.customProjects;
export const selectPreviewProjects = ({ preview }: RootState) => preview.projects;
export const selectInsights = ({ preview }: RootState) => preview.insights;
export const selectPreviewReportData = ({ preview }: RootState) => preview.reportData;
export const selectPreviewReportName = ({ preview }: RootState) => preview.reportName;
export const selectPreviewReportDate = ({ preview }: RootState) => preview.reportDate;

export default previewSlice.reducer;
