import React from 'react'

import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import Emoji from 'src/components/Emoji'

import useStyles from './styles'

const OrderReceiptFooter = ({ invoice, size }) => {
  const classes = useStyles()

  return (
    <Grid className={classes[`root-${size}`]} container item>
      <Grid container item align='center'>
        <Grid item xs={12}>
          <Typography className={classes.title}>
            Conheça o sistema de gestão mais simples para o seu negócio em{' '}
            <b>{'https://www.somosmee.com'}</b>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography className={classes.title} gutterBottom>
            Qualquer dúvida entre em contato no <b>oi@somosmee.com</b>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography className={classes.title}>
            {'Mee | A tecnologia que parece mágica '}
            <Emoji symbol={'🔮'} label='bola de cristal' />
            <Emoji symbol={'💜'} label='coração roxo' />
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}

OrderReceiptFooter.propTypes = {
  invoice: PropTypes.shape({}),
  size: PropTypes.string
}

OrderReceiptFooter.defaultProps = {
  size: 'small'
}

export default OrderReceiptFooter
