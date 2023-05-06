import React, { memo, useCallback, useState } from 'react';
import { Col, Row } from 'antd';
import { Section } from '@/components/ui';
import { ProjectDB } from '@/data';
import ProjectCard from './ProjectCard';
import ScreenshotGallery from './ScreenshotGallery';

const projects = [
  ProjectDB.JKLIB,
  ProjectDB.JKSCRIPT,
  ProjectDB.DJANGO_REACT_STARTER,
  ProjectDB.ENSEIRB_SCHEDULE_NOTIFIER,
  ProjectDB.PERSONAL_WEBSITE,
  ProjectDB.CHALLENGES,
  ProjectDB.DISCORD_DICE_ROLLER,
  ProjectDB.DJANGO_DATABASE_TRANSLATION,
  ProjectDB.SUDOKU_MANAGER,
];

const Projects = () => {
  const [images, setImages] = useState([]);

  const onScreenshotsClick = useCallback((screenshots) => {
    setImages(screenshots);
  }, []);

  const onModalClose = () => {
    setImages([]);
  };

  return (
    <Section title="Projects" subtitle="For when I have too much free time">
      <Row gutter={[20, 20]}>
        {projects.map((project) => (
          <Col xs={24} sm={12} md={12} lg={8} xl={6} key={project.id}>
            <ProjectCard
              project={project}
              onPictureClick={onScreenshotsClick}
            />
          </Col>
        ))}
      </Row>
      <ScreenshotGallery screenshots={images} onClose={onModalClose} />
    </Section>
  );
};

Projects.propTypes = {};

export default memo(Projects);
