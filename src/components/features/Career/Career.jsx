import React, { memo } from 'react';
import { Col, Row, Timeline } from 'antd';
import { EducationDB, WorkExperienceDB } from '@/data';
import styles from './Career.module.less';
import Item from './Item';
import ItemDot from './ItemDot';

const experiences = [
  WorkExperienceDB.OPENCLASSROOMS_MENTOR,
  WorkExperienceDB.FIELDBOX_LEAD,
  WorkExperienceDB.FIELDBOX_SOFTWARE,
  WorkExperienceDB.GARANTIE_PRIVEE_PO,
];

const degrees = [EducationDB.SELF_TRAINING, EducationDB.MASTER];

const Career = () => {
  const workItems = experiences.map((experience) => ({
    dot: <ItemDot onGoing={!experience.endDate} />,
    children: <Item careerItem={experience} />,
    // label: <ItemLabel careerItem={experience} />,
  }));

  const educationItems = degrees.map((degree) => ({
    dot: <ItemDot onGoing={!degree.endDate} reverse />,
    children: <Item careerItem={degree} reverse />,
    // label: <ItemLabel careerItem={degree} reverse />,
  }));

  return (
    <Row className={styles.career} gutter={[20, 20]}>
      <Col xs={24} xl={12}>
        <Timeline
          items={workItems}
          mode="left"
          className={styles.workTimeline}
        />
      </Col>
      <Col xs={24} xl={12}>
        <Timeline
          items={educationItems}
          mode="right"
          className={styles.educationTimeline}
        />
      </Col>
    </Row>
  );
};

Career.propTypes = {};

export default memo(Career);
