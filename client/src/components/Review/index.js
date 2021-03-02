import React, { PureComponent } from 'react'
import { Field } from 'react-final-form'

import { Select } from 'final-form-material-ui'

import Grid from '@material-ui/core/Grid'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'

import styled from './styles'

class Review extends PureComponent {
  renderProducts = () => {
    const { classes, products } = this.props
    return (
      <React.Fragment>
        {products.map(product => (
          <ListItem className={classes.listItem} key={product.name}>
            <ListItemText primary={product.name} secondary={product.desc} />
            <Typography variant='body2'>{product.price}</Typography>
          </ListItem>
        ))}
      </React.Fragment>
    )
  }

  renderPayments = () => {
    const { payments } = this.props
    return (
      <React.Fragment>
        {payments.map(payment => (
          <React.Fragment key={payment.name}>
            <Grid item xs={6}>
              <Typography gutterBottom>{payment.name}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography gutterBottom>{payment.detail}</Typography>
            </Grid>
          </React.Fragment>
        ))}
      </React.Fragment>
    )
  }

  render () {
    const { classes, addresses } = this.props

    return (
      <React.Fragment>
        <Typography variant='h6' gutterBottom>
          Resumo
        </Typography>
        <Field
          fullWidth
          required
          name='plan'
          component={Select}
          label='Selecione um plano'
          formControlProps={{ fullWidth: true }}
        >
          <MenuItem value={process.env.REACT_APP_PAGSEGURO_MONTHLY_PLAN}>Plano Mensal - R$ 99,00</MenuItem>
          <MenuItem value={process.env.REACT_APP_PAGSEGURO_YEARLY_PLAN}>Plano Anual - R$ 999,00</MenuItem>
        </Field>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant='h6' gutterBottom className={classes.title}>
              Endereço
            </Typography>
            <Typography gutterBottom>{addresses.join(', ')}</Typography>
          </Grid>
          <Grid item container direction='column' xs={12} sm={6}>
            <Typography variant='h6' gutterBottom className={classes.title}>
              Detalhes de pagamento
            </Typography>
            <Grid container>
              {this.renderPayments()}
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    )
  }
}

export default styled(Review)
