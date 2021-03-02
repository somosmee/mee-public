import React from 'react'

import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import { formatAddress } from 'src/utils/address'

import useStyles from './styles'

const OrderReceiptCompany = ({ company }) => {
  const classes = useStyles()

  return (
    <Grid className={classes.root} container item>
      <Grid item xs={12}>
        <Typography className={classes.title} align='center'>
          {company.name}
        </Typography>
      </Grid>
      {company.address && (
        <Grid item xs={12}>
          <Typography className={classes.title} align='center'>
            {formatAddress(company.address)}
          </Typography>
        </Grid>
      )}
      {company.nationalId && (
        <Grid item xs={12}>
          <Typography className={classes.title} align='center'>
            CNPJ: {company.nationalId}
          </Typography>
        </Grid>
      )}
    </Grid>
  )
}

OrderReceiptCompany.propTypes = {
  company: PropTypes.shape({
    name: PropTypes.string,
    nationalId: PropTypes.string,
    address: PropTypes.object
  })
}

OrderReceiptCompany.defaultProps = {}

export default OrderReceiptCompany
