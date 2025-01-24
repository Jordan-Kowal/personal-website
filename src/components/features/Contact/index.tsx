import { LINKEDIN_URL } from "@/core/constants";
import { theme } from "@/styles";
import { Button } from "antd";
import { memo } from "react";
import { Link } from "react-router-dom";

const contactStyle = {
  height: `calc(${theme.layout.mainHeight} - ${theme.layout.layoutPadding})`,
};

const lineStyle = {
  height: `calc(${theme.layout.mainHeight} / 2 - 104px - ${theme.layout.layoutPadding} * 1.5 )`,
};

export const Contact: React.FC = memo(() => (
  <div
    className="relative flex items-center justify-center"
    style={contactStyle}
  >
    <div className="absolute top-0 w-1 bg-bg-light" style={lineStyle} />
    <Link to={LINKEDIN_URL} target="_blank">
      <div className="w-52 h-52 relative">
        <div className="absolute w-32 h-32 left-10 top-10 rounded-full bg-primary animate-ping z-0" />
        <Button
          className="!w-52 !h-52 !rounded-full shadow-none shadow-primary !text-xl !font-bold"
          type="primary"
        >
          <div className="z-10">Get in touch</div>
        </Button>
      </div>
    </Link>
  </div>
));
