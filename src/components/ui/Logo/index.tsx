import { jkdevLogoUrl } from "@/assets";
import { Image } from "antd";
import classNames from "classnames";
import { memo } from "react";
import { Link } from "react-router-dom";
import styles from "./Logo.module.less";

type LogoProps = {
  elevated?: boolean;
  height: number;
};

export const Logo: React.FC<LogoProps> = memo(({ elevated, height }) => (
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
));
