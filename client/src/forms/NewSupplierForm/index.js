import React, { PureComponent } from 'react'
import { Form, Field } from 'react-final-form'

import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Grid from '@material-ui/core/Grid'
import MenuItem from '@material-ui/core/MenuItem'
import { withStyles } from '@material-ui/core/styles'

import Business from '@material-ui/icons/Business'
import Description from '@material-ui/icons/Description'
import Link from '@material-ui/icons/Link'
import Phone from '@material-ui/icons/Phone'

import IdIcon from 'src/icons/id-icon'

import TextFieldCustom from 'src/components/TextField'

import { Gender } from 'src/utils/enums'

import styles from './styles'

const validate = (values) => {
  const errors = {}

  if (!values.displayName) {
    errors.displayName = 'Nome de exibição em branco'
  }

  if (!values.name) {
    errors.name = 'Razão social em branco'
  }

  if (!values.nationalId) {
    errors.nationalId = 'CNPJ em branco'
  }

  return errors
}

class NewSupplierForm extends PureComponent {
  handleSubmit = (values) => {
    const { onSubmit } = this.props
    onSubmit(values)
  }

  renderMenuItem = (key) => {
    const { classes } = this.props

    return (
      <MenuItem className={classes.menuItem} key={key} value={Gender[key].type}>
        {Gender[key].name}
      </MenuItem>
    )
  }

  render() {
    const { classes, supplier, onClose } = this.props
    const hasSupplier = !!supplier
    const margin = 'none'
    let initialValues

    if (hasSupplier) {
      const { displayName, name, nationalId, url, phone, description } = supplier
      initialValues = {
        displayName,
        name,
        nationalId,
        url,
        phone,
        description
      }
    }

    return (
      <Form
        onSubmit={this.handleSubmit}
        initialValues={initialValues}
        validate={validate}
        render={({ handleSubmit, submitting, pristine, invalid }) => (
          <form autoComplete='off' onSubmit={handleSubmit}>
            <DialogTitle className={classes.title}>
              {hasSupplier ? 'Editar fornecedor' : 'Criar novo fornecedor'}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    id='displayName'
                    name='displayName'
                    component={TextFieldCustom}
                    type='text'
                    label='Nome de exibição'
                    margin={margin}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid className={classes.gridItem} item xs={12} sm={6}>
                  <IdIcon className={classes.icon} />
                  <Field
                    id='nationalId'
                    name='nationalId'
                    component={TextFieldCustom}
                    type='text'
                    label='CNPJ'
                    margin={margin}
                    required
                    fullWidth
                    disabled={hasSupplier}
                  />
                </Grid>
                <Grid className={classes.gridItem} item xs={12} sm={6}>
                  <Business className={classes.icon} />
                  <Field
                    id='name'
                    name='name'
                    component={TextFieldCustom}
                    type='text'
                    label='Razão social'
                    margin={margin}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid className={classes.gridItem} item xs={12} sm={6}>
                  <Phone className={classes.icon} />
                  <Field
                    id='phone'
                    name='phone'
                    component={TextFieldCustom}
                    type='tel'
                    label='Telefone'
                    margin={margin}
                    fullWidth
                  />
                </Grid>
                <Grid className={classes.gridItem} item xs={12} sm={6}>
                  <Link className={classes.icon} />
                  <Field
                    id='url'
                    name='url'
                    component={TextFieldCustom}
                    type='url'
                    label='Website'
                    margin={margin}
                    fullWidth
                  />
                </Grid>
                <Grid className={classes.gridItem} item xs={12}>
                  <Description className={classes.icon} />
                  <Field
                    id='description'
                    name='description'
                    component={TextFieldCustom}
                    type='text'
                    label='Descrição'
                    multiline
                    rows='2'
                    margin={margin}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button data-cy='cancel' color='secondary' onClick={onClose}>
                Voltar
              </Button>
              <Button
                type='submit'
                color='primary'
                disabled={submitting || pristine || invalid}
                onClick={this.onSubmit}
              >
                Salvar
              </Button>
            </DialogActions>
          </form>
        )}
      />
    )
  }
}

export default withStyles(styles)(NewSupplierForm)
