import { type Skill, SkillDB } from "./skills";

export type WorkExperience = {
  id: number;
  title: string;
  entity: string;
  location: string;
  startDate: string;
  endDate?: string;
  description: string;
  skills: Skill[];
};

export const WorkExperienceDB: Record<string, WorkExperience> = Object.freeze({
  OPENCLASSROOMS_MENTOR: {
    id: 1,
    title: "Mentor",
    entity: "OpenClassrooms",
    location: "Remote",
    startDate: "2022-02-01",
    endDate: "2023-03-01",
    description: 'Mentor at OpenClassrooms for the "Python Developer" program.',
    skills: [
      SkillDB.PYTHON,
      SkillDB.DJANGO,
      SkillDB.JAVASCRIPT,
      SkillDB.DOCKER,
    ],
  },
  FIELDBOX: {
    id: 3,
    title: "Software Developer",
    entity: "FieldBox.ai",
    location: "Bordeaux, France",
    startDate: "2020-02-01",
    endDate: "2023-10-01",
    description:
      "Frontend and backend development on diverse web applications using Django and React. " +
      "(with a bit of Erlang and Scala here and there).",
    skills: [
      SkillDB.PYTHON,
      SkillDB.DJANGO,
      SkillDB.JAVASCRIPT,
      SkillDB.REACT,
      SkillDB.ERLANG,
      SkillDB.SCALA,
      SkillDB.POSTGRESQL,
      SkillDB.DOCKER,
    ],
  },
  GARANTIE_PRIVEE_PO: {
    id: 4,
    title: "IT Project Manager",
    entity: "Garantie Privée",
    location: "Bordeaux, France",
    startDate: "2013-01-01",
    endDate: "2019-06-30",
    description:
      "In charge of software and application developments such as: " +
      "insurance subscription platform, " +
      "fully customized e-commerce websites, " +
      "and point-of-sales software.",
    skills: [SkillDB.POSTGRESQL, SkillDB.JAVASCRIPT],
  },
  GARANTIE_PRIVEE_INTERNSHIP: {
    id: 5,
    title: "Assistant IT Project Manager",
    entity: "Garantie Privée",
    location: "Bordeaux, France",
    startDate: "2011-07-01",
    endDate: "2012-07-01",
    description:
      "Assisted the IT Project Manager with on-going projects (wire-framing, specs, tests, etc.).",
    skills: [],
  },
  WTTJ: {
    id: 6,
    title: "Software Developer",
    entity: "Welcome to the Jungle",
    location: "Paris, France",
    startDate: "2023-10-01",
    endDate: "2025-05-01",
    description:
      "Fullstack development using Elixir/Phoenix and Typescript/React for the job board platform.",
    skills: [
      SkillDB.ELIXIR,
      SkillDB.PHOENIX,
      SkillDB.TYPESCRIPT,
      SkillDB.REACT,
      SkillDB.POSTGRESQL,
      SkillDB.DOCKER,
    ],
  },
  ALAN: {
    id: 7,
    title: "Software Engineer",
    entity: "Alan",
    location: "Paris, France",
    startDate: "2025-05-01",
    endDate: undefined,
    description:
      "Fullstack development using Python/Flask and Typescript/React/React Native.",
    skills: [
      SkillDB.PYTHON,
      SkillDB.FLASK,
      SkillDB.TYPESCRIPT,
      SkillDB.REACT,
      SkillDB.POSTGRESQL,
    ],
  },
});

export type Education = {
  id: number;
  title: string;
  entity: string;
  location: string;
  startDate: string;
  endDate?: string;
  description: string;
  skills: Skill[];
};

export const EducationDB: Record<string, Education> = Object.freeze({
  SELF_TRAINING: {
    id: 1,
    title: "Self-training in web development",
    entity: "Online courses",
    location: "Remote",
    startDate: "2018-06-01",
    endDate: "2019-06-01",
    description:
      "About 10h/week to learn web development with HTML/CSS, Javascript/VueJS, Python/Django, and Git.",
    skills: [
      SkillDB.PYTHON,
      SkillDB.DJANGO,
      SkillDB.JAVASCRIPT,
      SkillDB.VUEJS,
      SkillDB.HTML5,
      SkillDB.CSS3,
      SkillDB.POSTGRESQL,
    ],
  },
  MASTER: {
    id: 2,
    title: "Master of Business Administration",
    entity: "Kedge Business School",
    location: "Bordeaux, France",
    startDate: "2019-01-01",
    endDate: "2023-01-01",
    description: "Specialization in Information Systems Management.",
    skills: [],
  },
});
