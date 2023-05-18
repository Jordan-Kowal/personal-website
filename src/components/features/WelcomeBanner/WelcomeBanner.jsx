import React, { memo } from 'react';
import { Typography } from 'antd';
import Socials from '@/components/features/Socials';
import Logo from '@/components/ui/Logo';
import Space from '@/components/ui/Space';
import PresentationText from './PresentationText';
import styles from './WelcomeBanner.module.less';

export const { Text } = Typography;

const WelcomeBanner = () => (
  <Space className={styles.welcomeBanner} block vertical size={20}>
    <Logo height={80} />
    <PresentationText />
    <Socials />
  </Space>
);

WelcomeBanner.propTypes = {};

export default memo(WelcomeBanner);
