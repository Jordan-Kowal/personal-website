import {
  Career,
  Contact,
  Projects,
  Section,
  Skills,
  Space,
  WelcomeBanner,
} from "@/components";
import { Anchor } from "antd";
import React, { memo } from "react";

const sections = [
  {
    key: "skills",
    title: "Skills",
    component: Skills,
  },
  {
    key: "projects",
    title: "Projects",
    component: Projects,
  },
  {
    key: "career",
    title: "Career",
    component: Career,
  },
  {
    key: "contact",
    title: "Contact",
    component: Contact,
    headless: true,
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
    {sections.map(
      ({ key, component: Component, title, subtitle, headless }, index) => (
        <Section
          key={key}
          id={key}
          title={title}
          isDark={!(index % 2)}
          headless={headless}
        >
          <Component />
        </Section>
      ),
    )}
  </Space>
);

Homepage.propTypes = {};

export default memo(Homepage);
