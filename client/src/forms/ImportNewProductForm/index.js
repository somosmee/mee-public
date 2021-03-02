import React, { PureComponent } from 'react'
import { Form, Field } from 'react-final-form'

import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Grid from '@material-ui/core/Grid'
import MenuItem from '@material-ui/core/MenuItem'

import TextFieldCustom from 'src/components/TextField'

import { Measurements } from 'src/utils/enums'

import styled from './styles'

const validate = (values) => {
  const errors = {}

  if (!values.gtin) {
    errors.gtin = 'Código de barras em branco'
  }

  if (!values.name) {
    errors.name = 'Nome em branco'
  }

  if (isNaN(values.price)) {
    errors.price = 'Preço em branco'
  }

  if (!values.measurement) {
    errors.measurement = 'Medida em branco'
  }

  if (!values.ncm) {
    errors.ncm = 'NCM em branco'
  }

  return errors
}

class ImportNewProductForm extends PureComponent {
  disableSubmit = (submitting, pristine, invalid) => {
    const { product } = this.props
    return product ? submitting || invalid : submitting || pristine || invalid
  }

  /**
   * Handle functions
   */

  handleCancelClick = (e) => {
    e.stopPropagation()
    const { onClose } = this.props
    onClose()
  }

  handleRemoveClick = (e) => {
    const { onRemove } = this.props
    onRemove(e)
  }

  handleSubmit = (values) => {
    const { onSubmit } = this.props
    const product = {
      ...values,
      price: parseFloat(values.price, 10)
    }
    onSubmit(product)
  }

  renderMenuItem = (key) => {
    const { classes } = this.props

    return (
      <MenuItem className={classes.menuItem} key={key} value={Measurements[key].type}>
        {Measurements[key].label}
      </MenuItem>
    )
  }

  render() {
    const { classes, product } = this.props
    const margin = 'dense'
    const measurement =
      product.measurement && Measurements[product.measurement]
        ? Measurements[product.measurement].type
        : ''

    return (
      <Form
        onSubmit={this.handleSubmit}
        initialValues={{ ...product, measurement }}
        validate={validate}
        render={({ handleSubmit, submitting, pristine, invalid }) => (
          <form autoComplete='off' onSubmit={handleSubmit}>
            <DialogTitle className={classes.title}>Novo produto</DialogTitle>
            <DialogContent>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <Field
                    name='gtin'
                    component={TextFieldCustom}
                    type='text'
                    label='Código de barras'
                    margin={margin}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  <Field
                    name='price'
                    component={TextFieldCustom}
                    type='text'
                    label='Preço'
                    margin={margin}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  <Field
                    name='measurement'
                    component={TextFieldCustom}
                    type='text'
                    select
                    label='Medida'
                    margin={margin}
                    fullWidth
                  >
                    {Object.keys(Measurements).map(this.renderMenuItem)}
                  </Field>
                </Grid>
                <Grid item xs={4}>
                  <Field
                    name='ncm'
                    component={TextFieldCustom}
                    type='text'
                    label='NCM'
                    margin={margin}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    name='name'
                    component={TextFieldCustom}
                    type='text'
                    label='Nome do produto'
                    margin={margin}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    name='description'
                    component={TextFieldCustom}
                    type='text'
                    label='Descrição do produto'
                    multiline
                    rows='2'
                    margin={margin}
                    fullWidth
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
                Adicionar
              </Button>
            </DialogActions>
          </form>
        )}
      />
    )
  }
}

export default styled(ImportNewProductForm)
