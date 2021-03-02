import React, { useState } from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'

import AddCircleOutline from '@material-ui/icons/AddCircleOutline'

import TextField from 'src/components/TextField'

import useStyles from './styles'

const validate = (values) => {
  const errors = {}

  if (!values.name) {
    errors.name = 'Digite um nome para o complemento'
  }

  return errors
}

const NewModifierForm = ({ modifier, onModifierItemAdd, onSubmit }) => {
  const classes = useStyles()

  const [newModifier, setNewModifier] = useState(false)

  const { form, values, invalid, pristine, submitting } = useForm({
    initialValues: modifier,
    onSubmit,
    validate
  })

  const name = useField('name', form)

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(values.name)
  }

  const handleNewModifier = (event) => {
    event.preventDefault()
    setNewModifier(true)
  }

  const handleNewModifierItem = (event) => {
    event.preventDefault()
    onModifierItemAdd()
  }

  return (
    <Grid
      className={classes.root}
      container
      component='form'
      autoComplete='off'
      onSubmit={handleSubmit}
    >
      {newModifier ? (
        <>
          <Grid item xs={8}>
            <TextField
              {...name}
              type='text'
              label='Nome do complemento'
              placeholder='Ex.: Escolha sua batata'
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <Button
              variant='outlined'
              color='primary'
              size='small'
              type='submit'
              disabled={submitting || pristine || invalid}
            >
              Salvar
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant='outlined'
              color='primary'
              size='small'
              startIcon={<AddCircleOutline />}
              disabled={!modifier?.name}
              onClick={handleNewModifierItem}
            >
              Novo item
            </Button>
          </Grid>
        </>
      ) : (
        <Grid item>
          <Button
            variant='outlined'
            color='primary'
            size='small'
            startIcon={<AddCircleOutline />}
            onClick={handleNewModifier}
          >
            Novo complemento
          </Button>
        </Grid>
      )}
    </Grid>
  )
}

NewModifierForm.propTypes = {
  modifier: PropTypes.object,
  onModifierItemAdd: PropTypes.func,
  onSubmit: PropTypes.func
}

NewModifierForm.defaultProps = {
  onModifierItemAdd: () => {},
  onSubmit: () => {}
}

export default NewModifierForm
