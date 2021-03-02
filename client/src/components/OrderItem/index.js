import React from 'react'

import PropTypes from 'prop-types'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import AddCircle from '@material-ui/icons/AddCircleOutlined'
import Comment from '@material-ui/icons/CommentOutlined'
import Delete from '@material-ui/icons/Delete'
import RemoveCircle from '@material-ui/icons/RemoveCircleOutlined'

import { Measurements } from 'src/utils/enums'
import numeral from 'src/utils/numeral'

import useStyles from './styles'

const OrderItem = ({
  index,
  item,
  onAddNote,
  onDelete,
  onIncrease,
  onDecrease,
  onQuantityChange
}) => {
  const classes = useStyles()

  const handleDecrease = (event) => {
    onDecrease(index, item)
  }

  const handleIncrease = (event) => {
    onIncrease(index, item)
  }

  const handleAddNote = (event) => {
    onAddNote(index, item)
  }

  const handleDelete = (event) => {
    onDelete(index)
  }

  const handleQuantityChange = (event) => {
    onQuantityChange(index, item, event.target.value)
  }

  return (
    <Card className={classes.root} elevation={0} square>
      <CardContent className={classes.content}>
        <Grid container>
          <Grid container item alignItems='center'>
            <Grid item xs>
              <Typography className={classes.name}>{item.name}</Typography>
              <Typography className={classes.name} color='textSecondary' gutterBottom>
                {item.description}
              </Typography>
              <Typography className={classes.note} variant='body2' color='textSecondary'>
                {item.note}
              </Typography>
            </Grid>
            {item.measurement === Measurements.unit.type && (
              <Grid item>
                <IconButton disableRipple onClick={handleIncrease}>
                  <AddCircle />
                </IconButton>
                <Typography align='center'>{item.quantity}</Typography>
                <IconButton disableRipple onClick={handleDecrease}>
                  <RemoveCircle />
                </IconButton>
              </Grid>
            )}
            {item.measurement === Measurements.kilogram.type && (
              <Grid item>
                <TextField
                  value={item.quantity}
                  name='quantity'
                  variant='outlined'
                  type='number'
                  label='Quantidade'
                  required
                  fullWidth
                  onChange={handleQuantityChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        {Measurements[item.measurement].symbol}
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            )}
          </Grid>
          <Grid container item alignItems='center'>
            <Grid item xs>
              <Typography>{numeral(item.price).format('$ 0.00')}</Typography>
            </Grid>
            <Grid item xs>
              <IconButton disableRipple onClick={handleAddNote}>
                <Comment />
              </IconButton>
              <IconButton disableRipple onClick={handleDelete}>
                <Delete />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

OrderItem.propTypes = {
  index: PropTypes.number,
  item: PropTypes.object,
  onAddNote: PropTypes.func,
  onDelete: PropTypes.func,
  onIncrease: PropTypes.func,
  onDecrease: PropTypes.func,
  onQuantityChange: PropTypes.func
}

OrderItem.defaultProps = {
  item: {},
  onAddNote: () => {},
  onDelete: () => {},
  onIncrease: () => {},
  onDecrease: () => {},
  onQuantityChange: () => {}
}

export default OrderItem
