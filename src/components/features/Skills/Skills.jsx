import React, { memo } from 'react';
import { Section } from '@/components/ui';
import styles from './Skills.module.less';

const Skills = () => (
  <Section
    className={styles.skills}
    title="My Skills"
    subtitle="What I'm supposedly good at..."
    isDark
  >
    <div>Python</div>
  </Section>
);

Skills.propTypes = {};

export default memo(Skills);
