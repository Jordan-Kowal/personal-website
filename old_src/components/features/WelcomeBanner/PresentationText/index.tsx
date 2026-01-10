import { Typography } from "antd";
import { memo } from "react";
import { TypeAnimation } from "react-type-animation";
import { Space } from "@/components/ui";
import { theme } from "@/styles";

const { Text } = Typography;

const phrases: string[] = [
  "a fullstack developer",
  "a sports addict",
  "hyperactive",
  "a self-taught programmer",
  "owned by a cat",
  "an OpenClassrooms mentor",
  "a rock climber",
  "a former product owner",
  "fun to be around",
  "always eating",
  "a fast-learner",
  "resourceful",
  "a bike commuter",
  "a technology enthusiast",
  "a decent cook",
  "an okay-ish designer",
  "a plaid hoarder",
  "..",
];

const fontSize: string = "calc(2vw + 20px)";

const textStyle = { fontSize };
const nameStyle = { fontSize, color: theme.colors.primary };

export const typingSequence: Array<number | string> = phrases.reduce(
  (acc: Array<number | string>, phrase) => {
    acc.push(`${phrase}.`);
    acc.push(1000);
    return acc;
  },
  [],
);

export const typingStyle = {
  color: theme.colors.info,
  fontWeight: "bold",
};

export const PresentationText: React.FC = memo(() => (
  <Space className="relative z-10" block vertical>
    <Text style={textStyle}>
      Hey there, my name is{" "}
      <Text style={nameStyle} strong>
        Jordan Kowal
      </Text>
      ,
    </Text>
    <Text style={textStyle}>
      and I am{" "}
      <TypeAnimation
        cursor
        repeat={Number.POSITIVE_INFINITY}
        sequence={typingSequence}
        style={typingStyle}
        wrapper="span"
      />
    </Text>
  </Space>
));
