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

const { Text } = Typography;

type ItemProps = {
  careerItem: WorkExperience | Education;
};

export const Item: React.FC<ItemProps> = memo(({ careerItem }) => {
  const isActive = careerItem.endDate === undefined;

  return (
    <Card className="w-full" classNames={{ body: "py-2 px-5 bg-bg-darker" }}>
      <Space vertical size={4}>
        <Text
          className={classNames("text-lg", {
            "text-info": isActive,
            "text-primary": !isActive,
          })}
          strong
        >
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
