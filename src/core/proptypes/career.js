import { SkillPropType } from "@/core/proptypes/skill";
import PropTypes from "prop-types";

export const CareerItemPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  entity: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string,
  description: PropTypes.string.isRequired,
  skills: PropTypes.arrayOf(SkillPropType),
});
