import { jkdevLogoUrl } from "@/assets";
import { Image } from "antd";
import classNames from "classnames";
import PropTypes from "prop-types";
import React, { memo } from "react";
import { Link } from "react-router-dom";
import styles from "./Logo.module.less";

const Logo = ({ elevated, height }) => (
  <div className={classNames(styles.logo, { [styles.elevated]: elevated })}>
    <Link to="/">
      <Image
        className={styles.logoImage}
        preview={false}
        src={jkdevLogoUrl}
        alt="Logo"
        height={height}
        width={height}
      />
    </Link>
  </div>
);

Logo.propTypes = {
  elevated: PropTypes.bool,
  height: PropTypes.number,
};

export default memo(Logo);
