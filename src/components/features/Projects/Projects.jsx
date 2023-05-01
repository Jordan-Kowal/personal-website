import React, { memo } from 'react';
import { Section } from '@/components/ui';
import styles from './Projects.module.less';

const Projects = () => (
  <Section
    className={styles.projects}
    title="Projects"
    subtitle="Look mom, I made these!"
  >
    <div>TBD</div>
  </Section>
);

Projects.propTypes = {};

export default memo(Projects);
