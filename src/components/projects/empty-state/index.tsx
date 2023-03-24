import styles from 'src/components/projects/projects.module.scss';
import EmptyBlock from './block';

const ProjectsPageEmpty = () => (
  <div className={styles.projectsWrapper} id="empty-improvements-page">
    <h1>Improvements</h1>
    <EmptyBlock>No Improvements found</EmptyBlock>
    <h1>Additional Insights</h1>
    <EmptyBlock>No Additional Insights found</EmptyBlock>
  </div>
);
export default ProjectsPageEmpty;
