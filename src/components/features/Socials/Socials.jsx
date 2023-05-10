import React, { memo } from 'react';
import {
  FilePdfOutlined,
  GithubOutlined,
  LinkedinOutlined,
  YoutubeOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { IconButton, Space } from '@/components/ui';
import { GITHUB_URL, LINKEDIN_URL, YOUTUBE_URL } from '@/core/constants';
import styles from './Socials.module.less';

// TODO: Download Resume
const Socials = () => (
  <Space className={styles.socials} size={20}>
    <Link to={GITHUB_URL} target="_blank">
      <IconButton
        size="large"
        isText
        icon={<GithubOutlined />}
        tooltip="GitHub"
      />
    </Link>
    <Link to={LINKEDIN_URL} target="_blank">
      <IconButton
        size="large"
        isText
        icon={<LinkedinOutlined />}
        tooltip="LinkedIn"
      />
    </Link>
    <Link to={YOUTUBE_URL} target="_blank">
      <IconButton
        size="large"
        isText
        icon={<YoutubeOutlined />}
        tooltip="Youtube"
      />
    </Link>
    <Link to="/" target="_blank">
      <IconButton
        size="large"
        isText
        icon={<FilePdfOutlined />}
        tooltip="Resume"
      />
    </Link>
  </Space>
);

Socials.propTypes = {};

export default memo(Socials);
