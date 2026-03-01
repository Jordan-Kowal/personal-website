import { MonitorPlay } from "lucide-solid";
import type { TimelineItem } from "./types";

export const experienceData: TimelineItem[] = [
  {
    id: 1,
    title: "Software Engineer",
    entity: "Alan",
    location: "Paris, France",
    startDate: "2025-05-01",
    description:
      "Fullstack development using Python/Flask and Typescript/React/React Native.",
    category: "experience",
    logo: "/images/logo-alan.jpeg",
  },
  {
    id: 2,
    title: "Software Developer",
    entity: "Welcome to the Jungle",
    location: "Paris, France",
    startDate: "2023-10-01",
    endDate: "2025-05-01",
    description:
      "Fullstack development using Elixir/Phoenix and Typescript/React for the job board platform.",
    category: "experience",
    logo: "/images/logo-wttj.jpeg",
  },
  {
    id: 3,
    title: "Software Developer",
    entity: "FieldBox.ai",
    location: "Bordeaux, France",
    startDate: "2020-02-01",
    endDate: "2023-10-01",
    description:
      "Frontend and backend development on diverse web applications using Django and React. " +
      "(with a bit of Erlang and Scala here and there).",
    category: "experience",
    logo: "/images/logo-fieldbox.jpeg",
  },
  {
    id: 4,
    title: "Mentor",
    entity: "OpenClassrooms",
    location: "Remote",
    startDate: "2022-02-01",
    endDate: "2023-03-01",
    description: 'Mentor at OpenClassrooms for the "Python Developer" program.',
    category: "experience",
    logo: "/images/logo-openclassrooms.jpeg",
  },
  {
    id: 5,
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
    category: "experience",
    logo: "/images/logo-garantie-privee.jpeg",
  },
  {
    id: 6,
    title: "Assistant IT Project Manager",
    entity: "Garantie Privée",
    location: "Bordeaux, France",
    startDate: "2011-07-01",
    endDate: "2012-07-01",
    description:
      "Assisted the IT Project Manager with on-going projects (wire-framing, specs, tests, etc.).",
    category: "experience",
    logo: "/images/logo-garantie-privee.jpeg",
  },
];

export const educationData: TimelineItem[] = [
  {
    id: 7,
    title: "Self-training in web development",
    entity: "Online courses",
    location: "Remote",
    startDate: "2018-06-01",
    endDate: "2019-06-01",
    description:
      "About 10h/week to learn web development with HTML/CSS, Javascript/VueJS, Python/Django, and Git.",
    category: "education",
    logo: MonitorPlay,
  },
  {
    id: 8,
    title: "Master of Business Administration",
    entity: "Kedge Business School",
    location: "Bordeaux, France",
    startDate: "2009-09-01",
    endDate: "2013-06-01",
    description: "Specialization in Information Systems Management.",
    category: "education",
    logo: "/images/logo-kedge.jpeg",
  },
];
