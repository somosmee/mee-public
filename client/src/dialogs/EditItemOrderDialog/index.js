import React, { useState, useEffect } from 'react'

import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'

import useStyles from './styles'

const EditItemOrderDialog = ({ note, onSubmit }) => {
  const classes = useStyles()
  const [value, setValue] = useState(note)

  useEffect(() => {
    setValue(note)
  }, [note])

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const handleSubmit = () => {
    onSubmit(value)
  }

  return (
    <>
      <DialogTitle id='dialog-title'>Adicionar observação</DialogTitle>
      <DialogContent className={classes.content}>
        <TextField
          className={classes.textField}
          label='Observação'
          multiline
          rows='5'
          rowsMax='5'
          value={value}
          onChange={handleChange}
          margin='normal'
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button type='submit' color='primary' onClick={handleSubmit}>
          Salvar
        </Button>
      </DialogActions>
    </>
  )
}

export default EditItemOrderDialog
