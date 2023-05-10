import React, { memo } from 'react';
import { Anchor } from 'antd';
import {
  Career,
  Contact,
  Projects,
  Section,
  Skills,
  Space,
  WelcomeBanner,
} from '@/components';

const sections = [
  {
    key: 'skills',
    title: 'Skills',
    subtitle: "I'm supposed to be good at these",
    component: Skills,
  },
  {
    key: 'projects',
    title: 'Projects',
    subtitle: 'For when I have too much free time',
    component: Projects,
  },
  {
    key: 'career',
    title: 'Career',
    subtitle: 'Where I crashed production servers',
    component: Career,
  },
  {
    key: 'contact',
    component: Contact,
  },
];

const anchorItems = sections.map(({ key, title }) => ({
  key,
  title,
  href: `#${key}`,
}));

const Homepage = () => (
  <Space block vertical size={0}>
    <WelcomeBanner />
    <Anchor
      direction="horizontal"
      items={anchorItems}
      offsetTop={0}
      targetOffset={30}
    />
    {sections.map(({ key, component: Component, title, subtitle }, index) => (
      <Section
        key={key}
        id={key}
        title={title}
        subtitle={subtitle}
        isDark={!(index % 2)}
      >
        <Component />
      </Section>
    ))}
  </Space>
);

Homepage.propTypes = {};

export default memo(Homepage);
