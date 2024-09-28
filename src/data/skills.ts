export type Skill = {
  id: number;
  name: string;
  icon: string;
  isCore: boolean;
  isBackend: boolean;
  isFrontend: boolean;
  isOther: boolean;
};

export const SkillDB: Record<string, Skill> = Object.freeze({
  AFFINITY_DESIGNER: {
    id: 1,
    name: "Affinity Designer",
    icon: "icons/affinity-designer.png",
    isCore: false,
    isBackend: false,
    isFrontend: false,
    isOther: true,
  },
  CSS3: {
    id: 2,
    name: "CSS3",
    icon: "icons/css3.png",
    isCore: false,
    isBackend: false,
    isFrontend: true,
    isOther: false,
  },
  DAVINCI_RESOLVE: {
    id: 3,
    name: "DaVinci Resolve",
    icon: "icons/davinci-resolve.png",
    isCore: false,
    isBackend: false,
    isFrontend: false,
    isOther: true,
  },
  DJANGO: {
    id: 5,
    name: "Django",
    icon: "icons/django.png",
    isCore: true,
    isBackend: true,
    isFrontend: false,
    isOther: false,
  },
  DOCKER: {
    id: 6,
    name: "Docker",
    icon: "icons/docker.png",
    isCore: true,
    isBackend: true,
    isFrontend: false,
    isOther: false,
  },
  ERLANG: {
    id: 7,
    name: "Erlang",
    icon: "icons/erlang.png",
    isCore: false,
    isBackend: true,
    isFrontend: false,
    isOther: false,
  },
  FIGMA: {
    id: 8,
    name: "Figma",
    icon: "icons/figma.png",
    isCore: false,
    isBackend: false,
    isFrontend: true,
    isOther: false,
  },
  GIT: {
    id: 9,
    name: "Git",
    icon: "icons/git.png",
    isCore: true,
    isBackend: true,
    isFrontend: true,
    isOther: false,
  },
  HTML5: {
    id: 11,
    name: "HTML5",
    icon: "icons/html5.png",
    isCore: false,
    isBackend: false,
    isFrontend: true,
    isOther: false,
  },
  JAVASCRIPT: {
    id: 12,
    name: "JavaScript",
    icon: "icons/javascript.png",
    isCore: false,
    isBackend: false,
    isFrontend: true,
    isOther: false,
  },
  TYPESCRIPT: {
    id: 13,
    name: "JavaScript",
    icon: "icons/typescript.png",
    isCore: true,
    isBackend: false,
    isFrontend: true,
    isOther: false,
  },
  POSTGRESQL: {
    id: 14,
    name: "PostgreSQL",
    icon: "icons/postgresql.png",
    isCore: true,
    isBackend: true,
    isFrontend: false,
    isOther: false,
  },
  PYTHON: {
    id: 15,
    name: "Python",
    icon: "icons/python.png",
    isCore: true,
    isBackend: true,
    isFrontend: false,
    isOther: false,
  },
  REACT: {
    id: 16,
    name: "React",
    icon: "icons/react.png",
    isCore: true,
    isBackend: false,
    isFrontend: true,
    isOther: false,
  },
  REDIS: {
    id: 17,
    name: "Redis",
    icon: "icons/redis.png",
    isCore: false,
    isBackend: true,
    isFrontend: false,
    isOther: false,
  },
  SCALA: {
    id: 18,
    name: "Scala",
    icon: "icons/scala.png",
    isCore: false,
    isBackend: true,
    isFrontend: false,
    isOther: false,
  },
  VITE: {
    id: 19,
    name: "Vite",
    icon: "icons/vite.png",
    isCore: true,
    isBackend: false,
    isFrontend: true,
    isOther: false,
  },
  VUEJS: {
    id: 20,
    name: "Vue.js",
    icon: "icons/vuejs.png",
    isCore: false,
    isBackend: false,
    isFrontend: true,
    isOther: false,
  },
  ELIXIR: {
    id: 21,
    name: "Elixir",
    icon: "icons/elixir.png",
    isCore: true,
    isBackend: true,
    isFrontend: false,
    isOther: false,
  },
});
