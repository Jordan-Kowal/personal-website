import { Space } from "@/components/ui";
import { Typography } from "antd";
import classNames from "classnames";
import { memo } from "react";
import styles from "./Section.module.less";

const { Title } = Typography;

export type SectionProps = {
  children: React.ReactNode;
  className?: string;
  headless?: boolean;
  id?: string;
  isDark?: boolean;
  title?: string;
};

export const Section: React.FC<SectionProps> = memo(
  ({ children, className, headless, id, isDark, title }) => (
    <Space
      block
      className={classNames(styles.section, className, {
        [styles.darker]: isDark,
      })}
      id={id}
      size={20}
      vertical
    >
      {!headless && (
        <Title className={styles.title} level={1}>
          {title}
        </Title>
      )}
      <div className={styles.sectionContent}>{children}</div>
    </Space>
  ),
);
