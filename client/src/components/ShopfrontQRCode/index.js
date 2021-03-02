import React, { forwardRef } from 'react'

import PropTypes from 'prop-types'
import QRCode from 'qrcode.react'

import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import OrderReceiptFooter from 'src/components/OrderReceipt/OrderReceiptFooter'

import useStyles from './styles'

const ShopfrontQRCode = forwardRef(({ link, display }, ref) => {
  const classes = useStyles()

  return (
    <Box className={classes.root} display={display}>
      <Grid container direction='column' justify='center' ref={ref} spacing={3}>
        <Grid xs={12} item container justify='center'>
          <Typography variant='h2'> Faça seu pedido aqui!</Typography>
        </Grid>
        <Grid xs={12} item container justify='center'>
          <QRCode size={200} value={link} />
        </Grid>
        <Grid xs={12} item container justify='center'>
          <ol>
            <Typography variant='h6' component='li'>
              Aponte a câmera do seu celular {'🤳'}
            </Typography>
            <Typography variant='h6' component='li'>
              Clique no link {'🔗'}
            </Typography>
            <Typography variant='h6' component='li'>
              Faça seu pedido {'🧾'}
            </Typography>
          </ol>
        </Grid>
        <Grid item container justify='center'>
          <OrderReceiptFooter size='medium' />
        </Grid>
      </Grid>
    </Box>
  )
})

ShopfrontQRCode.displayName = 'ShopfrontQRCode'

ShopfrontQRCode.propTypes = {
  link: PropTypes.string,
  display: PropTypes.string
}

ShopfrontQRCode.defaultProps = {
  display: 'none'
}

export default ShopfrontQRCode
