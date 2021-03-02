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

import { DeliveryTypes } from 'src/utils/enums'

import useStyles from './styles'

const ShippingSelectionStep = ({
  byPassAddress,
  addresses,
  value,
  onChange,
  onEdit,
  onDelete,
  onAddNew,
  onSubmit
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const upMedium = useMediaQuery(theme.breakpoints.up('md')) || true

  const handleChange = (address) => () => {
    onChange && onChange(address)
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
    const address = addresses.find((address) => address._id === value)
    const delivery = { address, method: DeliveryTypes.delivery.type }
    onSubmit({ delivery })
  }

  const renderAddress = (address, index) => {
    const currentAddressId = address._id
    const checked = currentAddressId === value

    return (
      <Paper className={classes.addressPaper} key={index}>
        <ListItem alignItems='flex-start' onClick={handleChange(address)}>
          {onChange && (
            <ListItemIcon className={classes.listItemIcon}>
              <Radio
                edge='start'
                color='primary'
                checked={checked}
                value={address._id}
                disableRipple
                inputProps={{ 'aria-labelledby': address.street }}
              />
            </ListItemIcon>
          )}
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
        <CardActions
          className={classNames(classes.addressActions, { [classes.paddingLeft]: onChange })}
          disableSpacing={!upMedium}
        >
          {!upMedium && <Divider variant='middle' light />}
          <Button
            id='edit-address'
            className={classNames({ [classes.button]: !upMedium })}
            size='small'
            color='primary'
            onClick={handleEdit(address)}
          >
            Editar
          </Button>
          {!upMedium && <Divider variant='middle' light />}
          <Button
            id='delete-address'
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

  const hasAddress = !!addresses.length
  const hasSelection = !!value

  return (
    <>
      <DialogContent className={classes.content}>
        <Button
          id='add-address'
          variant='outlined'
          color='primary'
          size='large'
          fullWidth
          startIcon={<AddCircle />}
          onClick={handleAddNew}
        >
          Adicionar endereço
        </Button>
        {hasAddress && <List id='addresses'>{addresses.map(renderAddress)}</List>}
      </DialogContent>
      {(byPassAddress || hasAddress) && onSubmit && (
        <Paper className={classes.paper} elevation={10}>
          <DialogActions>
            <Button
              variant='contained'
              color='primary'
              size='large'
              fullWidth={!upMedium}
              disabled={!(byPassAddress || hasSelection)}
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

ShippingSelectionStep.propTypes = {
  addresses: PropTypes.arrayOf(PropTypes.object),
  value: PropTypes.string,
  onChange: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onAddNew: PropTypes.func,
  onSubmit: PropTypes.func,
  byPassAddress: PropTypes.bool
}

ShippingSelectionStep.defaultProps = {
  onEdit: () => {},
  onDelete: () => {},
  onAddNew: () => {}
}

export default ShippingSelectionStep
