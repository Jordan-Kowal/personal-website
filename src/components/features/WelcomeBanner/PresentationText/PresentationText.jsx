import React, { memo } from 'react';
import { Typography } from 'antd';
import { TypeAnimation } from 'react-type-animation';
import { Space } from '@/components/ui';
import { theme } from '@/styles';
import styles from './PresentationText.module.less';

const { Text } = Typography;

const phrases = [
  'a fullstack developer',
  'a sports addict',
  'hyperactive',
  'a self-taught programmer',
  'owned by a cat',
  'an OpenClassrooms mentor',
  'a rock climber',
  'a former product owner',
  'fun to be around',
  'always eating',
  'a fast-learner',
  'resourceful',
  'a bike commuter',
  'a technology enthusiast',
  'a decent cook',
  'an okay-ish designer',
  'a plaid hoarder',
  '..',
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
    <Text className={styles.text}>
      Hey there, my name is{' '}
      <Text className={styles.name} strong>
        Jordan Kowal
      </Text>
      ,
    </Text>
    <Text className={styles.text}>
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
