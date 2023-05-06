import PropTypes from 'prop-types';

export const ProjectPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  githubUrl: PropTypes.string,
  websiteUrl: PropTypes.string,
  screenshots: PropTypes.arrayOf(PropTypes.string),
  deprecated: PropTypes.bool.isRequired,
});
