import React from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'

import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Grid from '@material-ui/core/Grid'

import SendIcon from '@material-ui/icons/Send'

import Button from 'src/components/Button'
import TextField from 'src/components/TextField'

import useStyles from './styles'

const validate = (values) => {
  const errors = {}

  if (!values.email) {
    errors.username = 'Campo obrigatório'
  }

  return errors
}

const AccountantInviteForm = ({ onSubmit, loading }) => {
  const classes = useStyles()

  const { form, values, invalid, pristine, submitting } = useForm({
    initialValues: {},
    onSubmit,
    validate
  })

  const email = useField('email', form)

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(values)
  }

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <Card className={classes.root}>
        <CardHeader
          title='Enviar Convite'
          subheader='Convide seu contador para adicionar as informações de imposto aos seus produtos'
        />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField {...email} type='text' label='Email' fullWidth />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button
            type='submit'
            color='primary'
            loading={loading}
            variant='contained'
            endIcon={<SendIcon />}
            disabled={submitting || pristine || invalid}
          >
            Enviar
          </Button>
        </CardActions>
      </Card>
    </form>
  )
}

AccountantInviteForm.propTypes = {
  loading: PropTypes.bool,
  onSubmit: PropTypes.func
}

AccountantInviteForm.defaultProps = {
  onSubmit: () => {}
}

export default AccountantInviteForm
