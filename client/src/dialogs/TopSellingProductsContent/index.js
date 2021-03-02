import React from 'react'
import { useHistory } from 'react-router-dom'

import PropTypes from 'prop-types'

import DialogContent from '@material-ui/core/DialogContent'
import Paper from '@material-ui/core/Paper'

import VirtualizedTable from 'src/components/VirtualizedTable'

import { Paths } from 'src/utils/enums'

import useStyles from './styles'

const TopSellingProducts = ({ topSellingProducts }) => {
  const classes = useStyles()
  const history = useHistory()

  const handleRowClick = (data) => {
    history.push(`${Paths.products.path}/${data.rowData.product}`)
  }

  return (
    <DialogContent className={classes.root}>
      <Paper style={{ height: 400, width: '100%' }}>
        <VirtualizedTable
          rowCount={topSellingProducts.length}
          rowGetter={({ index }) => topSellingProducts[index]}
          onRowClick={handleRowClick}
          columns={[
            {
              width: 150,
              label: 'Nome',
              dataKey: 'name',
              sliceAt: 30
            },
            {
              width: 80,
              label: 'Unidades vendidas',
              dataKey: 'total',
              numeric: true
            },
            {
              width: 120,
              label: 'Receita',
              dataKey: 'revenue',
              price: true
            },
            {
              width: 120,
              label: 'Receita total (%)',
              dataKey: 'subtotalRevenuePercentage',
              percentage: true
            }
          ]}
        />
      </Paper>
    </DialogContent>
  )
}

TopSellingProducts.propTypes = {
  topSellingProducts: PropTypes.array
}

TopSellingProducts.defaultProps = {
  topSellingProducts: []
}

export default TopSellingProducts
