import { Anchor } from "antd";
import { memo } from "react";
import {
  Career,
  Contact,
  Projects,
  Skills,
  WelcomeBanner,
} from "@/components/features";
import { Section, Space } from "@/components/ui";

type PageSection = {
  key: string;
  title: string;
  component: React.FC;
  headless?: boolean;
};

const pageSections: PageSection[] = [
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

type AnchorItem = {
  key: string;
  title: string;
  href: string;
};

const anchorItems: AnchorItem[] = pageSections.map(({ key, title }) => ({
  key,
  title,
  href: `#${key}`,
}));

const Homepage: React.FC = memo(() => (
  <Space block vertical size={0}>
    <WelcomeBanner />
    <Anchor
      direction="horizontal"
      items={anchorItems}
      offsetTop={0}
      targetOffset={30}
    />
    {pageSections.map(
      ({ key, component: Component, title, headless }, index) => (
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
));

export default Homepage;
