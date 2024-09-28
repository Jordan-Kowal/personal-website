import { IconButton, Space } from "@/components/ui";
import { GITHUB_URL, LINKEDIN_URL, YOUTUBE_URL } from "@/core/constants";
import {
  FilePdfOutlined,
  GithubOutlined,
  LinkedinOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import { memo } from "react";
import { Link } from "react-router-dom";

export const Socials: React.FC = memo(() => (
  <Space size={20}>
    <Link to={GITHUB_URL} target="_blank">
      <IconButton
        size="large"
        type="text"
        icon={<GithubOutlined />}
        tooltip="GitHub"
      />
    </Link>
    <Link to={LINKEDIN_URL} target="_blank">
      <IconButton
        size="large"
        type="text"
        icon={<LinkedinOutlined />}
        tooltip="LinkedIn"
      />
    </Link>
    <Link to={YOUTUBE_URL} target="_blank">
      <IconButton
        size="large"
        type="text"
        icon={<YoutubeOutlined />}
        tooltip="Youtube"
      />
    </Link>
    <Link to="files/resume.pdf" target="_blank">
      <IconButton
        size="large"
        type="text"
        icon={<FilePdfOutlined />}
        tooltip="Resume"
      />
    </Link>
  </Space>
));
