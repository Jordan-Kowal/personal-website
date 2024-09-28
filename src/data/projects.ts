import { type Skill, SkillDB } from "./skills";

export type Project = {
  id: number;
  name: string;
  description: string;
  githubUrl: string | undefined;
  websiteUrl: string | undefined;
  screenshots: string[];
  deprecated: boolean;
  skills: Skill[];
};

export const ProjectDB: Record<string, Project> = Object.freeze({
  JKLIB: {
    id: 1,
    name: "jklib",
    description:
      "Package with useful snippets for Django and general Python development.",
    githubUrl: "https://github.com/Jordan-Kowal/jklib",
    websiteUrl: "https://pypi.org/project/jklib/",
    screenshots: [],
    deprecated: false,
    skills: [SkillDB.PYTHON, SkillDB.DJANGO],
  },
  JKSCRIPT: {
    id: 2,
    name: "jkscript",
    description: "Personal library with ES6 JavaScript utilities.",
    githubUrl: "https://github.com/Jordan-Kowal/jkscript",
    websiteUrl: "https://www.npmjs.com/package/jcscript",
    screenshots: [],
    deprecated: false,
    skills: [SkillDB.JAVASCRIPT],
  },
  DJANGO_REACT_STARTER: {
    id: 3,
    name: "django-react-starter",
    description:
      "Django-React starter with Docker support for fast and easy web development.",
    githubUrl: "https://github.com/Jordan-Kowal/django-react-starter",
    websiteUrl: undefined,
    screenshots: [],
    deprecated: false,
    skills: [
      SkillDB.PYTHON,
      SkillDB.DJANGO,
      SkillDB.JAVASCRIPT,
      SkillDB.REACT,
      SkillDB.DOCKER,
    ],
  },
  ENSEIRB_SCHEDULE_NOTIFIER: {
    id: 4,
    name: "enseirb-schedule-notifier",
    description:
      "School schedule with improved UI and automatic notifications on schedule changes.",
    githubUrl: undefined,
    websiteUrl: undefined,
    screenshots: [
      "screenshots/enseirb-schedule-notifier-1.png",
      "screenshots/enseirb-schedule-notifier-2.png",
      "screenshots/enseirb-schedule-notifier-3.png",
    ],
    deprecated: true,
    skills: [
      SkillDB.PYTHON,
      SkillDB.DJANGO,
      SkillDB.JAVASCRIPT,
      SkillDB.REACT,
      SkillDB.DOCKER,
    ],
  },
  PERSONAL_WEBSITE: {
    id: 5,
    name: "personal-website",
    description:
      "You are viewing it right now. My personal static website made with Vite, React, and Antd.",
    githubUrl: "https://github.com/Jordan-Kowal/personal-website",
    websiteUrl: "https://jordan-kowal.github.io/personal-website/",
    screenshots: [],
    deprecated: false,
    skills: [SkillDB.JAVASCRIPT, SkillDB.REACT],
  },
  CHALLENGES: {
    id: 6,
    name: "challenges",
    description:
      "Snippets from various challenges, hackathons, and competitions.",
    githubUrl: "https://github.com/Jordan-Kowal/challenges",
    websiteUrl: undefined,
    screenshots: [],
    deprecated: false,
    skills: [SkillDB.PYTHON],
  },
  DISCORD_DICE_ROLLER: {
    id: 7,
    name: "discord-dice-roller",
    description:
      "An open-source, lightweight, and easy-to-use dice-roller bot for discord.",
    githubUrl: "https://github.com/Jordan-Kowal/discord-dice-roller",
    websiteUrl: "https://jordan-kowal.github.io/discord-dice-roller/",
    screenshots: ["screenshots/discord-dice-roller-1.png"],
    deprecated: true,
    skills: [SkillDB.PYTHON],
  },
  DJANGO_DATABASE_TRANSLATION: {
    id: 8,
    name: "django-database-translation",
    description:
      "Package for handling database translation in a website with multiple languages.",
    githubUrl: "https://github.com/Jordan-Kowal/django-database-translation",
    websiteUrl: "https://pypi.org/project/django-database-translation/",
    screenshots: [],
    deprecated: true,
    skills: [SkillDB.PYTHON, SkillDB.DJANGO],
  },
  SUDOKU_MANAGER: {
    id: 9,
    name: "sudoku-manager",
    description:
      "My first project. Sudoku solver (and generator) using brute force algorithm.",
    githubUrl: "https://github.com/Jordan-Kowal/sudoku-manager",
    websiteUrl: "https://pypi.org/project/sudoku-manager/",
    screenshots: [],
    deprecated: true,
    skills: [SkillDB.PYTHON],
  },
  WORLD_MAP: {
    id: 10,
    name: "world-map",
    description:
      "World map with locations markers of my travels and places I lived in.",
    githubUrl: undefined,
    websiteUrl: undefined,
    screenshots: ["screenshots/world-map-1.png"],
    deprecated: true,
    skills: [
      SkillDB.PYTHON,
      SkillDB.DJANGO,
      SkillDB.JAVASCRIPT,
      SkillDB.REACT,
      SkillDB.DOCKER,
    ],
  },
});
