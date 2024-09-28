import { SkillIcon, Space } from "@/components/ui";
import { skillFilter } from "@/core/skills";
import { SkillDB } from "@/data";
import type { Skill } from "@/data/skills";
import { Col, Radio, type RadioChangeEvent, Row } from "antd";
import classNames from "classnames";
import { memo, useCallback, useState } from "react";

type Option = {
  label: string;
  value: string;
};

const options: Option[] = [
  { label: "All", value: "all" },
  { label: "Core", value: "core" },
  { label: "Backend", value: "backend" },
  { label: "Frontend", value: "frontend" },
  { label: "Other", value: "other" },
];

const skillList: Skill[] = [
  SkillDB.PYTHON,
  SkillDB.DJANGO,
  SkillDB.ERLANG,
  SkillDB.ELIXIR,
  SkillDB.PHOENIX,
  SkillDB.SCALA,
  SkillDB.JAVASCRIPT,
  SkillDB.TYPESCRIPT,
  SkillDB.REACT,
  SkillDB.VUEJS,
  SkillDB.VITE,
  SkillDB.HTML5,
  SkillDB.CSS3,
  SkillDB.GIT,
  SkillDB.POSTGRESQL,
  SkillDB.DOCKER,
  SkillDB.FIGMA,
  SkillDB.AFFINITY_DESIGNER,
  SkillDB.DAVINCI_RESOLVE,
];

export const Skills: React.FC = memo(() => {
  const [isActiveList, setIsActiveList] = useState<boolean[]>(
    skillList.map(() => true),
  );

  const onFilterChange = useCallback((e: RadioChangeEvent) => {
    const { value } = e.target;
    if (value === "all") {
      setIsActiveList(skillList.map(() => true));
    } else if (value === "core") {
      setIsActiveList(skillList.map(skillFilter.isCore));
    } else if (value === "backend") {
      setIsActiveList(skillList.map(skillFilter.isBackend));
    } else if (value === "frontend") {
      setIsActiveList(skillList.map(skillFilter.isFrontend));
    } else if (value === "other") {
      setIsActiveList(skillList.map(skillFilter.isOther));
    } else {
      setIsActiveList(skillList.map(() => false));
    }
  }, []);

  return (
    <Row className="flex justify-center" gutter={[20, 20]}>
      <Col span={24} className="flex justify-center">
        <Radio.Group
          options={options}
          onChange={onFilterChange}
          optionType="button"
          buttonStyle="solid"
          defaultValue={options[0].value}
        />
      </Col>
      <Col span={24} className="flex justify-center">
        <Space
          className="relative w-full max-w-xl justify-center mb-5"
          block
          size={20}
          wrap
        >
          {skillList.map((skill, index) => (
            <SkillIcon
              size={80}
              skill={skill}
              key={skill.id}
              className={classNames({
                "grayscale opacity-50": !isActiveList[index],
              })}
            />
          ))}
        </Space>
      </Col>
    </Row>
  );
});
