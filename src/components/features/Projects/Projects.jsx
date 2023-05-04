import React, { memo } from 'react';
import { Col, Row } from 'antd';
import { Section } from '@/components/ui';
import { projects } from '@/data';
import ProjectCard from './ProjectCard';
import styles from './Projects.module.less';

const Projects = () => (
  <Section
    className={styles.projects}
    title="Projects"
    subtitle="Look mom, I made these!"
  >
    <Row gutter={[20, 20]}>
      <Col xs={24} sm={12} md={12} lg={8} xl={6}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </Col>
    </Row>
  </Section>
);

Projects.propTypes = {};

export default memo(Projects);
