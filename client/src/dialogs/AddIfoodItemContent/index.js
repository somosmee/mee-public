import React, { useState } from 'react'

import PropTypes from 'prop-types'

import CircularProgress from '@material-ui/core/CircularProgress'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import Autocomplete from '@material-ui/lab/Autocomplete'

import ShoppingBasket from '@material-ui/icons/ShoppingBasket'

import useStyles from './styles'

const AddIfoodItemContent = ({ loading, options, onInputChange, onProductChange, onClose }) => {
  const classes = useStyles()

  const [open, setOpen] = useState(false)

  return (
    <DialogContent className={classes.root}>
      <Autocomplete
        freeSolo
        disableClearable
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        getOptionSelected={(option, value) => option.name === value.name}
        getOptionLabel={(option) => option.name}
        options={options ?? []}
        loading={loading}
        onChange={(event, newValue) => onProductChange(newValue)}
        onInputChange={(event, newInputValue) => onInputChange(newInputValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label='Pesquise um produto'
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color='inherit' size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              )
            }}
          />
        )}
        renderOption={(option) => (
          <Grid container alignItems='center'>
            <Grid item>
              <ShoppingBasket className={classes.icon} />
            </Grid>
            <Grid item xs>
              <Typography className={classes.name}>{option.name}</Typography>
              {option.description && (
                <Typography variant='body2' color='textSecondary'>
                  {option.description}
                </Typography>
              )}
            </Grid>
          </Grid>
        )}
      />
    </DialogContent>
  )
}

AddIfoodItemContent.propTypes = {
  loading: PropTypes.bool,
  options: PropTypes.array,
  onInputChange: PropTypes.func,
  onProductChange: PropTypes.func,
  onClose: PropTypes.func
}

AddIfoodItemContent.defaultProps = {
  loading: false,
  onFiterChange: () => {},
  onProductChange: () => {},
  onClose: () => {}
}

export default AddIfoodItemContent
