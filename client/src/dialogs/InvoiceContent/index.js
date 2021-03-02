import React, { useState } from 'react'

import PropTypes from 'prop-types'
import QRCode from 'qrcode.react'

import Chip from '@material-ui/core/Chip'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import Receipt from '@material-ui/icons/Receipt'

import Button from 'src/components/Button'
import Placeholder from 'src/components/Placeholder'

import SendEmailDialog from 'src/dialogs/SendEmailDialog'

import { InvoiceStatus } from 'src/utils/enums'

import useStyles from './styles'

const InvoiceDialog = ({ loading, order, onClose, onSubmit, onSendInvoiceEmail, fullScreen }) => {
  const classes = useStyles()

  const [openDialog, setOpenDialog] = useState(false)

  const handleSubmit = (event) => {
    if (event) event.preventDefault()

    if (order?.invoice?.status !== InvoiceStatus.SUCCESS) {
      onSubmit(order)
    } else {
      setOpenDialog(true)
    }
  }

  const handleCancel = () => {
    onClose()
  }

  const mapStatus = (invoice) => {
    if (!invoice) return null

    if (InvoiceStatus.SUCCESS === invoice.status) return 'sucesso'
    if (InvoiceStatus.PENDING === invoice.status) return 'pendente'
    if (InvoiceStatus.ERROR === invoice.status) return 'erro'
  }

  /* EMAL DIALOG */
  const handleDialogClose = () => {
    setOpenDialog(false)
  }

  const handleSubmitEmail = (data) => {
    setOpenDialog(false)
    onSendInvoiceEmail(order, data.email)
  }

  const invoice = order.invoice

  return (
    <>
      <DialogContent className={classes.root}>
        <SendEmailDialog
          open={openDialog}
          onClose={handleDialogClose}
          onSubmit={handleSubmitEmail}
        />
        {invoice && (
          <Grid container spacing={3}>
            <Grid item>
              <Typography variant='body1' gutterBottom>
                Status:
              </Typography>
            </Grid>
            <Grid item>
              <Chip
                size='small'
                variant='outlined'
                className={classes[invoice.status]}
                label={mapStatus(invoice)}
              />
            </Grid>
            <Grid container item>
              <Typography variant='body1' gutterBottom>
                {invoice.message}
              </Typography>
            </Grid>
            {invoice.status === InvoiceStatus.SUCCESS && invoice.QRCode && invoice.accessKey && (
              <>
                <Grid xs={12} container item justify='left'>
                  <Typography variant='bold' gutterBottom>
                    Chave de Acesso: {invoice.accessKey}
                  </Typography>
                </Grid>
                <Grid xs={12} container item justify='center'>
                  <QRCode size={200} value={invoice.QRCode} />
                </Grid>
              </>
            )}
          </Grid>
        )}
        {!invoice && (
          <Grid container spacing={3}>
            <Placeholder
              icon={<Receipt />}
              message={'Sua nota fiscal ainda não foi gerada!'}
              subtitle={'Clique em "gerar" para enviar as informações para o SAT'}
            />
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color='primary'>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} loading={loading} color='primary'>
          {invoice?.status !== InvoiceStatus.SUCCESS ? 'Gerar' : 'Enviar'}
        </Button>
      </DialogActions>
    </>
  )
}

InvoiceDialog.propTypes = {
  loading: PropTypes.bool,
  order: PropTypes.object,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  fullScreen: PropTypes.bool,
  onSendInvoiceEmail: PropTypes.func
}

InvoiceDialog.defaultProps = {
  order: {},
  onClose: () => {},
  onSubmit: () => {},
  fullScreen: false,
  onSendInvoiceEmail: () => {}
}

export default InvoiceDialog
