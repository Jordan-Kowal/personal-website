import type { TimelineItem } from "./types";

export const educationData: TimelineItem[] = [
  {
    id: 1,
    title: "Master en Informatique",
    entity: "ENSEIRB-MATMECA",
    location: "Bordeaux, France",
    startDate: "2010-09-01",
    endDate: "2013-06-30",
    description:
      "Formation d'ingénieur en informatique avec spécialisation en développement logiciel et systèmes distribués.",
    technologies: ["Java", "C++", "Python", "PostgreSQL"],
  },
  {
    id: 2,
    title: "Formation Autodidacte",
    entity: "Diverses plateformes",
    location: "En ligne",
    startDate: "2015-01-01",
    description:
      "Formation continue en développement web moderne, frameworks JavaScript, et architectures cloud.",
    technologies: ["React", "Node.js", "TypeScript", "Docker", "AWS"],
  },
  {
    id: 3,
    title: "Baccalauréat Scientifique",
    entity: "Lycée",
    location: "France",
    startDate: "2007-09-01",
    endDate: "2010-06-30",
    description: "Baccalauréat scientifique option mathématiques.",
  },
];

export const experienceData: TimelineItem[] = [
  {
    id: 1,
    title: "Software Developer",
    entity: "Alan",
    location: "Paris, France",
    startDate: "2023-10-01",
    description:
      "Développement de fonctionnalités backend et frontend pour la plateforme d'assurance santé. " +
      "Travail sur l'architecture microservices et l'amélioration de l'expérience utilisateur.",
    technologies: ["Python", "Django", "React", "TypeScript", "PostgreSQL"],
  },
  {
    id: 2,
    title: "Mentor",
    entity: "OpenClassrooms",
    location: "Remote",
    startDate: "2022-02-01",
    endDate: "2023-03-01",
    description:
      "Mentorat d'étudiants dans le programme 'Développeur Python'. " +
      "Accompagnement dans l'apprentissage du développement web et des bonnes pratiques.",
    technologies: ["Python", "Django", "JavaScript", "Docker"],
  },
  {
    id: 3,
    title: "Software Developer",
    entity: "FieldBox.ai",
    location: "Bordeaux, France",
    startDate: "2020-02-01",
    endDate: "2023-10-01",
    description:
      "Développement frontend et backend sur diverses applications web utilisant Django et React. " +
      "Travail occasionnel sur des projets en Erlang et Scala.",
    technologies: [
      "Python",
      "Django",
      "JavaScript",
      "React",
      "Erlang",
      "Scala",
      "PostgreSQL",
      "Docker",
    ],
  },
];
