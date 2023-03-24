import type { Project } from 'src/graphql';
import type { CustomProject } from 'src/types/projects';

export type UpdateReportWithProjectsProps = {
  projects?: Project[];
  customProjects?: CustomProject[];
  insights?: string[];
};

export type UpdateReportWithProjectsFn = ({
  projects,
  customProjects,
  insights,
}: UpdateReportWithProjectsProps) => void;
