import { LINKEDIN_URL } from "@/core/constants";
import { Button } from "antd";
import { memo } from "react";
import { Link } from "react-router-dom";
import styles from "./Contact.module.less";

export const Contact: React.FC = memo(() => (
  <div className={styles.contact}>
    <div className={styles.line} />
    <Link to={LINKEDIN_URL} target="_blank">
      <Button className={styles.contactButton} type="primary">
        Get in touch
      </Button>
    </Link>
  </div>
));
