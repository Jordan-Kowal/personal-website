import { Col, Row } from "antd";
import { memo, useCallback, useState } from "react";
import { ProjectDB } from "@/data";
import { ProjectCard } from "./ProjectCard";
import { ScreenshotGallery } from "./ScreenshotGallery";

const projects = [
  ProjectDB.PIPE_OPERATOR,
  ProjectDB.DJANGO_REACT_STARTER,
  ProjectDB.DJANGO_UTILS_KIT,
  ProjectDB.DJANGO_MEILISEARCH_INDEXER,
  ProjectDB.JKSCRIPT,
  ProjectDB.PERSONAL_WEBSITE,
  ProjectDB.CHALLENGES,
  ProjectDB.JKLIB,
  ProjectDB.ENSEIRB_SCHEDULE_NOTIFIER,
  ProjectDB.WORLD_MAP,
  ProjectDB.DISCORD_DICE_ROLLER,
  ProjectDB.DJANGO_DATABASE_TRANSLATION,
  ProjectDB.SUDOKU_MANAGER,
];

export const Projects: React.FC = memo(() => {
  const [images, setImages] = useState<string[]>([]);

  const onScreenshotsClick = useCallback((screenshots: string[]) => {
    setImages(screenshots);
  }, []);

  const onModalClose = () => {
    setImages([]);
  };

  return (
    <Row gutter={[20, 20]}>
      {projects.map((project) => (
        <Col xs={24} sm={12} md={12} lg={8} xl={6} key={project.id}>
          <ProjectCard project={project} onPictureClick={onScreenshotsClick} />
        </Col>
      ))}
      <ScreenshotGallery screenshots={images} onClose={onModalClose} />
    </Row>
  );
});
