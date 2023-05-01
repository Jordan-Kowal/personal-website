import React, { memo } from 'react';
import { Section } from '@/components/ui';
import styles from './Career.module.less';

const Career = () => (
  <Section
    className={styles.career}
    title="Career"
    subtitle="Where I crashed the production server."
    isDark
  >
    <div>TBD</div>
  </Section>
);

Career.propTypes = {};

export default memo(Career);
