import React, { forwardRef } from 'react'

import PropTypes from 'prop-types'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'

import Dialog from 'src/components/Dialog'

import UpsertFederalTaxNumberForm from 'src/forms/UpsertFederalTaxNumberForm'

import useStyles from './styles'

const Transition = forwardRef((props, ref) => <Slide direction='up' ref={ref} {...props} />)

Transition.displayName = 'Transition'

const AddFederalTaxNumberDialog = ({
  open,
  cart,
  onAddFederalTaxNumber,
  onDeleteFederalTaxNumber,
  onClose,
  onExited
}) => {
  const classes = useStyles()

  return (
    <Dialog
      className={classes.root}
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      position='bottom'
    >
      <DialogTitle>{cart.nationalId ? 'Editar' : 'Adicionar'} CPF ou CNPJ</DialogTitle>
      <DialogContent>
        <UpsertFederalTaxNumberForm
          initialValues={cart}
          onSubmit={onAddFederalTaxNumber}
          actions={(submitting, pristine, invalid) => (
            <Box className={classes.actions}>
              <Button
                className={classes.button}
                variant='contained'
                color='primary'
                type='submit'
                disabled={submitting || pristine || invalid}
                fullWidth
              >
                Adicionar
              </Button>
              <Button
                className={classes.button}
                onClick={onDeleteFederalTaxNumber}
                color='secondary'
                fullWidth
              >
                Não, obrigado.
              </Button>
            </Box>
          )}
        />
      </DialogContent>
    </Dialog>
  )
}

AddFederalTaxNumberDialog.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  cart: PropTypes.object,
  onAddFederalTaxNumber: PropTypes.func,
  onDeleteFederalTaxNumber: PropTypes.func,
  onClose: PropTypes.func,
  onExited: PropTypes.func
}

AddFederalTaxNumberDialog.defaultProps = {
  onAddFederalTaxNumber: () => {},
  onDeleteFederalTaxNumber: () => {},
  onClose: () => {},
  onExited: () => {}
}

export default AddFederalTaxNumberDialog
