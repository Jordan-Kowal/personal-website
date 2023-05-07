import React, { memo } from 'react';
import { Typography } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Space } from '@/components/ui';
import { CareerItemPropType } from '@/core/proptypes';
import { dateFormatter } from '@/services/dates';
import styles from './ItemLabel.module.less';

const { Text } = Typography;

const ItemLabel = ({ careerItem, reverse }) => {
  const year = dateFormatter.asYear(careerItem.startDate);
  return (
    <Space
      className={classNames(styles.itemLabel, { [styles.reversed]: reverse })}
    >
      <Text strong className={styles.year}>
        {year}
      </Text>
      <div
        className={classNames(styles.arrow, { [styles.reversed]: reverse })}
      />
    </Space>
  );
};

ItemLabel.propTypes = {
  careerItem: CareerItemPropType,
  reverse: PropTypes.bool,
};

export default memo(ItemLabel);
