import React from 'react'

import classNames from 'classnames'
import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import useStyles from './styles'

const StatsDisplay = ({
  primaryLabel,
  primaryFontSize,
  secondaryFontSize,
  secondaryNumber,
  secondaryLabel
}) => {
  const classes = useStyles()

  return (
    <>
      <Grid className={classes.root} item xs>
        <Typography
          className={classNames(classes.retentionPercentage, {
            [classes.retentionPercentageSmall]: primaryFontSize === 'small',
            [classes.retentionPercentageMedium]: primaryFontSize === 'medium',
            [classes.retentionPercentageLarge]: primaryFontSize === 'large'
          })}
          variant='body1'
          gutterBottom
          display='inline'
        >
          {primaryLabel}
        </Typography>
        <Typography
          className={classNames(classes.retentionPercentageDiff, {
            [classes.retentionPercentageDiffGreenSmall]:
              secondaryNumber >= 0 && secondaryFontSize === 'small',
            [classes.retentionPercentageDiffGreenMedium]:
              secondaryNumber >= 0 && secondaryFontSize === 'medium',
            [classes.retentionPercentageDiffGreenLarge]:
              secondaryNumber >= 0 && secondaryFontSize === 'large',
            [classes.retentionPercentageDiffRedSmall]:
              secondaryNumber < 0 && secondaryFontSize === 'small',
            [classes.retentionPercentageDiffRedMedium]:
              secondaryNumber < 0 && secondaryFontSize === 'medium',
            [classes.retentionPercentageDiffRedLarge]:
              secondaryNumber < 0 && secondaryFontSize === 'large'
          })}
          display='inline'
          variant='subtitle2'
          gutterBottom
        >
          {secondaryNumber > 0 && '+'}
          {secondaryLabel}
        </Typography>
      </Grid>
    </>
  )
}

StatsDisplay.propTypes = {
  primaryFontSize: PropTypes.string,
  secondaryFontSize: PropTypes.string,
  primaryLabel: PropTypes.string,
  secondaryNumber: PropTypes.number,
  secondaryLabel: PropTypes.number
}

StatsDisplay.defaultProps = {
  primaryFontSize: 'small',
  secondaryFontSize: 'small'
}

export default StatsDisplay
