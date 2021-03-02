import React from 'react'

import PropTypes from 'prop-types'

import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import ApartmentIcon from '@material-ui/icons/Apartment'
import StoreFrontIcon from '@material-ui/icons/Storefront'

import useStyles from './styles'

const InternalStep = ({ onSubmit }) => {
  const classes = useStyles()

  const handleSubmit = (internal) => () => {
    onSubmit(internal)
  }

  return (
    <DialogContent className={classes.root}>
      <Grid container justify='center' direction='column' alignItems='stretch' spacing={3}>
        <Grid item>
          <Card>
            <CardActionArea onClick={handleSubmit(true)}>
              <CardContent>
                <Typography gutterBottom variant='h5' component='h2'>
                  <StoreFrontIcon /> Produto interno
                </Typography>
                <Typography variant='body2' color='textSecondary' component='p'>
                  Produto é feito por você e não tem código de barras do fabricante. Ex: prato de
                  comida
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item>
          <Card>
            <CardActionArea onClick={handleSubmit(false)}>
              <CardContent>
                <Typography gutterBottom variant='h5' component='h2'>
                  <ApartmentIcon /> Produto externo
                </Typography>
                <Typography variant='body2' color='textSecondary' component='p'>
                  Produto tem código de barras do fabricante. Ex: uma lata de coca-cola
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </DialogContent>
  )
}

InternalStep.propTypes = {
  onSubmit: PropTypes.func
}

export default InternalStep
