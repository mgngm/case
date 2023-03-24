import type { ReactNode } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Fab from '@mui/material/Fab';
import Modal from '@mui/material/Modal';
import styles from './lightbox.module.scss';

const Lightbox = ({
  children,
  isOpen,
  handleClose,
}: {
  children: ReactNode;
  isOpen: boolean;
  handleClose: () => void;
}) => (
  <Modal
    open={isOpen}
    onClose={() => handleClose()}
    aria-labelledby="lightbox-modal-title"
    aria-describedby="lightbox-modal-description"
  >
    <div className={styles.pageWrap} onClick={() => handleClose()}>
      <div className={styles.contentWrap} onClick={(e) => e.stopPropagation()}>
        <Fab onClick={() => handleClose()} className={styles.closeBtn}>
          <CloseIcon />
        </Fab>
        {children}
      </div>
    </div>
  </Modal>
);

export default Lightbox;
