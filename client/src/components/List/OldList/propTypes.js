import PropTypes from 'prop-types'

const label = PropTypes.shape({
  key: PropTypes.arrayOf(PropTypes.string).isRequired,
  name: PropTypes.string.isRequired,
  sufix: PropTypes.string,
  type: PropTypes.string,
  format: PropTypes.string,
  render: PropTypes.node
})

export default {
  label
}
