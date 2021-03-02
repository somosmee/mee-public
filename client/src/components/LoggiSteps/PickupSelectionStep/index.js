import React from 'react'

import classNames from 'classnames'
import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import CardActions from '@material-ui/core/CardActions'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import Radio from '@material-ui/core/Radio'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import AddCircle from '@material-ui/icons/AddCircle'

import useStyles from './styles'

const PickupSelectionStep = ({ addresses, onChange, onEdit, onDelete, onAddNew, onSubmit }) => {
  const classes = useStyles()
  const theme = useTheme()
  const upMedium = useMediaQuery(theme.breakpoints.up('md')) || true

  const handleChange = (address) => () => {
    onChange(address)
  }

  const handleEdit = (address) => () => {
    onEdit(address)
  }

  const handleDelete = ({ _id }) => () => {
    onDelete(_id)
  }

  const handleAddNew = () => {
    onAddNew()
  }

  const handleSubmit = () => {
    const [address] = addresses
    onSubmit(address)
  }

  const renderAddress = (address, index) => {
    const checked = true

    return (
      <Paper className={classes.paper} key={index}>
        <ListItem alignItems='flex-start' onClick={handleChange(address)}>
          <ListItemIcon className={classes.listItemIcon}>
            <Radio
              edge='start'
              color='primary'
              checked={checked}
              value={0}
              disableRipple
              inputProps={{ 'aria-labelledby': address.street }}
            />
          </ListItemIcon>
          <ListItemText
            primary={`${address.street} ${address.number ? address.number : ''}`}
            secondary={
              `${address.complement ? `${address.complement}, ` : ''}` +
              `${address.district}` +
              ` - ${address.city}` +
              `, ${address.state} ` +
              `- CEP ${address.postalCode}`
            }
          />
        </ListItem>
        <CardActions className={classes.cardActions} disableSpacing={!upMedium}>
          {!upMedium && <Divider variant='middle' light />}
          <Button
            className={classNames({ [classes.button]: !upMedium })}
            size='small'
            color='primary'
            onClick={handleEdit(address)}
          >
            Editar
          </Button>
          {!upMedium && <Divider variant='middle' light />}
          <Button
            className={classNames({ [classes.button]: !upMedium })}
            size='small'
            color='primary'
            onClick={handleDelete(address)}
          >
            Remover
          </Button>
        </CardActions>
      </Paper>
    )
  }

  const hasAddress = addresses && !!addresses.length
  const hasSelection = true

  return (
    <>
      <DialogContent className={classes.content}>
        {hasAddress && (
          <List>
            {addresses.map(renderAddress)}
          </List>
        )}
        {!hasAddress && (
          <Button
            variant='outlined'
            color='primary'
            size='large'
            fullWidth
            startIcon={<AddCircle />}
            onClick={handleAddNew}
          >
            Adicionar endereço
          </Button>
        )}
      </DialogContent>
      {hasAddress && (
        <Paper className={classes.actionPaper} elevation={10}>
          <DialogActions className={classes.actions}>
            <Button
              variant='contained'
              color='primary'
              size='large'
              fullWidth={!upMedium}
              disabled={!hasSelection}
              onClick={handleSubmit}
            >
              Continuar
            </Button>
          </DialogActions>
        </Paper>
      )}
    </>
  )
}

PickupSelectionStep.propTypes = {
  addresses: PropTypes.array,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onAddNew: PropTypes.func,
  onSubmit: PropTypes.func
}

PickupSelectionStep.defaultProps = {
  onChange: () => {},
  onEdit: () => {},
  onDelete: () => {},
  onAddNew: () => {},
  onSubmit: () => {}
}

export default PickupSelectionStep
