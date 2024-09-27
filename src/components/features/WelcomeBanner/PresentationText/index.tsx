import { Space } from "@/components/ui";
import { theme } from "@/styles";
import { Typography } from "antd";
import { memo } from "react";
import { TypeAnimation } from "react-type-animation";
import styles from "./PresentationText.module.less";

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
  <Space className={styles.presentationText} block vertical>
    <Text className={styles.text}>
      Hey there, my name is{" "}
      <Text className={styles.name} strong>
        Jordan Kowal
      </Text>
      ,
    </Text>
    <Text className={styles.text}>
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
