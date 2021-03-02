import React from 'react'

import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import { useTheme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import DeliveryBoyImage from 'src/icons/delivery.png'

import useStyles from './styles'

const IfoodSetupHeader = () => {
  const classes = useStyles()
  const theme = useTheme()
  const upSmall = useMediaQuery(theme.breakpoints.up('sm'))

  return (
    <Container className={classes.root} maxWidth='md'>
      <Grid container spacing={3}>
        <Grid item xs={upSmall ? 8 : 12}>
          <Grid item xs={12}>
            <Typography variant='h3' gutterBottom>
              iFood
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='h4' gutterBottom>
              aumente suas vendas e <br /> amplie seu negócio
            </Typography>
            <Typography variant='subtitle1' gutterBottom>
              {upSmall && (
                <>
                  <li>centralize seus pedidos com o controle do seu negócio</li>
                  <li>compare estatísticas e saiba como se destacar da concorrênca</li>
                  <li>inclua as taxas do iFood nos seus preços de forma fácil e prática</li>
                </>
              )}
              {!upSmall && (
                <>
                  <li>centralize seus pedidos</li>
                  <li>adapte seus preços de forma fácil</li>
                  <li>use dados para se destacar da concorrência</li>
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

export default IfoodSetupHeader
