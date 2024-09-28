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

const { Text } = Typography;

const cardBodyStyle = {
  paddingTop: 80,
  minHeight: 280,
  backgroundPositionX: "right -1px",
  backgroundPositionY: "-1px",
  lineHeight: "0 !important",
};

const backgroundTextStyle = {
  color: `${theme.colors.primary}08`,
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
      <Ribbon text={ribbonText} show color={theme.colors.error}>
        <Card
          className=""
          classNames={{
            actions: "bg-bg-darker",
            body: "overflow-hidden text-left bg-bg-darker border-0 rounded-none bg-project-card bg-no-repeat",
          }}
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
          styles={{ body: cardBodyStyle, extra: backgroundTextStyle }}
          bordered={false}
        >
          <Space vertical block size={8}>
            <div className="relative z-10">
              <Text
                strong
                className="absolute -z-10 m-0 -left-4 -top-8 text-5xl select-none break-keep"
                style={backgroundTextStyle}
              >
                {project.name}
              </Text>
              <Text className="m-0 text-lg text-primary">{project.name}</Text>
            </div>
            <Space className="relative z-10">
              {project.skills.map((skill) => (
                <SkillIcon skill={skill} key={skill.id} />
              ))}
            </Space>
            <Text className="text-xs" italic type="secondary">
              {project.description}
            </Text>
          </Space>
        </Card>
      </Ribbon>
    );
  },
);
