export type AdminState = {
  tab: string;
};

export type PreviewPrepareProps = {
  s3Key: string;
  reportId: string | null;
  createReport: boolean;
};
