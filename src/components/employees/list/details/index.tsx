import SidePanel, { SidePanelTabs } from 'src/components/shared/drawer/side-panel';
import type { DU } from 'src/graphql';
import Improvements from './improvements';
import KeyData from './key-data';
import Overview from './overview';

type DetailsDrawerProps = {
  employee: DU | undefined;
  onClose: () => void;
  onImprovement?: (id: string) => void;
};

const DetailsDrawer = ({ employee, onClose, onImprovement }: DetailsDrawerProps) => (
  <SidePanel open={!!employee} onClose={onClose} heading={`Digital User: ${employee?.name ?? ''}`}>
    <SidePanelTabs
      tabs={{
        overview: employee && <Overview {...{ employee }} />,
        keyData: employee && <KeyData {...{ employee }} />,
        improvements: employee && <Improvements {...{ employee, onImprovement }} />,
      }}
      defaultTab="overview"
      labels={{ overview: 'Overview', keyData: 'Key data', improvements: 'Improvements' }}
    />
  </SidePanel>
);

export default DetailsDrawer;
