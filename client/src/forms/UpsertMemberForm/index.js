import React, { useEffect, useRef } from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'
import MenuItem from '@material-ui/core/MenuItem'

import TextField from 'src/components/TextField'

import { MemberRoles } from 'src/utils/enums'

import useStyles from './styles'

const UpsertMemberForm = ({ initialValues, actions, onSubmit }) => {
  const classes = useStyles()

  const inputEmail = useRef()

  useEffect(() => {
    inputEmail.current.focus()
  }, [])

  /* FORM */
  const { form, handleSubmit, invalid, pristine, submitting } = useForm({
    initialValues,
    onSubmit
  })

  /* FORM FIELDS */
  const email = useField('email', form)
  const role = useField('role', form)

  const renderMenuItem = (key) => {
    return (
      <MenuItem key={key} value={MemberRoles[key].value}>
        {MemberRoles[key].label}
      </MenuItem>
    )
  }

  return (
    <>
      <Grid
        className={classes.root}
        container
        spacing={3}
        component='form'
        autoComplete='off'
        onSubmit={handleSubmit}
      >
        <Grid item justify='center' xs={12}>
          <TextField
            required
            {...email}
            type='text'
            label='Email'
            inputRef={inputEmail}
            fullWidth
          />
        </Grid>
        <Grid item justify='center' xs={12}>
          <TextField required select {...role} type='text' label='Função' fullWidth>
            {Object.keys(MemberRoles).map(renderMenuItem)}
          </TextField>
        </Grid>
      </Grid>
      {actions && actions(invalid, pristine, submitting, handleSubmit)}
    </>
  )
}

UpsertMemberForm.propTypes = {
  initialValues: PropTypes.object,
  actions: PropTypes.func,
  onSubmit: PropTypes.func
}

UpsertMemberForm.defaultProps = {
  onSubmit: () => {}
}

export default UpsertMemberForm
