import React, { memo, useEffect, useRef, useState } from 'react';
import { useDebounce, useWindowSize } from 'react-use';
import { SkillDB } from '@/data';
import SkillCell from './SkillCell';
import styles from './Skills.module.less';

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

const SKILL_SIZE = 50;
const SKILL_GAP = 5;

const Skills = () => {
  const [container, setContainer] = useState(null);
  const [boundingRect, setBoundingRect] = useState(null);
  const [skillCoordinates, setSkillCoordinates] = useState([]);
  const [containerHeight, setContainerHeight] = useState(100);

  const containerRef = useRef(null);

  const { width: windowWidth } = useWindowSize();

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
      return { top: y * totalSize, left: x * totalSize };
    });
    setSkillCoordinates(coordinates);
    setContainerHeight(rowCount * totalSize);
  }, [container, boundingRect]);

  return (
    <div className={styles.skills}>
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
            />
          ))}
      </div>
    </div>
  );
};

Skills.propTypes = {};

export default memo(Skills);
