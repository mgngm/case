export interface ProjectChart {
  title: string;
  body: string;
  imageUrl: string;
}

export type ProjectMetric = {
  text: string;
  icon?: string;
};

export type CustomProject = {
  title: string;
  body: string;
  keyMetrics: ProjectMetric[];
  charts: ProjectChart[];
};

export interface ProjectTemplate {
  id?: string; //from dynamo
  version?: number; //from dynamo
  name: string;
  body: {
    //it says body but it's actually stringified json on the backend
    bodyText: string; //not splitting anymore as we'll support markdown.
    charts?: ProjectChart[];
    keyMetrics?: ProjectMetric[];
  };
  templateId: string;
  status: string;
  type: string;
  context: string;
}

export interface Insight {
  title: string;
  date: string;
  url: string;
}
