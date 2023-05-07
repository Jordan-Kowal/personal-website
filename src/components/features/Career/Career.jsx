import React, { memo } from 'react';
import { Timeline } from 'antd';
import { WorkExperienceDB } from '@/data';
import styles from './Career.module.less';
import Item from './Item';
import ItemDot from './ItemDot';
import ItemLabel from './ItemLabel';

const experiences = [
  WorkExperienceDB.OPENCLASSROOMS_MENTOR,
  WorkExperienceDB.FIELDBOX_LEAD,
  WorkExperienceDB.FIELDBOX_SOFTWARE,
  WorkExperienceDB.GARANTIE_PRIVEE_PO,
];

const Career = () => {
  const items = experiences.map((experience, index) => ({
    dot: <ItemDot careerItem={experience} />,
    children: <Item careerItem={experience} />,
    label: <ItemLabel careerItem={experience} />,
  }));

  return (
    <div className={styles.career}>
      <Timeline items={items} mode="left" />
    </div>
  );
};

Career.propTypes = {};

export default memo(Career);
