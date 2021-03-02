import React from 'react'

import PropTypes from 'prop-types'

import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'

import Button from 'src/components/Button'

import UpsertProductForm from 'src/forms/UpsertProductForm'

import useStyles from './styles'

const UpsertProductContent = ({ loading, initialValues, onClose, onSubmit }) => {
  const classes = useStyles()

  return (
    <DialogContent className={classes.root}>
      <UpsertProductForm
        initialValues={initialValues}
        onClose={onClose}
        onSubmit={onSubmit}
        actions={(submitting, pristine, invalid, handleSubmit, showMore, handleShowMore) => (
          <Paper className={classes.paper}>
            <Divider light />
            <DialogActions className={classes.actions}>
              <Button color='primary' onClick={handleShowMore}>
                {showMore ? 'Mostrar menos' : 'Mostrar mais'}
              </Button>
              <Button
                type='submit'
                variant='contained'
                color='primary'
                loading={loading || submitting}
                disabled={initialValues ? submitting || invalid : submitting || pristine || invalid}
              >
                {initialValues?._id ? 'Atualizar' : 'Adicionar'}
              </Button>
            </DialogActions>
          </Paper>
        )}
      />
    </DialogContent>
  )
}

UpsertProductContent.propTypes = {
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func
}

UpsertProductContent.defaultProps = {
  loading: false,
  onClose: () => {},
  onSubmit: () => {}
}

export default UpsertProductContent
