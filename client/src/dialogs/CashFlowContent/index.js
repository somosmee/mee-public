import React from 'react'

import PropTypes from 'prop-types'

import DialogContent from '@material-ui/core/DialogContent'
import Paper from '@material-ui/core/Paper'

import VirtualizedTable from 'src/components/VirtualizedTable'

import useStyles from './styles'

const transformData = (item) => ({
  date: item.label,
  expense: item.values[0],
  income: item.values[1],
  profit: item.values[2]
})

const CashFlowContent = ({ data }) => {
  const classes = useStyles()

  const transformedData = data.map(transformData)

  return (
    <DialogContent className={classes.root}>
      <Paper style={{ height: 400, width: '100%' }}>
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
              width: 150,
              label: 'Despesas',
              dataKey: 'expense',
              numeric: true,
              price: true
            },
            {
              width: 150,
              label: 'Receitas',
              dataKey: 'income',
              numeric: true,
              price: true
            },
            {
              width: 150,
              label: 'Lucro',
              dataKey: 'profit',
              numeric: true,
              price: true
            }
          ]}
        />
      </Paper>
    </DialogContent>
  )
}

CashFlowContent.propTypes = {
  data: PropTypes.array
}

CashFlowContent.defaultProps = {
  data: []
}

export default CashFlowContent
