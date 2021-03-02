import React, { useState } from 'react'

import PropTypes from 'prop-types'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'

import ReceiptIcon from '@material-ui/icons/Receipt'
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket'

import CashiereImage from 'src/icons/cashiere.png'
import OrderDeliveryImage from 'src/icons/online_shopping.png'

import useStyles from './styles'

const SalesTypeContent = ({ currentType, onSalesTypeSelected }) => {
  const classes = useStyles()

  const [salesType, setSalesType] = useState(currentType || 'checkout')

  const handleSalesType = (event, newSalesType) => {
    if (newSalesType) {
      setSalesType(newSalesType)
    }
  }

  const handleClick = (option) => () => {
    onSalesTypeSelected(option)
  }

  return (
    <>
      <DialogContent className={classes.root}>
        <Grid container direction='row' justify='center' alignItems='center'>
          <ToggleButtonGroup
            value={salesType}
            exclusive
            onChange={handleSalesType}
            aria-label='selecione modo de venda'
          >
            <ToggleButton value='checkout' aria-label='left aligned'>
              <ShoppingBasketIcon />
            </ToggleButton>
            <ToggleButton value='orders' aria-label='centered'>
              <ReceiptIcon />
            </ToggleButton>
          </ToggleButtonGroup>
          {salesType === 'checkout' && (
            <Grid container direction='row' justify='center' alignItems='center'>
              <img className={classes.imageCheckout} alt='venda frente de caixa' src={CashiereImage} />
              <Box maxWidth='450px' >
                <Typography className={classes.mainText} variant='body1' gutterBottom>
                  O modo <b>frente de caixa</b> é utilizado quando as vendas são abertas e fechadas instantaneamente.
                  <br/>
                  Normalmente é o modo utilizado em <b>mercados</b> e <b>farmácias</b>.
                </Typography>
              </Box>
              <Typography variant='body2' gutterBottom>
                Você pode mudar esse modo de vendas a qualquer momento.
              </Typography>
            </Grid>
          )}
          {salesType === 'orders' && (
            <Grid container direction='row' justify='center' alignItems='center'>
              <img className={classes.imageOrders} alt='venda frente de caixa' src={OrderDeliveryImage} />
              <Box maxWidth='450px' >
                <Typography className={classes.mainText} variant='body1' gutterBottom>
                  O modo <b>pedidos</b> é utilizado quando você precisa acompanhar o status da venda, seja por que ela tem uma etapa de preparo ou uma etapa de entrega.
                  <br/>
                  Normalmente é o modo utilizado por <b>restaurantes</b>, <b>vendas online</b> e <b>delivery</b>.
                </Typography>
              </Box>
              <Typography variant='body2' gutterBottom>
                Você pode mudar esse modo de vendas a qualquer momento.
              </Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions className={classes.actions}>
        {salesType === 'checkout' && (
          <Button onClick={handleClick('checkout')} variant='contained' color='primary'>
            Escolher modo frente de caixa
          </Button>
        )}
        {salesType === 'orders' && (
          <Button onClick={handleClick('orders')} variant='contained' color='primary'>
            Escolher modo pedidos
          </Button>
        )}
      </DialogActions>
    </>
  )
}

SalesTypeContent.propTypes = {
  currentType: PropTypes.string,
  onSalesTypeSelected: PropTypes.func
}

SalesTypeContent.defaultProps = {
  currentType: null,
  onSalesTypeSelected: () => {}
}

export default SalesTypeContent
