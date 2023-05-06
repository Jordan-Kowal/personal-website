import React, { memo, useCallback } from 'react';
import {
  GithubOutlined,
  GlobalOutlined,
  PictureOutlined,
} from '@ant-design/icons';
import { Card, Typography } from 'antd';
import PropTypes from 'prop-types';
import { Ribbon } from '@/components/ui';
import IconButton from '@/components/ui/IconButton';
import { ProjectPropType } from '@/core/proptypes';
import LinkCardAction from '../LinkCardAction';
import styles from './ProjectCard.module.less';

const { Text } = Typography;

const cardBodyStyle = {
  paddingTop: 100,
  minHeight: 250,
};

const ProjectCard = ({ onPictureClick, project }) => {
  const hasScreenshots = project?.screenshots?.length > 0;
  const ribbonText = project?.deprecated ? 'Deprecated' : null;

  const handlePictureClick = useCallback(() => {
    if (hasScreenshots) {
      onPictureClick(project.screenshots);
    }
  }, [hasScreenshots, onPictureClick, project.screenshots]);

  return (
    <Ribbon text={ribbonText} color="red">
      <Card
        className={styles.projectCard}
        actions={[
          <LinkCardAction
            key="github"
            icon={<GithubOutlined />}
            tooltip="GitHub"
            url={project.githubUrl}
          />,
          <LinkCardAction
            key="website"
            icon={<GlobalOutlined />}
            tooltip="Official Website"
            url={project.websiteUrl}
          />,
          <IconButton
            icon={<PictureOutlined />}
            tooltip="Screenshots"
            disabled={!hasScreenshots}
            isText
            onClick={handlePictureClick}
            size="large"
          />,
        ]}
        bodyStyle={cardBodyStyle}
        bordered={false}
      >
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
    </Ribbon>
  );
};

ProjectCard.propTypes = {
  onPictureClick: PropTypes.func,
  project: ProjectPropType,
};

export default memo(ProjectCard);
