import React, { memo } from 'react';
import { Carousel, Image, Modal } from 'antd';
import PropTypes from 'prop-types';

const ScreenshotGallery = ({ screenshots, onClose }) => {
  if (!screenshots || screenshots?.length === 0) return null;

  return (
    <Modal centered open onCancel={onClose} closable footer={null} width="85%">
      <Carousel autoplay dotPosition="bottom">
        {screenshots.map((screenshot) => (
          <div>
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
