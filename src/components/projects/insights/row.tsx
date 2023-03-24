import { useCallback, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Storage } from 'aws-amplify';
import clsx from 'clsx';
import download from 'downloadjs';
import type { ProjectInsight } from 'src/graphql';
import styles from './insights.module.scss';

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes == 0) {
    return '0 Bytes';
  }
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};

const getExtensionForFilename = (filename: string) => {
  const split = filename.split('.');
  if (split.length > 1) {
    return split.at(-1);
  }
  return '';
};

const InsightRow = ({ insight }: { insight: ProjectInsight }) => {
  const [size, setSize] = useState(-1);
  const [filename, setFilename] = useState('');

  const getS3Item = useCallback(async () => {
    if (insight && insight.s3Key) {
      const [item] = await Storage.list(insight.s3Key);
      if (item && item.key && item.size) {
        setFilename(insight.fileName ?? item.key);
        setSize(item.size);
      }
    }
  }, [insight]);

  useEffect(() => {
    getS3Item();
  }, [getS3Item]);

  if (!insight || !insight.s3Key) {
    return null;
  }

  return (
    <TableRow>
      <TableCell className={clsx(styles.nameColumn, styles.contentRow)}>{insight.name}</TableCell>
      <TableCell className={clsx(styles.dateColumn, styles.contentRow)}>{insight.insightDate}</TableCell>
      <TableCell className={clsx(styles.downloadColumn, styles.contentRow)}>
        <Button
          variant="contained"
          className={styles.downloadBtn}
          onClick={async () => {
            const result = await Storage.get(insight.s3Key as string, { download: true });
            download(result.Body as Blob, filename);
          }}
        >
          Download <span className={styles.extension}>{filename ? getExtensionForFilename(filename) : null}</span>
          {size > -1 ? ` (${formatBytes(size)})` : null}
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default InsightRow;
