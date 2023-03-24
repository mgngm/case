import type { ReportState } from 'src/constants/report';
import type { Levers, PersonaSettings } from 'src/types/csv';

//for slice
export type ReportData = {
  selectedReportId: ReportState | string;
  refReportId: ReportState | string;
};

/**
 * TransformFormData
 *
 * partial form data type to handle transform from flattened to
 * nested objects and the necessary keys to match the json schema
 */
export type TransformFormData = {
  employees: {
    hybridBreakdown?: { 0?: number; 20?: number; 40?: number; 60?: number; 80?: number };
    hybrid0?: number;
    hybrid20?: number;
    hybrid40?: number;
    hybrid60?: number;
    hybrid80?: number;
  };
  scores: {
    suffering: {
      countValues?: { 1?: number; 2?: number; 3?: number; 4?: number };
      band1?: number;
      band2?: number;
      band3?: number;
      band4?: number;
    };
    frustrated: {
      countValues?: { 5?: number; 6?: number; 7?: number };
      band5?: number;
      band6?: number;
      band7?: number;
    };
    satisfied: {
      countValues?: { 8?: number; 9?: number; 10?: number };
      band8?: number;
      band9?: number;
      band10?: number;
    };
  };
  workingLocations: {
    homeScore?: number;
    homeSufferingPercent?: number;
    homeFrustratedPercent?: number;
    homeSatisfiedPercent?: number;
    officeScore?: number;
    officeSufferingPercent?: number;
    officeFrustratedPercent?: number;
    officeSatisfiedPercent?: number;
    home?: {
      score?: number;
      percentages?: {
        suffering?: number;
        frustrated?: number;
        satisfied?: number;
      };
    };
    office?: {
      score?: number;
      percentages?: {
        suffering?: number;
        frustrated?: number;
        satisfied?: number;
      };
    };
  };
  // TODO: populate this type
  blockData?: Record<string, never>;
};

export type ParseMetaFields = {
  regenerate?: boolean; //REQUIRED for deletion of existing DUs on parse lambda
  personaSettings: PersonaSettings;
  parseId: string;
  reportId: string;
  inputAnalyticCsv: string;
  inputProjectCsv: string;
  reportName: string;
  reportDate: string;
  orgId: string;
  levers: Levers;
  parseVersion: number;
};
