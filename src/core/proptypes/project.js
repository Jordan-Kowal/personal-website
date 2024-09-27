import PropTypes from "prop-types";
import { SkillPropType } from "./skill";

export const ProjectPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  githubUrl: PropTypes.string,
  websiteUrl: PropTypes.string,
  screenshots: PropTypes.arrayOf(PropTypes.string),
  deprecated: PropTypes.bool.isRequired,
  skills: PropTypes.arrayOf(SkillPropType).isRequired,
});
