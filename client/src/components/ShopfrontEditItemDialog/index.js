import React, { useState, forwardRef } from 'react'

import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import DialogContent from '@material-ui/core/DialogContent'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Slide from '@material-ui/core/Slide'
import Typography from '@material-ui/core/Typography'

import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'

import Dialog from 'src/components/Dialog'

import useStyles from './styles'

const Transition = forwardRef((props, ref) => <Slide direction='up' ref={ref} {...props} />)

Transition.displayName = 'Transition'

const ShopfrontEditItemDialog = ({ open, item, onClose, onExited, onSubmit }) => {
  /**
   * CLASSES & STYLES
   */
  const classes = useStyles()

  /**
   * REACT STATE
   */

  const [quantity, setQuantity] = useState(item?.quantity || 1)

  /**
   * VIEW CONTROLLER
   */

  const handleAddQuantity = () => {
    setQuantity(quantity + 1)
  }

  const handleSubtractQuantity = () => {
    setQuantity(quantity - 1)
  }

  const handleExit = () => {
    setQuantity(1)
    onExited()
  }

  const handleSubmit = () => {
    onSubmit({ ...item, quantity })
  }

  return (
    <Dialog
      className={classes.root}
      open={open}
      onClose={onClose}
      onExited={handleExit}
      TransitionComponent={Transition}
      position='bottom'
    >
      <DialogContent>
        <Grid container direction='column' spacing={3}>
          <Grid item container justify='center'>
            <Typography variant='h6'>{item?.name}</Typography>
          </Grid>
          <Grid item>
            <Button fullWidth color='primary'>
              Revisar detalhes do pedido
            </Button>
          </Grid>
          <Grid item>
            <Divider className={classes.dividerCart} />
          </Grid>
          <Grid item container direciton='row' justify='space-between' alignItems='center'>
            <Grid xs={6} item container direciton='row' justify='center' alignItems='center'>
              <IconButton
                onClick={handleSubtractQuantity}
                disabled={quantity === 0}
                aria-label='remover'
              >
                <RemoveIcon color='primary' fontSize='medium' />
              </IconButton>
              <Typography variant='h6' gutterBottom>
                {quantity}
              </Typography>
              <IconButton onClick={handleAddQuantity} aria-label='adicionar'>
                <AddIcon color='primary' fontSize='medium' />
              </IconButton>
            </Grid>
            <Grid xs={6} item>
              <Button onClick={handleSubmit} color='primary' variant='contained'>
                {quantity === 0 && 'Remover'}
                {quantity !== 0 && `Atualizar R$ ${(quantity * item?.price).toFixed(2)}`}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

ShopfrontEditItemDialog.propTypes = {
  open: PropTypes.bool,
  item: PropTypes.object,
  onClose: PropTypes.func,
  onExited: PropTypes.func,
  onSubmit: PropTypes.func
}

ShopfrontEditItemDialog.defaultProps = {
  open: false,
  item: {},
  onClose: () => {},
  onExited: () => {},
  onSubmit: () => {}
}

export default ShopfrontEditItemDialog
