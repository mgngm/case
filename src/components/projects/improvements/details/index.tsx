import Overview from 'src/components/projects/improvements/details/overview';
import type { SidePanelProps } from 'src/components/shared/drawer/side-panel';
import SidePanel, { SidePanelTabs } from 'src/components/shared/drawer/side-panel';
import type { Project } from 'src/graphql';

type ImprovementsDrawerProps = {
  project: Project | undefined;
  refProject?: Project | undefined;
} & Omit<SidePanelProps, 'heading'>;

const ImprovementsDrawer = ({ project, refProject, ...props }: ImprovementsDrawerProps) => (
  <SidePanel open={!!project} heading={`Improvement: ${project?.projectName ?? ''}`} {...props}>
    <SidePanelTabs
      tabs={{
        overview: project && <Overview project={project} refProject={refProject} />,
        issueDetails: null,
        keyInformation: null,
        employees: null,
      }}
      defaultTab="overview"
      labels={{
        overview: 'Overview',
        issueDetails: 'Issue details',
        keyInformation: 'Key information',
        employees: 'Employees',
      }}
    />
  </SidePanel>
);

export default ImprovementsDrawer;
