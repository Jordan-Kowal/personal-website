import React, { memo } from 'react';
import { Section } from '@/components/ui';
import styles from './Skills.module.less';

const Skills = () => (
  <Section
    className={styles.skills}
    title="My Skills"
    subtitle="I'm supposed to be good at these"
    isDark
  >
    <div>Python</div>
  </Section>
);

Skills.propTypes = {};

export default memo(Skills);
