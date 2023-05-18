import React, { memo } from 'react';
import Socials from '@/components/features/Socials';
import Logo from '@/components/ui/Logo';
import Space from '@/components/ui/Space';
import PresentationText from './PresentationText';
import styles from './WelcomeBanner.module.less';

const WelcomeBanner = () => (
  <Space className={styles.welcomeBanner} block vertical size={20}>
    <video autoPlay muted loop className={styles.video}>
      <source src="videos/background-presentation.mp4" type="video/mp4" />
    </video>
    <Logo height={80} />
    <PresentationText />
    <Socials />
  </Space>
);

WelcomeBanner.propTypes = {};

export default memo(WelcomeBanner);
