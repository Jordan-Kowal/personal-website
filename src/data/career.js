import SkillDB from './skills';

export const WorkExperienceDB = Object.freeze({
  OPENCLASSROOMS_MENTOR: {
    id: 1,
    title: 'Mentor',
    entity: 'OpenClassrooms',
    location: 'Remote',
    startDate: '2022-02-01',
    endDate: null,
    description:
      'Mentor at OpenClassrooms for the "Python Developer" program. ' +
      'Weekly meets and one-on-one with students to help them go through their training.',
    skills: [
      SkillDB.PYTHON,
      SkillDB.DJANGO,
      SkillDB.JAVASCRIPT,
      SkillDB.GIT,
      SkillDB.DOCKER,
    ],
  },
  FIELDBOX_LEAD: {
    id: 2,
    title: 'Lead Software Developer',
    entity: 'FieldBox.ai',
    location: 'Bordeaux, France',
    startDate: '2022-02-01',
    endDate: null,
    description:
      'Same as before except I crash the production server less frequently.',
    skills: [
      SkillDB.PYTHON,
      SkillDB.DJANGO,
      SkillDB.JAVASCRIPT,
      SkillDB.REACT,
      SkillDB.ERLANG,
      SkillDB.SCALA,
      SkillDB.GIT,
      SkillDB.POSTGRESQL,
      SkillDB.DOCKER,
      SkillDB.MINIO,
    ],
  },
  FIELDBOX_SOFTWARE: {
    id: 3,
    title: 'Fullstack Software Engineer',
    entity: 'FieldBox.ai',
    location: 'Bordeaux, France',
    startDate: '2020-02-01',
    endDate: '2022-02-01',
    description:
      'Frontend and backend development on diverse web applications using Django and React. ' +
      '(with a bit of Erlang and Scala here and there).',
    skills: [
      SkillDB.PYTHON,
      SkillDB.DJANGO,
      SkillDB.JAVASCRIPT,
      SkillDB.REACT,
      SkillDB.ERLANG,
      SkillDB.SCALA,
      SkillDB.GIT,
      SkillDB.POSTGRESQL,
      SkillDB.DOCKER,
      SkillDB.MINIO,
    ],
  },
  GARANTIE_PRIVEE_PO: {
    id: 4,
    title: 'IT Project Manager',
    entity: 'Garantie Privée',
    location: 'Bordeaux, France',
    startDate: '2011-01-01',
    endDate: '2019-06-30',
    description:
      'In charge of all software and application developments with both internal and external partners. Applications include: ' +
      'Insurance subscription platform with SEPA payments and electronic signatures, ' +
      'Fully customized e-commerce websites, ' +
      'Point-of-sales software, ' +
      'Dashboard and KPI interface.',
    skills: [SkillDB.POSTGRESQL, SkillDB.JAVASCRIPT],
  },
});

export const EducationDB = Object.freeze({
  SELF_TRAINING: {
    id: 1,
    title: 'Self-training in web development',
    entity: 'Online courses',
    location: 'Remote',
    startDate: '2018-06-01',
    endDate: '2019-06-01',
    description:
      'About 10h/week to learn web development with HTML/CSS, Javascript/VueJS, Python/Django, and Git.',
    skills: [
      SkillDB.PYTHON,
      SkillDB.DJANGO,
      SkillDB.JAVASCRIPT,
      SkillDB.VUEJS,
      SkillDB.GIT,
      SkillDB.HTML5,
      SkillDB.CSS3,
      SkillDB.POSTGRESQL,
    ],
  },
  MASTER: {
    id: 2,
    title: 'Master of Business Administration',
    entity: 'Kedge Business School',
    location: 'Bordeaux, France',
    startDate: '2019-01-01',
    endDate: '2013-01-01',
    description: 'Specialization in Information Systems Management.',
    skills: [],
  },
});
