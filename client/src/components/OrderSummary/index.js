import React from 'react'
import { Link } from 'react-router-dom'

import classNames from 'classnames'
import PropTypes from 'prop-types'

import Fab from '@material-ui/core/Fab'

import ShoppingCart from '@material-ui/icons/ShoppingCart'

import Title from 'src/components/Title'

import numeral from 'src/utils/numeral'

import useStyles from './styles'

const OrderSummary = ({ className, total, ordersCount }) => {
  const classes = useStyles()

  const sWord = ordersCount === 1 ? '' : 's'

  return (
    <div className={classNames(classes.root, className)}>
      <Title>
        {ordersCount > 0
          ? `${ordersCount} venda${sWord} totalizando ${numeral(total).format()}`
          : 'Faça a sua primeira venda do dia'}
      </Title>
      <Fab variant='extended' component={Link} to='/cart' color='primary'>
        <ShoppingCart className={classes.icon} />
        {ordersCount === 0 ? 'Começar a vender' : 'Adicionar venda'}
      </Fab>
    </div>
  )
}

OrderSummary.propTypes = {
  className: PropTypes.string,
  total: PropTypes.number,
  ordersCount: PropTypes.number
}

OrderSummary.defaultProps = {
  orders: [],
  total: 0,
  ordersCount: 0
}

export default OrderSummary
