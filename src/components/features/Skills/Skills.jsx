import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Col, Radio, Row } from 'antd';
import { useDebounce, useWindowSize } from 'react-use';
import { skillFilter } from '@/core/skills';
import { SkillDB } from '@/data';
import SkillCell from './SkillCell';
import styles from './Skills.module.less';

const SKILL_SIZE = 80;
const SKILL_GAP = 15;

const options = [
  { label: 'All', value: 'all' },
  { label: 'Core', value: 'core' },
  { label: 'Backend', value: 'backend' },
  { label: 'Frontend', value: 'frontend' },
  { label: 'Other', value: 'other' },
];

const skillList = [
  SkillDB.PYTHON,
  SkillDB.DJANGO,
  SkillDB.ERLANG,
  SkillDB.SCALA,
  SkillDB.JAVASCRIPT,
  SkillDB.REACT,
  SkillDB.VUEJS,
  SkillDB.VITE,
  SkillDB.HTML5,
  SkillDB.CSS3,
  SkillDB.GIT,
  SkillDB.POSTGRESQL,
  SkillDB.REDIS,
  SkillDB.DOCKER,
  SkillDB.FIGMA,
  SkillDB.AFFINITY_DESIGNER,
  SkillDB.DAVINCI_RESOLVE,
  SkillDB.GODOT,
];

const Skills = () => {
  const [container, setContainer] = useState(null);
  const [boundingRect, setBoundingRect] = useState(null);
  const [skillCoordinates, setSkillCoordinates] = useState([]);
  const [containerHeight, setContainerHeight] = useState(100);
  const [isActiveList, setIsActiveList] = useState(skillList.map(() => true));

  const containerRef = useRef(null);
  const { width: windowWidth } = useWindowSize();

  const onFilterChange = useCallback((e) => {
    const { value } = e.target;
    if (value === 'all') {
      setIsActiveList(skillList.map(() => true));
    } else if (value === 'core') {
      setIsActiveList(skillList.map(skillFilter.isCore));
    } else if (value === 'backend') {
      setIsActiveList(skillList.map(skillFilter.isBackend));
    } else if (value === 'frontend') {
      setIsActiveList(skillList.map(skillFilter.isFrontend));
    } else if (value === 'other') {
      setIsActiveList(skillList.map(skillFilter.isOther));
    } else {
      setIsActiveList(skillList.map(() => false));
    }
  }, []);

  useEffect(() => {
    setContainer(containerRef.current);
  }, [containerRef.current]); // eslint-disable-line react-hooks/exhaustive-deps

  useDebounce(
    () => {
      setBoundingRect(container?.getBoundingClientRect());
    },
    50,
    [windowWidth, container]
  );

  useEffect(() => {
    if (!container || !boundingRect) return;
    const { width } = boundingRect;
    const itemPerRow = Math.floor(width / SKILL_SIZE) - 1;
    const rowCount = Math.ceil(skillList.length / itemPerRow);
    const totalSize = SKILL_SIZE + SKILL_GAP;
    const coordinates = skillList.map((skill, index) => {
      const x = index % itemPerRow;
      const y = Math.floor(index / itemPerRow);
      return { top: y * totalSize, left: totalSize * 0.2 + x * totalSize };
    });
    setSkillCoordinates(coordinates);
    setContainerHeight(rowCount * totalSize);
  }, [container, boundingRect]);

  return (
    <Row className={styles.skills} gutter={[20, 20]}>
      <Col span={24} className={styles.col}>
        <Radio.Group
          options={options}
          onChange={onFilterChange}
          optionType="button"
          buttonStyle="solid"
          defaultValue={options[0].value}
        />
      </Col>
      <Col span={24} className={styles.col}>
        <div
          className={styles.container}
          ref={containerRef}
          style={{ height: containerHeight }}
        >
          {boundingRect &&
            skillCoordinates.length &&
            skillList.map((skill, index) => (
              <SkillCell
                top={skillCoordinates[index].top}
                left={skillCoordinates[index].left}
                size={SKILL_SIZE}
                skill={skill}
                key={skill.id}
                isActive={isActiveList[index]}
              />
            ))}
        </div>
      </Col>
    </Row>
  );
};

Skills.propTypes = {};

export default memo(Skills);
