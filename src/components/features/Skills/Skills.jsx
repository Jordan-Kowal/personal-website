import React, { memo } from 'react';
import { Space } from '@/components/ui';
import { SkillDB } from '@/data';
import SkillCard from './SkillCard';
import styles from './Skills.module.less';

const skillList = [SkillDB.PYTHON];

const Skills = () => (
  <div className={styles.skills}>
    <Space block centered wrap size={40}>
      {skillList.map((skill) => (
        <SkillCard skill={skill} key={skill.id} />
      ))}
    </Space>
  </div>
);

Skills.propTypes = {};

export default memo(Skills);
