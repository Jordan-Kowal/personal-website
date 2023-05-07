import React, { memo } from 'react';
import { Typography } from 'antd';
import { Space } from '@/components/ui';
import { CareerItemPropType } from '@/core/proptypes';
import { dateFormatter } from '@/services/dates';
import styles from './ItemLabel.module.less';

const { Text } = Typography;

const ItemLabel = ({ careerItem }) => {
  const year = dateFormatter.asYear(careerItem.startDate);
  return (
    <Space className={styles.itemLabel}>
      <Text strong className={styles.year}>
        {year}
      </Text>
      <div className={styles.arrow} />
    </Space>
  );
};

ItemLabel.propTypes = {
  careerItem: CareerItemPropType,
};

export default memo(ItemLabel);
