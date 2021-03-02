import React from 'react'

import PropTypes from 'prop-types'

import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Paper from '@material-ui/core/Paper'

import Button from 'src/components/Button'

import UpsertIfoodCategoryForm from 'src/forms/UpsertIfoodCategoryForm'

import useStyles from './styles'

const UpsertIfoodCategoryContent = ({ loading, category, onClose, onSubmit }) => {
  const classes = useStyles()

  return (
    <DialogContent className={classes.root}>
      <UpsertIfoodCategoryForm
        category={category}
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
                {category ? 'Atualizar' : 'Adicionar'}
              </Button>
            </DialogActions>
          </Paper>
        )}
      />
    </DialogContent>
  )
}

UpsertIfoodCategoryContent.propTypes = {
  loading: PropTypes.bool,
  category: PropTypes.shape({
    available: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string
  }),
  onClose: PropTypes.func,
  onSubmit: PropTypes.func
}

UpsertIfoodCategoryContent.defaultProps = {
  loading: false,
  onClose: () => {},
  onSubmit: () => {}
}

export default UpsertIfoodCategoryContent
