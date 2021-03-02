import React from 'react'

import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'

import Delete from '@material-ui/icons/Delete'

import useStyles from './styles'

const Shopfront = ({ products, onDeleteProduct }) => {
  const classes = useStyles()

  const handleDeleteProduct = (product) => (event) => {
    onDeleteProduct(product)
  }

  const renderProduct = (product, index) => (
    <TableRow key={index}>
      <TableCell component='th' scope='row'>
        {product.name}
      </TableCell>
      <TableCell align='right'>{product.price}</TableCell>
      <TableCell align='right'>
        <div className={classes.actions}>
          <Tooltip title='Remover'>
            <IconButton aria-label='Remover' onClick={handleDeleteProduct(product)}>
              <Delete />
            </IconButton>
          </Tooltip>
        </div>
      </TableCell>
    </TableRow>
  )

  return (
    <Grid container justify='center'>
      <Grid className={classes.productsContainer} item container component={Paper}>
        <Grid xs={12} item>
          <Typography alignText='left' variant='h4' gutterBottom>
            Produtos
          </Typography>
        </Grid>
        <Grid className={classes.listContainer} xs={12} item>
          <TableContainer component={Paper} elevation={0}>
            <Table className={classes.table} aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell align='right'>Preço</TableCell>
                  <TableCell align='right' />
                </TableRow>
              </TableHead>
              <TableBody>{products.map(renderProduct)}</TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Grid>
  )
}

Shopfront.propTypes = {
  products: PropTypes.array,
  onDeleteProduct: PropTypes.func
}

Shopfront.defaultProps = {
  products: [],
  onDeleteProduct: () => {}
}

export default Shopfront
