import React, { memo } from 'react';
import { Space, WelcomeBanner } from '@/components';

const Homepage = () => (
  <Space block vertical size={20}>
    <WelcomeBanner />
  </Space>
);

Homepage.propTypes = {};

export default memo(Homepage);
