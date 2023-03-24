import { useEffect, useState } from 'react';
import Skeleton from '@mui/material/Skeleton';
import { Storage } from 'aws-amplify';
import Lightbox from 'src/components/shared/lightbox';
import type { ProjectChart } from 'src/types/projects';
import styles from './projects.module.scss';

const Chart = ({ chart }: { chart: ProjectChart }) => {
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(chart.imageUrl);

  const getImageUrl = async (key: string) => {
    try {
      setLoading(true);
      const url = await Storage.get(key);
      setImageSrc(url);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!chart.imageUrl.startsWith('http')) {
      getImageUrl(chart.imageUrl);
    } else {
      setLoading(false);
    }
  }, [chart.imageUrl]);

  return (
    <div className={styles.chartWrapper}>
      <div className={styles.chartImageWrapper}>
        {loading ? (
          <Skeleton variant="rectangular" width={210} height={118} />
        ) : (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setLightboxOpen(true);
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageSrc} alt={chart.title} className={styles.chartImage} />
          </a>
        )}
      </div>
      <Lightbox isOpen={lightboxOpen} handleClose={() => setLightboxOpen(false)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={chart.title}
          className={styles.chartImage}
          style={{
            width: '100%',
            height: 'auto',
          }}
        />
      </Lightbox>
    </div>
  );
};

export default Chart;
