import Socials from "@/components/features/Socials";
import Logo from "@/components/ui/Logo";
import Space from "@/components/ui/Space";
import React, { memo } from "react";
import PresentationText from "./PresentationText";
import styles from "./WelcomeBanner.module.less";

const WelcomeBanner = () => (
  <div className={styles.welcomeBanner}>
    <video autoPlay muted loop className={styles.video}>
      <source src="videos/background-presentation.mp4" type="video/mp4" />
    </video>
    <Space className={styles.content} block vertical size={20}>
      <Logo height={80} />
      <PresentationText />
      <Socials />
    </Space>
  </div>
);

WelcomeBanner.propTypes = {};

export default memo(WelcomeBanner);
