import React from 'react'

import moment from 'moment'
import PropTypes from 'prop-types'

import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'

import useStyles from './styles'

const ProductionRequestsContent = ({ productionRequests }) => {
  const classes = useStyles()

  const renderItem = (item, index) => (
    <TableRow key={item.product}>
      <TableCell padding='dense'>
        <Typography variant='subtitle1'>{`${item.quantity}x ${item.name}`}</Typography>
        <Typography color='textSecondary'>{item.note}</Typography>
      </TableCell>
    </TableRow>
  )

  const renderProductionRequest = (productionRequest) => (
    <Grid item xs={12}>
      {moment(productionRequest.createdAt).format('DD/MM/YY HH:mm:ss')} -{' '}
      {`${productionRequest.productionLine.name} (${productionRequest.createdBy.name ||
        productionRequest.createdBy.email})`}
      <Table className={classes.table}>
        <TableBody>{productionRequest.items.map(renderItem)}</TableBody>
      </Table>
    </Grid>
  )

  return (
    <DialogContent className={classes.root}>
      <Grid container spacing={1}>
        {productionRequests?.map(renderProductionRequest)}
      </Grid>
    </DialogContent>
  )
}

ProductionRequestsContent.propTypes = {
  productionRequests: PropTypes.array
}

ProductionRequestsContent.defaultProps = {
  productionRequests: []
}

export default ProductionRequestsContent
