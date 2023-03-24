import { clsx } from 'clsx';
import type { NextPage } from 'next';
import Head from 'next/head';
import Navigation from 'src/components/navigation';
import Insights from 'src/components/projects/insights';
import usePreviewUpdate from 'src/hooks/use-preview-update';
import homeStyles from 'styles/Home.module.scss';

const ImprovementsInsights: NextPage = () => {
  //Set up the preview listeners (IMPORTANT!!!!)
  usePreviewUpdate();
  return (
    <>
      <Head>
        <title>Actual Experience Portal | Improvements</title>
      </Head>

      <Navigation>
        {/* table-page is a global scope selector */}
        <div className={clsx([homeStyles.mainContentWrapper, homeStyles.tablePageWrapper, 'table-page'])}>
          <Insights />
        </div>
      </Navigation>
    </>
  );
};

export default ImprovementsInsights;
