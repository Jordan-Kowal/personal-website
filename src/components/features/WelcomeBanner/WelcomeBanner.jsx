import React from 'react';
import {
  FilePdfOutlined,
  GithubOutlined,
  LinkedinOutlined,
  YoutubeOutlined,
} from '@ant-design/icons';
import { Typography } from 'antd';
import { Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import IconButton from '@/components/ui/IconButton';
import Logo from '@/components/ui/Logo';
import Space from '@/components/ui/Space';
import { theme } from '@/styles';
import styles from './WelcomeBanner.module.less';

const { Text } = Typography;

// TODO: Update phrase list
const phrases = [
  'full stack developer',
  'software engineer',
  'self-taught programmer',
  'former product owner',
  'OpenClassrooms mentor',
  'fast-learner',
  'rock-climber',
  'pretty decent cook',
  'cat owner',
];

const typingSequence = phrases.reduce((acc, phrase) => {
  acc.push(`${phrase}.`);
  acc.push(1000);
  return acc;
}, []);

const typingStyle = {
  color: theme.colorInfo,
  fontWeight: 'bold',
};

const WelcomeBanner = () => (
  <Space className={styles.welcomeBanner} block vertical>
    <Logo height={40} />
    <Space block vertical>
      <Text>
        Hi, my name is a{' '}
        <Text className={styles.name} strong>
          Jordan Kowal
        </Text>
        ,
      </Text>
      <Text>
        and I am{' '}
        <TypeAnimation
          cursor
          repeat={Infinity}
          sequence={typingSequence}
          style={typingStyle}
          wrapper="span"
        />
      </Text>
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
    </Space>
  </Space>
);

WelcomeBanner.propTypes = {};

export default WelcomeBanner;
