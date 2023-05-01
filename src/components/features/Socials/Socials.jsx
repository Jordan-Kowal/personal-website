import React, { memo } from 'react';
import {
  FilePdfOutlined,
  GithubOutlined,
  LinkedinOutlined,
  YoutubeOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { IconButton, Space } from '@/components/ui';

// TODO: Download Resume
const Socials = () => (
  <Space size={0}>
    <Link to="https://github.com/Jordan-Kowal">
      <IconButton isText icon={<GithubOutlined />} tooltip="GitHub" />
    </Link>
    <Link to="https://www.linkedin.com/in/jordan-kowal/">
      <IconButton isText icon={<LinkedinOutlined />} tooltip="LinkedIn" />
    </Link>
    <Link to="https://www.youtube.com/channel/UC8aLJUnA2x5HgjvirPL1yTw">
      <IconButton isText icon={<YoutubeOutlined />} tooltip="Youtube" />
    </Link>
    <Link to="/">
      <IconButton isText icon={<FilePdfOutlined />} tooltip="Resume" />
    </Link>
  </Space>
);

Socials.propTypes = {};

export default memo(Socials);
