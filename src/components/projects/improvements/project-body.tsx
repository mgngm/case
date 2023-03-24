/* eslint-disable @typescript-eslint/no-explicit-any */

import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';
import type { Options } from 'react-markdown';
import Chart from 'src/components/projects/chart';
import Hero from 'src/components/shared/hero';
import EvaluationIcon from 'src/icons/report-blocks/evaluation.svg';
import ReportIcon from 'src/icons/report-blocks/report.svg';
import type { ProjectChart, ProjectMetric } from 'src/types/projects';
import styles from './project-body.module.scss';

const markdownComponentsMap: Options['components'] = {
  h1: (props) => <h3 className={styles.detailTitle} {...props}></h3>,
  h2: (props) => <h4 className={styles.detailTitle} {...props}></h4>,
  h3: (props) => <h5 className={styles.detailTitle} {...props}></h5>,
  p: (props) => <p className={styles.detailBody} {...props}></p>,
};

const ChartWrapper = ({ chart, idPrefix }: { chart: ProjectChart; idPrefix?: string }) => (
  <div className={styles.detailBlock} id={idPrefix + '-chart-block'}>
    <h3 className={styles.detailTitle}>{chart.title}</h3>
    <Chart chart={chart} />
    <ReactMarkdown components={markdownComponentsMap}>
      {Array.isArray(chart.body) ? chart.body.join('\n') : chart.body}
    </ReactMarkdown>
  </div>
);

export type ProjectBodyContent = {
  bodyText: string;
  charts?: ProjectChart[];
  keyMetrics?: ProjectMetric[];
};

const ProjectBody = ({
  body,
  projectId,
  idPrefix = projectId,
}: {
  body: ProjectBodyContent;
  projectId?: string;
  idPrefix?: string;
}) => {
  return (
    <>
      <div className={styles.detailBlockContainer} id={idPrefix + '-body-text'}>
        {body.bodyText !== ' ' ? (
          <div className={clsx([styles.detailBlock, styles.detailBlockText])} id={idPrefix + '-body-text'}>
            <ReactMarkdown components={markdownComponentsMap}>
              {Array.isArray(body.bodyText) ? body.bodyText.join('\n') : body.bodyText}
            </ReactMarkdown>
          </div>
        ) : null}
        {body.charts && body.charts.length === 1
          ? body.charts.map((chart, idx) => <ChartWrapper key={`${idx}-${chart.title}`} {...{ chart, idPrefix }} />)
          : null}
      </div>
      {body.charts && body.charts.length > 1
        ? body.charts.map((chart, idx) => (
            <div key={`${idx}-${chart.title}`} className={styles.detailBlockContainer}>
              <ChartWrapper {...{ chart, idPrefix }} />
            </div>
          ))
        : null}
      {(body.keyMetrics && body.keyMetrics.length > 0) || projectId ? (
        <div className={styles.detailBlock}>
          {body.keyMetrics
            ? body.keyMetrics.map((metric, idx) => (
                <Hero
                  key={idx}
                  icon={metric.icon ? metric.icon : EvaluationIcon}
                  title="Key information"
                  subtitle={metric.text}
                  id={idPrefix + '-metric-' + idx}
                />
              ))
            : null}
          {projectId ? (
            <Hero icon={ReportIcon} title="Project ID" subtitle={projectId} id={idPrefix + 'project-id'} />
          ) : null}
        </div>
      ) : null}
    </>
  );
};

export default ProjectBody;
