import React from 'react';
import { Card, Typography } from 'antd';
import { ProjectPropType } from '@/core/proptypes';
import styles from './ProjectCard.module.less';

const { Text } = Typography;

const ProjectCard = ({ project }) => (
  <Card className={styles.projectCard}>
    <div className={styles.projectNameContainer}>
      <Text strong className={styles.projectNameBackground}>
        {project.name}
      </Text>
      <Text className={styles.projectName}>{project.name}</Text>
    </div>
    <Text className={styles.projectDescription} italic type="secondary">
      {project.description}
    </Text>
  </Card>
);

ProjectCard.propTypes = {
  project: ProjectPropType,
};

export default ProjectCard;
