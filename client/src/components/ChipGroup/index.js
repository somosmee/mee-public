import React from 'react'

import PropTypes from 'prop-types'

import Chip from '@material-ui/core/Chip'
import Grid from '@material-ui/core/Grid'

import useStyles from './styles'

const ChipGroup = ({ values, selected, onChange }) => {
  const classes = useStyles()
  const handleClick = (type) => (event) => {
    onChange(type)
  }

  const renderButtons = ({ type, label }) => (
    <Grid item>
      <Chip
        className={classes.chip}
        key={type}
        label={label}
        color={selected === type ? 'primary' : 'default'}
        onClick={handleClick(type)}
      />
    </Grid>
  )

  return (
    <Grid className={classes.root} container spacing={1} xs>
      {values.map(renderButtons)}
    </Grid>
  )
}

ChipGroup.propTypes = {
  values: PropTypes.array,
  selected: PropTypes.string,
  onChange: PropTypes.func
}

ChipGroup.defaultProps = {
  values: [],
  onChange: () => {}
}

export default ChipGroup
