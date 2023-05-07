import React, { memo } from 'react';
import { CareerItemPropType } from '@/core/proptypes';

const ItemDot = ({ careerItem }) => <div />;

ItemDot.propTypes = {
  careerItem: CareerItemPropType,
};

export default memo(ItemDot);
