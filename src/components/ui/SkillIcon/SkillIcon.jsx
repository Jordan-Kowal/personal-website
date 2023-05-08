import React, { memo } from 'react';
import { Image, Tooltip } from 'antd';
import { SkillPropType } from '@/core/proptypes';

const SkillIcon = ({ skill }) => (
  <Tooltip title={skill.name}>
    <Image src={skill.icon} alt={skill.name} preview={false} height={20} />
  </Tooltip>
);

SkillIcon.propTypes = {
  skill: SkillPropType.isRequired,
};

export default memo(SkillIcon);
