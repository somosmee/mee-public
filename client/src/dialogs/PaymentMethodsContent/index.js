import React from 'react'

import PropTypes from 'prop-types'

import DialogContent from '@material-ui/core/DialogContent'
import Paper from '@material-ui/core/Paper'

import VirtualizedTable from 'src/components/VirtualizedTable'

import useStyles from './styles'

const transformData = (item) => ({
  date: item.label,
  credit: item.values[0],
  debit: item.values[1],
  cash: item.values[2],
  voucher: item.values[3],
  pix: item.values[4]
})

const PaymentMethodsContent = ({ data }) => {
  const classes = useStyles()

  const transformedData = data.map(transformData)

  return (
    <DialogContent className={classes.root}>
      <Paper style={{ height: 500, width: '100%' }}>
        <VirtualizedTable
          rowCount={data.length}
          rowGetter={({ index }) => transformedData[index]}
          columns={[
            {
              width: 100,
              label: 'Data',
              dataKey: 'date'
            },
            {
              width: 130,
              label: 'Crédito',
              dataKey: 'credit',
              numeric: true,
              price: true
            },
            {
              width: 130,
              label: 'Débito',
              dataKey: 'debit',
              numeric: true,
              price: true
            },
            {
              width: 130,
              label: 'Dinheiro',
              dataKey: 'cash',
              numeric: true,
              price: true
            },
            {
              width: 130,
              label: 'Voucher',
              dataKey: 'voucher',
              numeric: true,
              price: true
            },
            {
              width: 130,
              label: 'PIX',
              dataKey: 'pix',
              numeric: true,
              price: true
            }
          ]}
        />
      </Paper>
    </DialogContent>
  )
}

PaymentMethodsContent.propTypes = {
  data: PropTypes.array
}

PaymentMethodsContent.defaultProps = {
  data: []
}

export default PaymentMethodsContent
