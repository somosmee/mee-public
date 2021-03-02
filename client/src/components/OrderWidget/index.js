import React, { useState, useEffect, forwardRef } from 'react'

import classNames from 'classnames'
import PropTypes from 'prop-types'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Input from '@material-ui/core/Input'
import LinearProgress from '@material-ui/core/LinearProgress'
import { useTheme } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Delete from '@material-ui/icons/Delete'

import List from 'src/components/List'
import OrderWidgetItem from 'src/components/OrderWidget/OrderWidgetItem'
import PaymentWidget from 'src/components/PaymentWidget'

import { Measurements } from 'src/utils/enums'
import numeral from 'src/utils/numeral'

import useStyles from './styles'

const labels = [
  {
    key: ['name'],
    name: 'Nome'
  },
  {
    key: ['price'],
    name: 'Preço'
  },
  {
    key: ['quantity'],
    name: 'Quantidade'
  },
  {
    key: ['subtotal'],
    name: 'Subtotal'
  }
]

const OrderWidget = forwardRef(
  (
    {
      className,
      loading,
      items,
      total,
      hasCustomer,
      onEanKeyPress,
      onPayment,
      onDeleteItem,
      onDeleteAllItems
    },
    ref
  ) => {
    const classes = useStyles()
    const theme = useTheme()
    const upMedium = useMediaQuery(theme.breakpoints.up('md'))

    const [gtin, setGtin] = useState('')

    useEffect(() => {
      ref.current.focus()
    })

    const onEanChange = (e) => {
      const gtin = e.target.value
      setGtin(gtin)
    }

    const onKeyPress = (e) => {
      if (e.key === 'Enter' && gtin) {
        onEanKeyPress(gtin)
        setGtin('')
      }
    }

    const handlePaymentClick = (e) => {
      onPayment(e)
    }

    const renderItem = (item, index) => {
      return (
        <OrderWidgetItem
          key={index + item.gtin}
          index={index}
          item={item}
          onDeleteItem={onDeleteItem}
        />
      )
    }

    const handleAction = (action, item, index) => (event) => {
      event && event.stopPropagation()

      switch (action) {
        case 'delete':
          onDeleteItem(index)
          break
        default:
          break
      }
    }

    const hasItems = !!items.length

    return (
      <div className={classNames(classes.root, className)}>
        <Grid className={classes.gtin} container spacing={2} alignItems='center'>
          <Grid item xs>
            <FormControl fullWidth>
              <Input
                inputRef={ref}
                className={classes.input}
                name='gtin'
                type='text'
                placeholder='Digite o código de barras'
                value={gtin}
                disabled={loading}
                autoComplete='off'
                disableUnderline
                fullWidth={true}
                onChange={onEanChange}
                onKeyPress={onKeyPress}
                inputProps={{ 'aria-label': 'Código de barras' }}
              />
              <LinearProgress
                style={{ height: 3 }}
                variant={loading ? 'query' : 'determinate'}
                value={loading ? null : 100}
              />
            </FormControl>
          </Grid>
          <Grid item xs='auto'>
            <Typography className={classes.total} data-cy='payment-widget-total' variant='h4'>
              {numeral(total).format()}
            </Typography>
          </Grid>
          {upMedium && (
            <Grid item xs='auto'>
              <PaymentWidget
                className={classes.paymentWidget}
                hasCustomer={hasCustomer}
                total={total}
                enabled={hasItems}
                onPayment={handlePaymentClick}
              />
            </Grid>
          )}
        </Grid>
        {hasItems && (
          <>
            <Box display='flex' justifyContent='flex-end'>
              <Button
                data-cy='order-widget-remove-all'
                size='small'
                color='secondary'
                disabled={!hasItems}
                startIcon={<Delete />}
                onClick={onDeleteAllItems}
              >
                Remover todos
              </Button>
            </Box>
            {upMedium ? (
              <Table aria-labelledby='tableTitle'>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.cell}>Nome</TableCell>
                    <TableCell className={classes.cell} align='right'>
                      Preço
                    </TableCell>
                    <TableCell className={classes.cell} align='right'>
                      {upMedium ? 'Quantidade' : 'Qtd'}
                    </TableCell>
                    <TableCell className={classes.cell} align='right'>
                      Subtotal
                    </TableCell>
                    <TableCell className={classes.cell} align='right' />
                  </TableRow>
                </TableHead>
                <TableBody>{items.map(renderItem)}</TableBody>
              </Table>
            ) : (
              <List
                labels={labels}
                items={items}
                getItemTitle={(item) => item.name}
                getItemAdornmentTitle={(item) => numeral(item.subtotal).format('$ 0.00')}
                getItemSubtitle={(item) => item.gtin}
                getItemDescription={(item) =>
                  `${item.quantity} ${Measurements[item.measurement].symbol} x ${numeral(
                    item.price
                  ).format('$ 0.00')}`
                }
                renderActions={(item, index) => (
                  <Tooltip title='Remover'>
                    <IconButton aria-label='Remover' onClick={handleAction('delete', item, index)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                )}
              />
            )}
          </>
        )}
      </div>
    )
  }
)

OrderWidget.displayName = 'OrderWidget'

OrderWidget.propTypes = {
  className: PropTypes.string,
  loading: PropTypes.bool,
  items: PropTypes.array,
  total: PropTypes.number,
  hasCustomer: PropTypes.bool,
  onEanKeyPress: PropTypes.func,
  onPayment: PropTypes.func,
  onDeleteItem: PropTypes.func,
  onDeleteAllItems: PropTypes.func
}

OrderWidget.defaultProps = {
  loading: false,
  items: [],
  total: 0,
  hasCustomer: () => {},
  onEanKeyPress: () => {},
  onPayment: () => {},
  onDeleteItem: () => {},
  onDeleteAllItems: () => {}
}

export default OrderWidget
