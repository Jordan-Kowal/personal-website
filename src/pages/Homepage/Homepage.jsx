import React, { memo } from 'react';
import {
  Career,
  Contact,
  Projects,
  Skills,
  Space,
  WelcomeBanner,
} from '@/components';

const Homepage = () => (
  <Space block vertical size={0}>
    <WelcomeBanner />
    <Skills />
    <Projects />
    <Career />
    <Contact />
  </Space>
);

Homepage.propTypes = {};

export default memo(Homepage);
