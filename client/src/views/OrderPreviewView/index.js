import React, { useEffect } from 'react'

import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import helpscout from 'src/services/helpscout'

import useStyles from './styles'

const OrderPreviewView = ({ order }) => {
  const classes = useStyles()

  useEffect(() => {
    helpscout.hideBeacon()
  }, [])

  return (
    <main className={classes.root}>
      <Grid container direction='column' justify='center' component={Paper} elevation={3}>
        <Grid xs={12} item container justify='center'>
          <Typography align='center' variant='h2'>
            Seu pedido foi concluido com sucesso {'✅'}
          </Typography>
        </Grid>
        <Grid xs={12} item container justify='center'>
          <Typography variant='h6'>O estabelecimento entrará em contato {'📱'}</Typography>
        </Grid>
      </Grid>
    </main>
  )
}

OrderPreviewView.propTypes = {
  order: PropTypes.object
}

OrderPreviewView.defaultProps = {}

export default OrderPreviewView
