export type ResponseData<Data = unknown> = {
  ok?: boolean;
  error?: string | Array<{ string: string }>;
  data?: Data;
};

export interface LoginProviderResponseData extends ResponseData {
  redirectUrl?: string;
}

export type ReportCsvResponseDataType = ResponseData<{
  key: string;
  levers: {
    hybridLower: number;
    hybridUpper: number;
    workingDays: number;
  };
  warnings: Record<string, string>[];
}>;

export type QueueMessageBody = {
  queue: string;
  messageBody: string; //json stringify for whatever you're getting your lambda to do.
};
