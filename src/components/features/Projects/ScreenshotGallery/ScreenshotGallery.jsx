import React, { memo } from 'react';
import { Carousel, Image, Modal } from 'antd';
import PropTypes from 'prop-types';
import styles from './ScreenshotGallery.module.less';

const ScreenshotGallery = ({ screenshots, onClose }) => {
  if (!screenshots || screenshots?.length === 0) return null;

  return (
    <Modal
      centered
      open
      onCancel={onClose}
      closable
      footer={null}
      width="85%"
      className={styles.screenshotGallery}
    >
      <Carousel autoplay dotPosition="bottom">
        {screenshots.map((screenshot) => (
          <div className={styles.imageContainer}>
            <Image src={screenshot} key={screenshot} preview={false} />
          </div>
        ))}
      </Carousel>
    </Modal>
  );
};

ScreenshotGallery.propTypes = {
  onClose: PropTypes.func,
  screenshots: PropTypes.arrayOf(PropTypes.string),
};

export default memo(ScreenshotGallery);
