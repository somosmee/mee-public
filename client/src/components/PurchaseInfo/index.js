import React from 'react'

import moment from 'moment'

import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import ExpandMore from '@material-ui/icons/ExpandMore'

import numeral from 'src/utils/numeral'

import styled from './styles'

const PurchaseInfo = ({ classes, purchase }) => (
  <div className={classes.root}>
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMore />}>
        <Grid container alignItems='center'>
          <Grid item xs={4}>
            <Typography>{purchase.supplier.displayName}</Typography>
            <Typography className={classes.secondaryHeading}>{purchase.accessKey}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant='subtitle2'>Comprado em</Typography>
            <Typography className={classes.secondaryHeading}>
              {moment(purchase.purchasedAt).format('LLL')}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography align='right' variant='h6'>
              {numeral(purchase.items.reduce((total, item) => total + item.totalPrice, 0)).format(
                '$ 0.00'
              )}
            </Typography>
          </Grid>
        </Grid>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant='subtitle2'>Razão Social</Typography>
            <Typography>{purchase.supplier.name}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='subtitle2'>CNPJ</Typography>
            <Typography>{purchase.supplier.nationalId}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='subtitle2'>Número</Typography>
            <Typography>{purchase.number}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='subtitle2'>Série</Typography>
            <Typography>{purchase.serie}</Typography>
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  </div>
)

export default styled(PurchaseInfo)
