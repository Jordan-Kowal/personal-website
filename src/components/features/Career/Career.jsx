import React, { memo, useCallback } from 'react';
import { Col, Grid, Radio, Row, Timeline, Typography } from 'antd';
import classNames from 'classnames';
import { Space } from '@/components/ui';
import { EducationDB, WorkExperienceDB } from '@/data';
import { dateFormatter } from '@/services/dates';
import styles from './Career.module.less';
import Item from './Item';
import ItemDot from './ItemDot';

const { Text } = Typography;
const { useBreakpoint } = Grid;

const experiences = [
  WorkExperienceDB.WTTJ_BACKEND_DEVELOPER,
  WorkExperienceDB.FIELDBOX_LEAD,
  WorkExperienceDB.OPENCLASSROOMS_MENTOR,
  WorkExperienceDB.FIELDBOX_SOFTWARE,
  WorkExperienceDB.GARANTIE_PRIVEE_PO,
  WorkExperienceDB.GARANTIE_PRIVEE_INTERNSHIP,
];

const degrees = [EducationDB.SELF_TRAINING, EducationDB.MASTER];

const options = [
  { label: 'Work Experiences', value: 'work' },
  { label: 'Education', value: 'education' },
];

const Career = () => {
  const [activeTab, setActiveTab] = React.useState('work');
  const { md, xs } = useBreakpoint();

  const items = activeTab === 'work' ? experiences : degrees;
  const mode = md ? 'alternate' : 'left';

  const onTabChange = useCallback((e) => {
    setActiveTab(e.target.value);
  }, []);

  const timelineItems = items.map((experience) => ({
    dot: <ItemDot onGoing={!experience.endDate} />,
    children: <Item careerItem={experience} />,
    label: (
      <Space className={styles.itemLabel}>
        <Text strong className={styles.year}>
          {dateFormatter.asYear(experience.startDate)}
        </Text>
        <div className={styles.arrow} />
      </Space>
    ),
  }));

  return (
    <Space
      className={classNames(styles.career, {
        [styles.small]: !md,
        [styles.xs]: xs,
      })}
      block
      vertical
      size={40}
    >
      <Radio.Group
        options={options}
        onChange={onTabChange}
        value={activeTab}
        optionType="button"
        buttonStyle="solid"
      />
      <Row gutter={[20, 20]}>
        <Col xs={24}>
          <Timeline items={timelineItems} mode={mode} />
        </Col>
      </Row>
    </Space>
  );
};

Career.propTypes = {};

export default memo(Career);
