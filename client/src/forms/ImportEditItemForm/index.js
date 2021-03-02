import React, { PureComponent } from 'react'
import { Form, Field } from 'react-final-form'

import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import TextFieldCustom from 'src/components/TextField'

import numeral from 'src/utils/numeral'

import styled from './styles'

const validate = (values) => {
  const errors = {}

  if (!values.gtin) {
    errors.gtin = 'Código de barras em branco'
  }

  if (!values.quantity) {
    errors.quantity = 'Qunatidade em branco'
  }

  return errors
}

class ImportEditItemForm extends PureComponent {
  disableSubmit = (submitting, pristine, invalid) => {
    const { product } = this.props
    return product ? submitting || invalid : submitting || pristine || invalid
  }

  renderUnityPrice = (quantity, totalPrice) => numeral(totalPrice / quantity).format('$ 0.00')

  /**
   * Handle functions
   */

  handleCancelClick = (e) => {
    e.stopPropagation()
    const { onClose } = this.props
    onClose()
  }

  handleSubmit = ({ gtin, quantity }) => {
    const { product, onSubmit } = this.props
    onSubmit({ id: product._id, gtin, quantity: parseFloat(quantity) })
  }

  render() {
    const { classes, product } = this.props

    return (
      <Form
        onSubmit={this.handleSubmit}
        initialValues={{ ...product }}
        validate={validate}
        render={({
          handleSubmit,
          submitting,
          pristine,
          invalid,
          values: { quantity, totalPrice }
        }) => (
          <form autoComplete='off' onSubmit={handleSubmit}>
            <DialogTitle disableTypography>
              <Typography variant='h5'>Editar produto</Typography>
            </DialogTitle>
            <Divider variant='fullWidth' />
            <DialogContent className={classes.content}>
              <Typography variant='h6'>Detalhes do produto</Typography>
              <Grid className={classes.grid} container>
                <Grid item xs={12}>
                  <Field
                    name='gtin'
                    component={TextFieldCustom}
                    type='text'
                    label='Código de barras'
                    margin='dense'
                  />
                  <Typography>{product.name}</Typography>
                </Grid>
              </Grid>
              <Divider variant='middle' />
              <Grid className={classes.grid} container spacing={2}>
                <Grid item xs={4}>
                  <Field
                    name='quantity'
                    component={TextFieldCustom}
                    type='text'
                    label='Quantidade'
                    margin='none'
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label='Preço unitário'
                    margin='none'
                    value={this.renderUnityPrice(quantity, totalPrice)}
                    disabled
                    InputProps={{ disableUnderline: true }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Field
                    name='totalPrice'
                    component={TextFieldCustom}
                    type='text'
                    label='Preço total'
                    margin='none'
                    value={numeral(totalPrice).format('$ 0.00')}
                    disabled
                    InputProps={{ disableUnderline: true }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button color='secondary' onClick={this.handleCancelClick}>
                Voltar
              </Button>
              <Button
                type='submit'
                color='primary'
                disabled={this.disableSubmit(submitting, pristine, invalid)}
              >
                Atualizar
              </Button>
            </DialogActions>
          </form>
        )}
      />
    )
  }
}

export default styled(ImportEditItemForm)
