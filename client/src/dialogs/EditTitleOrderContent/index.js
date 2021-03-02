import React, { useRef, useEffect } from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'

import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'

import Button from 'src/components/Button'
import TextField from 'src/components/TextField'

import useStyles from './styles'

const validate = (values) => {
  const errors = {}

  return errors
}

const EditTitleOrderContent = ({ loading, order, onClose, onSubmit }) => {
  const classes = useStyles()

  const { form, handleSubmit, submitting } = useForm({
    initialValues: { title: order?.title || '' },
    onSubmit,
    validate
  })

  const title = useField('title', form)

  const inputRef = useRef()

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <DialogContent className={classes.content}>
        <Typography variant='subtitle1' color='textSecondary' gutterBottom>
          Adicione um título como referência desse pedido.
        </Typography>
        <TextField
          {...title}
          id='title'
          inputRef={inputRef}
          label='Título'
          margin='dense'
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button color='secondary' size='large' variant='outlined' onClick={onClose}>
          CANCELAR
        </Button>
        <Button
          color='primary'
          variant='contained'
          type='submit'
          size='large'
          loading={loading || submitting}
        >
          SALVAR
        </Button>
      </DialogActions>
    </form>
  )
}

EditTitleOrderContent.propTypes = {
  loading: PropTypes.bool,
  order: PropTypes.object,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func
}

EditTitleOrderContent.defaultProps = {}

export default EditTitleOrderContent
