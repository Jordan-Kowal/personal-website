import { Space } from "@/components/ui";
import { Typography } from "antd";
import classNames from "classnames";
import PropTypes from "prop-types";
import React, { memo } from "react";
import styles from "./Section.module.less";

const { Title } = Typography;

const Section = ({ children, className, headless, id, isDark, title }) => (
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
);

Section.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  headless: PropTypes.bool,
  id: PropTypes.string,
  isDark: PropTypes.bool,
  title: PropTypes.string,
};

export default memo(Section);
