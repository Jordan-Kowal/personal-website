import { Carousel, Image, Modal } from "antd";
import { memo } from "react";

type ScreenshotGalleryProps = {
  screenshots: string[];
  onClose: () => void;
};

export const ScreenshotGallery: React.FC<ScreenshotGalleryProps> = memo(
  ({ screenshots, onClose }) => {
    if (!screenshots || screenshots?.length === 0) return null;

    return (
      <Modal
        centered
        open
        onCancel={onClose}
        closable
        footer={null}
        width="85%"
      >
        <Carousel autoplay dotPosition="bottom">
          {screenshots.map((screenshot) => (
            <div className="px-5 text-center" key={screenshot}>
              <Image src={screenshot} preview={false} />
            </div>
          ))}
        </Carousel>
      </Modal>
    );
  },
);
