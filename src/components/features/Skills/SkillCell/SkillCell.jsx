import React from 'react';
import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import { SkillPropType } from '@/core/proptypes';
import styles from './SkillCell.module.less';

const DELTA = 3;

const SkillCell = ({ skill, size, top, left }) => (
  <Tooltip title={skill.name} placement="top">
    <div
      className={styles.skillCell}
      style={{
        top: `${top}px`,
        left: `${left}px`,
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <div
        className={styles.icon}
        style={{
          top: `${DELTA}px`,
          left: `${DELTA}px`,
          width: `${size - DELTA * 2}px`,
          height: `${size - DELTA * 2}px`,
          backgroundImage: `url(${skill.icon})`,
        }}
      />
    </div>
  </Tooltip>
);

SkillCell.propTypes = {
  skill: SkillPropType,
  size: PropTypes.number,
  top: PropTypes.number,
  left: PropTypes.number,
};

export default SkillCell;
