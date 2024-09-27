import { IconButton, Ribbon, SkillIcon, Space } from "@/components/ui";
import type { Project } from "@/data/projects";
import { theme } from "@/styles";
import {
  GithubOutlined,
  GlobalOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { Card, Typography } from "antd";
import { memo, useCallback } from "react";
import { LinkCardAction } from "../LinkCardAction";
import styles from "./ProjectCard.module.less";

const { Text } = Typography;

const cardBodyStyle = {
  paddingTop: 80,
  minHeight: 280,
};

type ProjectCardProps = {
  onPictureClick: (screenshots: string[]) => void;
  project: Project;
};

export const ProjectCard: React.FC<ProjectCardProps> = memo(
  ({ onPictureClick, project }) => {
    const hasScreenshots = project?.screenshots?.length > 0;
    const ribbonText = project?.deprecated ? "Deprecated" : undefined;

    const handlePictureClick = useCallback(() => {
      if (hasScreenshots) {
        onPictureClick(project.screenshots);
      }
    }, [hasScreenshots, onPictureClick, project.screenshots]);

    return (
      <Ribbon text={ribbonText} color={theme.colors.error}>
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
              key="screenshots"
              icon={<PictureOutlined />}
              tooltip="Screenshots"
              disabled={!hasScreenshots}
              type="text"
              onClick={handlePictureClick}
              size="large"
            />,
          ]}
          bodyStyle={cardBodyStyle}
          bordered={false}
        >
          <Space vertical block size={8}>
            <div className={styles.projectNameContainer}>
              <Text strong className={styles.projectNameBackground}>
                {project.name}
              </Text>
              <Text className={styles.projectName}>{project.name}</Text>
            </div>
            <Space className={styles.projectSkills}>
              {project.skills.map((skill) => (
                <SkillIcon skill={skill} key={skill.id} />
              ))}
            </Space>
            <Text className={styles.projectDescription} italic type="secondary">
              {project.description}
            </Text>
          </Space>
        </Card>
      </Ribbon>
    );
  },
);
