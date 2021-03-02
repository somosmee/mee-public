import React from 'react'

import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Paper from '@material-ui/core/Paper'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import UpsertDimensionsForm from 'src/forms/UpsertDimensionsForm'

import useStyles from './styles'

const Dimensionstep = ({ dimensions, onSubmit }) => {
  const classes = useStyles()
  const theme = useTheme()
  const upMedium = useMediaQuery(theme.breakpoints.up('md')) || true

  const hasItemProperties = dimensions && dimensions.height && dimensions.width

  return (
    <DialogContent className={classes.content}>
      <UpsertDimensionsForm
        dimensions={dimensions}
        onSubmit={onSubmit}
        actions={(submitting, pristine, invalid, handleSubmit) => (
          <Paper className={classes.paper} elevation={10}>
            <DialogActions>
              <Button
                variant='contained'
                color='primary'
                size='large'
                fullWidth={!upMedium}
                disabled={dimensions ? submitting || invalid : submitting || pristine || invalid}
                onClick={handleSubmit}
              >
                {hasItemProperties ? 'Atualizar' : 'Adicionar'}
              </Button>
            </DialogActions>
          </Paper>
        )}
      />
    </DialogContent>
  )
}

Dimensionstep.propTypes = {
  dimensions: PropTypes.object,
  onSubmit: PropTypes.func
}

Dimensionstep.defaultProps = {
  onSubmit: () => {}
}

export default Dimensionstep
