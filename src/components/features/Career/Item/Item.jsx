import React, { memo } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { CareerItemPropType } from '@/core/proptypes';
import ItemLabel from '../ItemLabel';
import styles from './Item.module.less';

const Item = ({ careerItem, reverse }) => (
  <div className={classNames(styles.item, { [styles.reversed]: reverse })}>
    <ItemLabel careerItem={careerItem} reverse={reverse} /> test
  </div>
);

Item.propTypes = {
  careerItem: CareerItemPropType,
  reverse: PropTypes.bool,
};

export default memo(Item);
