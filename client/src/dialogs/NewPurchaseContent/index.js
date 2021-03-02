import React from 'react'

import PropTypes from 'prop-types'

import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import ReceiptIcon from '@material-ui/icons/ReceiptOutlined'

import Button from 'src/components/Button'

import NewPurchaseForm from 'src/forms/NewPurchaseForm'

import useStyles from './styles'

const NewPurchaseContent = ({ company, onSubmit }) => {
  const classes = useStyles()

  return (
    <DialogContent className={classes.root}>
      <Grid container spacing={4}>
        <Grid item xs={12} container justify='center'>
          <ReceiptIcon className={classes.icon} />
        </Grid>
        <Grid item xs={12}>
          <Typography className={classes.subtitle} variant='body1' color='textSecondary'>
            Use seu cupom fiscal para automagicamente <b>cadastrar produtos</b> e{' '}
            <b>dar entrada no seu estoque</b> {'🔮✨'}
          </Typography>
        </Grid>
        {company?.address?.state === 'AM' && (
          <>
            <Grid item xs={12}>
              <Typography className={classes.subtitle} variant='body1' color='textSecondary'>
                A chave de acesso do cupom fiscal normalmente fica localizada{' '}
                <b>próximo ao QR Code</b> ou então <b>consulte o seu cupom fiscal</b> através do QR
                Code e essa informação estará disponível no site da SEFAZ.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <NewPurchaseForm
                onSubmit={onSubmit}
                actions={(submitting, pristine, invalid) => (
                  <Paper className={classes.paper}>
                    <DialogActions>
                      <Button
                        type='submit'
                        variant='contained'
                        color='primary'
                        disabled={submitting || pristine || invalid}
                      >
                        Salvar
                      </Button>
                    </DialogActions>
                  </Paper>
                )}
              />
            </Grid>
          </>
        )}
        {company?.address?.state !== 'AM' && (
          <Grid item xs={12}>
            {' '}
            <Typography className={classes.subtitle} align='center' variant='h4'>
              em breve para todos os estados {'⏳'}
            </Typography>
          </Grid>
        )}
      </Grid>
    </DialogContent>
  )
}

NewPurchaseContent.propTypes = {
  company: PropTypes.object,
  onSubmit: PropTypes.func
}

NewPurchaseContent.defaultProps = {
  onSubmit: () => {}
}

export default NewPurchaseContent
