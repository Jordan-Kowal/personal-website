import React, { memo } from 'react';
import { Section } from '@/components/ui';
import styles from './Contact.module.less';

const Contact = () => (
  <Section
    className={styles.contact}
    title="Contact"
    subtitle="Beam me up, Scotty!"
  >
    <div>TBD</div>
  </Section>
);

Contact.propTypes = {};

export default memo(Contact);
