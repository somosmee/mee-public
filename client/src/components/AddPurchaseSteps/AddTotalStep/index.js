import React from 'react'

import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Paper from '@material-ui/core/Paper'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import UpsertTotalForm from 'src/forms/UpsertTotalForm'

import useStyles from './styles'

const AddTotalStep = ({ onSubmit }) => {
  const classes = useStyles()
  const theme = useTheme()
  const upMedium = useMediaQuery(theme.breakpoints.up('md')) || true

  return (
    <DialogContent className={classes.content}>
      <UpsertTotalForm
        onSubmit={onSubmit}
        actions={(submitting, pristine, invalid, handleSubmit) => (
          <Paper className={classes.paper} elevation={10}>
            <DialogActions>
              <Button
                variant='contained'
                color='primary'
                size='large'
                fullWidth={!upMedium}
                disabled={submitting || pristine || invalid}
                onClick={handleSubmit}
              >
                Salvar
              </Button>
            </DialogActions>
          </Paper>
        )}
      />
    </DialogContent>
  )
}

AddTotalStep.propTypes = {
  onSubmit: PropTypes.func
}

AddTotalStep.defaultProps = {
  onSubmit: () => {}
}

export default AddTotalStep
