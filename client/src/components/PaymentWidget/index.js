import React from 'react'

import classNames from 'classnames'
import PropTypes from 'prop-types'

import Fab from '@material-ui/core/Fab'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Payment from '@material-ui/icons/Payment'

import useStyles from './styles'

const PaymentWidget = ({ className, enabled, onPayment }) => {
  const classes = useStyles()
  const theme = useTheme()
  const upMedium = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <div className={classNames(classes.root, className)}>
      <Fab
        className={classNames({ [classes.fab]: !upMedium })}
        data-cy='payment-widget-add-payment'
        variant={!upMedium ? 'round' : 'extended'}
        color='primary'
        disabled={!enabled}
        aria-label='Pagamento'
        onClick={onPayment}
      >
        <Payment className={classNames({ [classes.icon]: upMedium })} />
        {!upMedium ? '' : 'Adicionar pagamento'}
      </Fab>
    </div>
  )
}

PaymentWidget.propTypes = {
  className: PropTypes.string,
  enabled: PropTypes.bool,
  onPayment: PropTypes.func
}

PaymentWidget.defaultProps = {
  enabled: false,
  onPayment: () => {}
}

export default PaymentWidget
