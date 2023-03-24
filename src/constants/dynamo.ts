//Not sure if this should be a const with 0 values or a type :answers-on-a-postcard:
export type UpdateReportExpressionAttributeValues = { ':reportName': string; ':reportDate': string };
export const UPDATE_REPORT_EXPRESSION_ATTRIBUTE_NAMES = { '#reportName': 'reportName', '#reportDate': 'reportDate' };
export const UPDATE_REPORT_UPDATE_EXPRESSION = 'SET #reportName = :reportName, #reportDate = :reportDate';
