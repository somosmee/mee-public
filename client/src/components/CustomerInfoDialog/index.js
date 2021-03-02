import React, { forwardRef } from 'react'

import PropTypes from 'prop-types'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'
import Typography from '@material-ui/core/Typography'

import Dialog from 'src/components/Dialog'

import CustomerInfoForm from 'src/forms/CustomerInfoForm'

import useStyles from './styles'

const Transition = forwardRef((props, ref) => <Slide direction='up' ref={ref} {...props} />)

Transition.displayName = 'Transition'

const AddFederalTaxNumberDialog = ({ title, open, customer, onSubmit, onClose, onExited }) => {
  const classes = useStyles()

  return (
    <Dialog
      className={classes.root}
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      position='bottom'
    >
      <DialogTitle>Adicione suas informações</DialogTitle>
      <DialogContent>
        <Typography variant='subtitle1'>
          Precisamos dessas informações para entrar em contato sobre o seu pedido.
        </Typography>
        <CustomerInfoForm
          initialValues={customer}
          onSubmit={onSubmit}
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
                Finalizar pedido
              </Button>
              <Button className={classes.button} onClick={onClose} color='secondary' fullWidth>
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
  customer: PropTypes.object,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
  onExited: PropTypes.func
}

AddFederalTaxNumberDialog.defaultProps = {
  customer: {},
  onSubmit: () => {},
  onClose: () => {},
  onExited: () => {}
}

export default AddFederalTaxNumberDialog
