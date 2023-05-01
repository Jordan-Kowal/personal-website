import React, { memo } from 'react';
import {
  FilePdfOutlined,
  GithubOutlined,
  LinkedinOutlined,
  YoutubeOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { IconButton, Space } from '@/components/ui';
import styles from './Socials.module.less';

// TODO: Download Resume
const Socials = () => (
  <Space className={styles.socials} size={20}>
    <Link to="https://github.com/Jordan-Kowal" target="_blank">
      <IconButton
        size="large"
        isText
        icon={<GithubOutlined />}
        tooltip="GitHub"
      />
    </Link>
    <Link to="https://www.linkedin.com/in/jordan-kowal/" target="_blank">
      <IconButton
        size="large"
        isText
        icon={<LinkedinOutlined />}
        tooltip="LinkedIn"
      />
    </Link>
    <Link
      to="https://www.youtube.com/channel/UC8aLJUnA2x5HgjvirPL1yTw"
      target="_blank"
    >
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
