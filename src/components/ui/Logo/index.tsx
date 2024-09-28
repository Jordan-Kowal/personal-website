import { jkdevLogoUrl } from "@/assets";
import { Image } from "antd";
import { memo } from "react";
import { Link } from "react-router-dom";

type LogoProps = {
  height: number;
};

export const Logo: React.FC<LogoProps> = memo(({ height }) => (
  <div>
    <Link to="/">
      <Image
        className="cursor-pointer"
        preview={false}
        src={jkdevLogoUrl}
        alt="Logo"
        height={height}
        width={height}
      />
    </Link>
  </div>
));
