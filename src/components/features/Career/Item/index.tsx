import { SkillIcon, Space } from "@/components/ui";
import { getExperienceDuration } from "@/core/career";
import type { Education, WorkExperience } from "@/data/career";
import {
  ClockCircleOutlined,
  HomeOutlined,
  PushpinOutlined,
} from "@ant-design/icons";
import { Card, Typography } from "antd";
import classNames from "classnames";
import { memo } from "react";
import styles from "./Item.module.less";

const { Text } = Typography;

type ItemProps = {
  careerItem: WorkExperience | Education;
};

export const Item: React.FC<ItemProps> = memo(({ careerItem }) => {
  const isActive = careerItem.endDate === null;

  return (
    <Card className={classNames(styles.item, { [styles.active]: isActive })}>
      <Space vertical size={4}>
        <Text className={styles.title} strong>
          {careerItem.title}
        </Text>
        <Space>
          <HomeOutlined />
          <Text>{careerItem.entity}</Text>
        </Space>
        <Space>
          <PushpinOutlined />
          <Text>{careerItem.location}</Text>
        </Space>
        <Space>
          <ClockCircleOutlined />
          <Text>{getExperienceDuration(careerItem)}</Text>
        </Space>
        <Text type="secondary" italic>
          {careerItem.description}
        </Text>
        <Space wrap>
          {careerItem.skills.map((skill) => (
            <SkillIcon skill={skill} key={skill.id} />
          ))}
        </Space>
      </Space>
    </Card>
  );
});