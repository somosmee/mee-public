import React from 'react'

import PropTypes from 'prop-types'

import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import ShopfrontListItem from 'src/components/ShopfrontListItem'

import useStyles from './styles'

const ShopfrontPublic = ({ shopfront, onSelect }) => {
  /**
   * CLASSES & STYLES
   */
  const classes = useStyles()

  /**
   * VIEW CONTROLLER
   */
  const handleSelectProduct = (item) => () => {
    onSelect(item)
  }

  return (
    <Grid className={classes.productsContainer} item container component={Paper}>
      <Grid xs={12} item>
        <Box className={classes.images}>
          <Avatar
            className={classes.banner}
            alt={shopfront.name}
            variant='rounded'
            src={shopfront.banner}
          />
          <Avatar className={classes.picture} alt={shopfront.name} src={shopfront.picture} />
        </Box>
      </Grid>
      <Grid xs={12} item>
        <Typography alignText='left' variant='h4' gutterBottom>
          {shopfront.name || 'Produtos'}
        </Typography>
      </Grid>
      <Grid className={classes.listContainer} xs={12} item>
        <Paper elevation={0}>
          <List className={classes.table}>
            {shopfront.products?.map((product) => (
              <>
                <ShopfrontListItem data={product} onClick={handleSelectProduct} />
                <Divider />
              </>
            ))}
          </List>
        </Paper>
      </Grid>
    </Grid>
  )
}

ShopfrontPublic.propTypes = {
  shopfront: PropTypes.object,
  onSelect: PropTypes.func
}

ShopfrontPublic.defaultProps = {
  shopfront: {},
  onSelect: () => {}
}

export default ShopfrontPublic
