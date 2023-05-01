import React, { memo } from 'react';
import { Typography } from 'antd';
import { TypeAnimation } from 'react-type-animation';
import { Space } from '@/components/ui';
import { theme } from '@/styles';
import styles from './PresentationText.module.less';

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

export const typingSequence = phrases.reduce((acc, phrase) => {
  acc.push(`${phrase}.`);
  acc.push(1000);
  return acc;
}, []);

export const typingStyle = {
  color: theme.colorInfo,
  fontWeight: 'bold',
};

const PresentationText = () => (
  <Space className={styles.presentationText} block vertical>
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
  </Space>
);

PresentationText.propTypes = {};

export default memo(PresentationText);
