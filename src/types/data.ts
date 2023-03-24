export interface Datum {
  title: string;
  value: number | string;
  delta?: number | string;
}

export interface DataSourceSingle {
  key: string;
  lastModified?: string;
}

export interface DataSources {
  [key: string]: DataSourceSingle;
}
