import React from 'react'

import PropTypes from 'prop-types'

import DialogContent from '@material-ui/core/DialogContent'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import StatsDisplay from 'src/components/StatsDisplay'
import VirtualizedTable from 'src/components/VirtualizedTable'

import useStyles from './styles'

const RetentionContent = ({ retentionReport }) => {
  const classes = useStyles()

  return (
    <DialogContent className={classes.root}>
      <Grid container direction='row' spacing={3}>
        <Grid item xs={12}>
          <StatsDisplay
            primaryLabel={`${(retentionReport.retentionRate * 100).toFixed(2)}%`}
            primaryFontSize='large'
            secondaryFontSize='large'
            secondaryNumber={retentionReport.percentageDiff}
            secondaryLabel={`${(retentionReport.percentageDiff * 100).toFixed(2)}%`}
          />
        </Grid>
        <Grid item xs={12}>
          <Divider variant='middle' />
        </Grid>
        <Grid item xs={12}>
          <Typography display='block' variant='h5' gutterBottom>
            Clientes que retornaram ({retentionReport.loyalCustomers.length})
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Paper style={{ height: 400, width: '100%' }}>
            <VirtualizedTable
              color={'green'}
              rowCount={retentionReport.loyalCustomers.length}
              rowGetter={({ index }) => retentionReport.loyalCustomers[index]}
              columns={[
                {
                  width: 150,
                  label: 'Nome',
                  dataKey: 'name'
                },
                {
                  width: 120,
                  label: 'Celular',
                  dataKey: 'mobile'
                },
                {
                  width: 260,
                  label: 'Email',
                  dataKey: 'email'
                }
              ]}
            />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Typography display='block' variant='h5' gutterBottom>
            Clientes que não retornaram ({retentionReport.churnedCustomers.length})
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Paper style={{ height: 400, width: '100%' }}>
            <VirtualizedTable
              color={'red'}
              rowCount={retentionReport.churnedCustomers.length}
              rowGetter={({ index }) => retentionReport.churnedCustomers[index]}
              columns={[
                {
                  width: 150,
                  label: 'Nome',
                  dataKey: 'name'
                },
                {
                  width: 120,
                  label: 'Celular',
                  dataKey: 'mobile'
                },
                {
                  width: 260,
                  label: 'Email',
                  dataKey: 'email'
                }
              ]}
            />
          </Paper>
        </Grid>
      </Grid>
    </DialogContent>
  )
}

RetentionContent.propTypes = {
  retentionReport: PropTypes.object
}

RetentionContent.defaultProps = {
  retentionReport: {}
}

export default RetentionContent
