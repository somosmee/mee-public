import React from 'react'

import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import { useTheme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import DeliveryBoyImage from 'src/icons/delivery.png'

import useStyles from './styles'

const LoggiSetupHeader = () => {
  const classes = useStyles()
  const theme = useTheme()
  const upSmall = useMediaQuery(theme.breakpoints.up('sm'))

  return (
    <Container className={classes.root} maxWidth='md'>
      <Grid container spacing={3}>
        <Grid item xs={upSmall ? 8 : 12}>
          <Grid item xs={12}>
            <Typography variant='h3' gutterBottom>
              Loggi
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='h4' gutterBottom>
              simplifique e agilize <br /> as suas entregas
            </Typography>
            <Typography variant='subtitle1' gutterBottom>
              {upSmall && (
                <>
                  <li>acompanhe tudo em tempo real</li>
                  <li>faça as suas entrega em poucos minutos</li>
                  <li>seja um restaurante, um ecommerce ou loja física</li>
                </>
              )}
              {!upSmall && (
                <>
                  <li>acompanhe tudo em tempo real</li>
                  <li>faça as suas entrega em poucos minutos</li>
                  <li>seja um restaurante, um ecommerce ou loja física</li>
                </>
              )}
            </Typography>
          </Grid>
        </Grid>
        {upSmall && (
          <Grid item xs={3}>
            <img className={classes.image} alt='delivery boy' src={DeliveryBoyImage} />
          </Grid>
        )}
      </Grid>
    </Container>
  )
}

export default LoggiSetupHeader
