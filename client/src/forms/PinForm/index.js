import React, { useRef, useEffect } from 'react'

import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'

import useStyles from './styles'

const PinForm = ({ onSubmit }) => {
  const classes = useStyles()

  const inputRef1 = useRef()
  const inputRef2 = useRef()
  const inputRef3 = useRef()
  const inputRef4 = useRef()

  useEffect(() => {
    inputRef1.current.focus()
  }, [])

  const handleChange = (input, next) => (event) => {
    const value = event.target?.value

    if (value) {
      const digit = value[0] || ''
      input.current.value = digit
      if (next) {
        next.current.focus()
      } else {
        if (
          inputRef1.current.value &&
          inputRef2.current.value &&
          inputRef3.current.value &&
          inputRef4.current.value
        ) {
          const pin =
            inputRef1.current.value +
            inputRef2.current.value +
            inputRef3.current.value +
            inputRef4.current.value

          onSubmit({ pin })
        }
      }
    } else {
      input.current.value = ''
      input.current.focus()
    }
  }

  const handleKeyUp = (previous) => (event) => {
    if (event.key === 'Backspace') {
      previous.current.focus()
    }
  }

  return (
    <Grid
      className={classes.root}
      container
      component='form'
      justify='space-evenly'
      autoComplete='off'
    >
      <Grid item>
        <TextField
          id='pin1'
          type='tel'
          inputRef={inputRef1}
          InputProps={{ classes: { input: classes.input } }}
          onChange={handleChange(inputRef1, inputRef2)}
          variant='outlined'
        />
      </Grid>
      <Grid item>
        <TextField
          id='pin2'
          type='tel'
          inputRef={inputRef2}
          InputProps={{ classes: { input: classes.input } }}
          onChange={handleChange(inputRef2, inputRef3)}
          onKeyUp={handleKeyUp(inputRef1)}
          variant='outlined'
        />
      </Grid>
      <Grid item>
        <TextField
          id='pin3'
          type='tel'
          inputRef={inputRef3}
          InputProps={{ classes: { input: classes.input } }}
          onChange={handleChange(inputRef3, inputRef4)}
          onKeyUp={handleKeyUp(inputRef2)}
          variant='outlined'
        />
      </Grid>
      <Grid item>
        <TextField
          id='pin4'
          type='tel'
          inputRef={inputRef4}
          InputProps={{ classes: { input: classes.input } }}
          onChange={handleChange(inputRef4)}
          onKeyUp={handleKeyUp(inputRef3)}
          variant='outlined'
        />
      </Grid>
    </Grid>
  )
}

PinForm.propTypes = {
  onSubmit: PropTypes.func
}

PinForm.defaultProps = {
  onSubmit: () => {}
}

export default PinForm
