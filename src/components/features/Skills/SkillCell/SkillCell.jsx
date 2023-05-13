import React from 'react';
import { Card, Tooltip } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { SkillPropType } from '@/core/proptypes';
import styles from './SkillCell.module.less';

const DELTA = 5;

const SkillCell = ({ isActive, skill, size, top, left }) => (
  <Tooltip title={skill.name} placement="top">
    <Card
      className={classNames(styles.skillCell, { [styles.inactive]: !isActive })}
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
    </Card>
  </Tooltip>
);

SkillCell.propTypes = {
  isActive: PropTypes.bool,
  skill: SkillPropType,
  size: PropTypes.number,
  top: PropTypes.number,
  left: PropTypes.number,
};

export default SkillCell;
