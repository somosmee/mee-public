import React from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import BusinessIcon from '@material-ui/icons/Business'
import DescriptionIcon from '@material-ui/icons/Description'
import LinkIcon from '@material-ui/icons/Link'
import PhoneIcon from '@material-ui/icons/Phone'

import IdIcon from 'src/icons/id-icon'

import TextField from 'src/components/TextField'

import useStyles from './styles'

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

const UpsertSupplierForm = ({ supplier, actions, onSubmit }) => {
  const classes = useStyles()
  const theme = useTheme()
  const upSmall = useMediaQuery(theme.breakpoints.up('sm')) || true

  const { form, values, invalid, pristine, submitting } = useForm({
    initialValues: supplier,
    onSubmit,
    validate
  })

  const displayName = useField('displayName', form)
  const name = useField('name', form)
  const nationalId = useField('nationalId', form)
  const phone = useField('phone', form)
  const url = useField('url', form)
  const description = useField('description', form)

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(values)
  }

  const xs = upSmall ? 6 : 12

  return (
    <form className={classes.root} autoComplete='off' onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            {...displayName}
            type='text'
            label='Nome de exibição'
            placeholder='Ex.: Mee'
            required
            fullWidth
          />
        </Grid>
        <Grid className={classes.gridItem} item xs={xs}>
          <IdIcon className={classes.icon} />
          <TextField {...nationalId} type='text' label='CNPJ' required fullWidth />
        </Grid>
        <Grid className={classes.gridItem} item xs={xs}>
          <BusinessIcon className={classes.icon} />
          <TextField {...name} type='text' label='Razão social' required fullWidth />
        </Grid>
        <Grid className={classes.gridItem} item xs={xs}>
          <PhoneIcon className={classes.icon} />
          <TextField {...phone} type='tel' label='Telefone' fullWidth />
        </Grid>
        <Grid className={classes.gridItem} item xs={xs}>
          <LinkIcon className={classes.icon} />
          <TextField {...url} type='text' label='Website' fullWidth />
        </Grid>
        <Grid className={classes.gridItem} item xs={12}>
          <DescriptionIcon className={classes.icon} />
          <TextField {...description} type='text' rows='2' label='Descrição' fullWidth />
        </Grid>
        {actions && (
          <Grid item xs={12}>
            {actions(submitting, pristine, invalid, handleSubmit)}
          </Grid>
        )}
      </Grid>
    </form>
  )
}

UpsertSupplierForm.propTypes = {
  supplier: PropTypes.object,
  actions: PropTypes.func,
  onSubmit: PropTypes.func
}

UpsertSupplierForm.defaultProps = {
  onSubmit: () => {}
}

export default UpsertSupplierForm
