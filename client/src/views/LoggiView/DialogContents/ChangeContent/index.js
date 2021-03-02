import React from 'react'

import PropTypes from 'prop-types'

import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Paper from '@material-ui/core/Paper'

import Button from 'src/components/Button'

import ChangeForm from 'src/forms/ChangeForm'

import useStyles from './styles'

const ChangeContent = ({ loading, product, onClose, onSubmit }) => {
  const classes = useStyles()

  return (
    <DialogContent className={classes.root}>
      <ChangeForm
        onSubmit={onSubmit}
        onClose={onClose}
        actions={(submitting, pristine, invalid) => (
          <Paper className={classes.paper}>
            <DialogActions>
              <Button
                type='submit'
                variant='contained'
                color='primary'
                loading={loading}
                disabled={submitting || pristine || invalid}
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

ChangeContent.propTypes = {
  loading: PropTypes.bool,
  product: PropTypes.object,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func
}

ChangeContent.defaultProps = {
  loading: false,
  onClose: () => {},
  onSubmit: () => {}
}

export default ChangeContent
