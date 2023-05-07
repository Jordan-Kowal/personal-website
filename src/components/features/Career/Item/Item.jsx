import React, { memo } from 'react';
import { CareerItemPropType } from '@/core/proptypes';

const Item = ({ careerItem }) => <div>test</div>;

Item.propTypes = {
  careerItem: CareerItemPropType,
};

export default memo(Item);
