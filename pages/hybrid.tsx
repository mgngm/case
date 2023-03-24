import Head from 'next/head';
import HybridWorking from 'src/components/hybrid';
import Navigation from 'src/components/navigation';
import usePreviewUpdate from 'src/hooks/use-preview-update';
import homeStyles from 'styles/Home.module.scss';

const HybridWorkingPage = () => {
  usePreviewUpdate();

  return (
    <>
      <Head>
        <title>Actual Experience Portal | Hybrid Working</title>
      </Head>

      <Navigation>
        <div className={homeStyles.mainContentWrapper}>
          <HybridWorking />
        </div>
      </Navigation>
    </>
  );
};

export default HybridWorkingPage;
