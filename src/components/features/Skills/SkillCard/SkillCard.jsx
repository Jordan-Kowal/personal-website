import React from 'react';
import { Image, Tooltip } from 'antd';
import { SkillPropType } from '@/core/proptypes';

const SkillCard = ({ skill }) => (
  <Tooltip title={skill.name}>
    <Image src={skill.icon} preview={false} height={50} />
  </Tooltip>
);

SkillCard.propTypes = {
  skill: SkillPropType,
};

export default SkillCard;
