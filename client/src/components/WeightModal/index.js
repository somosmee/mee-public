import React, { PureComponent } from 'react'
import NumberFormat from 'react-number-format'

import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/Input'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  input: {
    fontSize: '3rem'
  },
  adornment: {
    fontSize: '3rem'
  }
})

class WeightModal extends PureComponent {
    state = {
      weight: ''
    }

    onWeightChange = (values) => {
      const { value } = values
      this.setState(() => ({ weight: value }))
    }

    onCancelClick = (e) => {
      this.props.onClose(e)
    }

    onSubmit = (e) => {
      e.preventDefault()
      const { weight } = this.state

      if (!isNaN(weight)) {
        this.props.onConfirm(parseFloat(weight))
      }
    }

    render() {
      const { classes } = this.props
      const { weight } = this.state

      return (
        <form onSubmit={this.onSubmit}>
          <DialogTitle id='form-dialog-title'>Peso</DialogTitle>
          <DialogContent>
            <NumberFormat
              className={classes.input}
              autoFocus
              customInput={TextField}
              value={weight}
              onValueChange={this.onWeightChange}
              placeholder='0.00 Kg'
              suffix=' Kg'
              allowNegative={false}
              inputProps={{ 'aria-label': 'Peso' }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              color='secondary'
              onClick={this.onCancelClick}
            >
              Voltar
            </Button>
            <Button
              color='primary'
              type='submit'
            >
              Finalizar
            </Button>
          </DialogActions>
        </form>
      )
    }
}

export default withStyles(styles)(WeightModal)
