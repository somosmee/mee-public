import React from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import TextFieldMasked from 'src/components/TextFieldMasked'

import useStyles from './styles'

const validate = (values) => {
  const errors = {}

  if (!values.mobile) {
    errors.mobile = 'Celular em branco'
  }

  return errors
}

const SetupContactForm = ({ initialValues, actions, onSubmit }) => {
  const classes = useStyles()
  const { form, handleSubmit, pristine, invalid, submitting } = useForm({
    initialValues,
    onSubmit,
    validate
  })

  const mobile = useField('mobile', form)

  const margin = 'dense'

  return (
    <Grid
      className={classes.root}
      container
      component='form'
      autoComplete='off'
      onSubmit={handleSubmit}
      spacing={3}
    >
      <Grid item xs={12}>
        <TextFieldMasked
          {...mobile}
          type='text'
          required
          label='Celular'
          margin={margin}
          fullWidth
          placeholder='(11) 987762113'
          mask={[
            '(',
            /\d/,
            /\d/,
            ')',
            ' ',
            /\d/,
            /\d/,
            /\d/,
            /\d/,
            /\d/,
            '-',
            /\d/,
            /\d/,
            /\d/,
            /\d/
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant='subtitle1' color='textSecondary' gutterBottom>
          Nossa equipe entrará em contato para tirar dúvidas e te ajudar no que você precisar.
        </Typography>
      </Grid>
      <Grid item xs={12}></Grid>
      {actions && actions(submitting, pristine, invalid, handleSubmit)}
    </Grid>
  )
}

SetupContactForm.propTypes = {
  initialValues: PropTypes.object,
  actions: PropTypes.func,
  onSubmit: PropTypes.func
}

SetupContactForm.defaultProps = {
  initialValues: {}
}

export default SetupContactForm
