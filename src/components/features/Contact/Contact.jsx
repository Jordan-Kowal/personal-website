import React, { memo } from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { LINKEDIN_URL } from '@/core/constants';
import styles from './Contact.module.less';

const Contact = () => (
  <div className={styles.contact}>
    <div className={styles.line} />
    <Link to={LINKEDIN_URL} target="_blank">
      <Button className={styles.contactButton} type="primary">
        Get in touch
      </Button>
    </Link>
  </div>
);

Contact.propTypes = {};

export default memo(Contact);
