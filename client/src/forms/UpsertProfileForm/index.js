import React, { useState } from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'

import TextField from 'src/components/TextField'
import Upload from 'src/components/Upload'

import useStyles from './styles'

const accept = 'image/jpeg, image/jpg, image/png'

const validate = (values) => {
  const errors = {}

  if (!values.name) {
    errors.name = 'Nome da loja em branco'
  }

  return errors
}

const UpsertProfileForm = ({ user, actions, onSubmit }) => {
  const classes = useStyles()

  const [banner, setBanner] = useState(null)
  const [picture, setPicture] = useState(null)

  const { form, values, pristine, invalid, submitting } = useForm({
    initialValues: user,
    onSubmit,
    validate
  })

  const name = useField('name', form)
  const nationalId = useField('nationalId', form)
  const stateId = useField('stateId', form)
  const description = useField('description', form)

  const handleBannerChange = (banner) => {
    setBanner(banner)
  }

  const handlePictureChange = (picture) => {
    setPicture(picture)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const profile = {
      name: values.name,
      nationalId: values.nationalId,
      stateId: values.stateId,
      description: values.description
    }

    if (banner) profile.banner = banner
    if (picture) profile.picture = picture

    onSubmit(profile)
  }

  const margin = 'dense'

  return (
    <Grid
      className={classes.root}
      container
      component='form'
      autoComplete='off'
      onSubmit={handleSubmit}
      spacing={1}
    >
      <Grid item xs={12}>
        <Box className={classes.images}>
          <Upload
            className={classes.banner}
            src={user.banner}
            variant='square'
            accept={accept}
            onChange={handleBannerChange}
          />
          <Upload
            className={classes.picture}
            src={user.picture}
            accept={accept}
            onChange={handlePictureChange}
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <TextField {...name} type='text' label='Nome da Loja' margin={margin} fullWidth />
      </Grid>
      <Grid item xs={12}>
        <TextField {...nationalId} type='text' label='CNPJ' margin={margin} fullWidth />
      </Grid>
      <Grid item xs={12}>
        <TextField {...stateId} type='text' label='Inscrição Municipal' margin={margin} fullWidth />
      </Grid>
      <Grid item xs={12}>
        <TextField
          {...description}
          type='text'
          multiline
          rows='4'
          label='Descrição da Loja'
          margin={margin}
          fullWidth
        />
      </Grid>
      {actions && actions(submitting, pristine, invalid, handleSubmit)}
    </Grid>
  )
}

export default UpsertProfileForm
