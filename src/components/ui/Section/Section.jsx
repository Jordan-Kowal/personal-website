import React, { memo } from 'react';
import { Typography } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Space } from '@/components/ui';
import styles from './Section.module.less';

const { Text, Title } = Typography;

const Section = ({ children, className, id, isDark, subtitle, title }) => {
  const empty = !title && !subtitle;

  return (
    <Space
      block
      className={classNames(styles.section, className, {
        [styles.darker]: isDark,
      })}
      id={id}
      size={20}
      vertical
    >
      {!empty && (
        <Space block vertical size={0}>
          <Title className={styles.title} level={1}>
            {title}
          </Title>
          <Text italic className={styles.subtitle}>
            {subtitle}
          </Text>
        </Space>
      )}
      <div className={styles.sectionContent}>{children}</div>
    </Space>
  );
};

Section.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  id: PropTypes.string,
  isDark: PropTypes.bool,
  subtitle: PropTypes.string,
  title: PropTypes.string,
};

export default memo(Section);
