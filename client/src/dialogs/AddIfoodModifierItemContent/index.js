import React from 'react'

import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import Paper from '@material-ui/core/Paper'

import Loading from 'src/components/Loading'

import useStyles from './styles'

const AddIfoodModifierItemContent = ({ loading, product, items, onClose, onChange, onSubmit }) => {
  const classes = useStyles()

  const handleChange = (event) => {
    const id = event.target.name
    onChange(id)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit()
  }

  const renderFormControlLabel = (modifier) => (
    <FormControlLabel
      key={modifier.id}
      control={
        <Checkbox
          checked={items.includes(modifier.id)}
          onChange={handleChange}
          name={modifier.id}
        />
      }
      label={modifier.name}
    />
  )

  const hasModifiers = !!product?.modifiers?.length

  return (
    <DialogContent className={classes.root}>
      <form onSubmit={handleSubmit}>
        {loading ? (
          <Loading />
        ) : hasModifiers ? (
          <FormControl component='fieldset' className={classes.formControl}>
            <FormGroup>{product?.modifiers?.map(renderFormControlLabel)}</FormGroup>
          </FormControl>
        ) : (
          <DialogContentText>
            Este produto não possui adicionais cadastrados. Edite este produto e crie adicionais
            para que eles apareçam aqui.
          </DialogContentText>
        )}
        <Paper className={classes.paper}>
          <DialogActions>
            <Button type='submit' variant='contained' color='primary' disabled={!hasModifiers}>
              Pronto
            </Button>
          </DialogActions>
        </Paper>
      </form>
    </DialogContent>
  )
}

AddIfoodModifierItemContent.propTypes = {
  loading: PropTypes.bool,
  product: PropTypes.object,
  items: PropTypes.array,
  onClose: PropTypes.func,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func
}

AddIfoodModifierItemContent.defaultProps = {
  loading: false,
  onClose: () => {},
  onChange: () => {},
  onSubmit: () => {}
}

export default AddIfoodModifierItemContent
