import { Space } from "@/components/ui";
import { Typography } from "antd";
import classNames from "classnames";
import { memo } from "react";

const { Title } = Typography;

const titleStyle = {
  fontSize: "calc(2vw + 16px)",
};

export type SectionProps = {
  children: React.ReactNode;
  className?: string;
  headless?: boolean;
  id?: string;
  isDark?: boolean;
  title?: string;
};

export const Section: React.FC<SectionProps> = memo(
  ({ children, className, headless, id, isDark, title }) => (
    <Space
      block
      className={classNames("w-full text-center my-0 py-default", className, {
        "bg-bg-dark": isDark,
      })}
      id={id}
      size={20}
      vertical
    >
      {!headless && (
        <Title className="m-0" level={1} style={titleStyle}>
          {title}
        </Title>
      )}
      <div className="px-default w-full max-w-layout mx-auto">{children}</div>
    </Space>
  ),
);
