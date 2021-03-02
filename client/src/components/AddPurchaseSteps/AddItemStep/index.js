import React from 'react'

import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Paper from '@material-ui/core/Paper'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import UpsertItemForm from 'src/forms/UpsertItemForm'

import useStyles from './styles'

const AddItemStep = ({ item, onSubmit }) => {
  const classes = useStyles()
  const theme = useTheme()
  const upMedium = useMediaQuery(theme.breakpoints.up('md')) || true

  const hasItemProperties = item && item.quantity && item.price

  return (
    <DialogContent className={classes.content}>
      <UpsertItemForm
        item={item}
        onSubmit={onSubmit}
        actions={(submitting, pristine, invalid, handleSubmit) => (
          <Paper className={classes.paper} elevation={10}>
            <DialogActions>
              <Button
                variant='contained'
                color='primary'
                size='large'
                fullWidth={!upMedium}
                disabled={item ? submitting || invalid : submitting || pristine || invalid}
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

AddItemStep.propTypes = {
  item: PropTypes.object,
  onSubmit: PropTypes.func
}

AddItemStep.defaultProps = {
  onSubmit: () => {}
}

export default AddItemStep
