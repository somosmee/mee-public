import React, { Fragment, useState } from 'react'

import PropTypes from 'prop-types'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'

import AddCircleOutline from '@material-ui/icons/AddCircleOutline'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/EditOutlined'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import NewModifierForm from 'src/forms/NewModifierForm'

import numeral from 'src/utils/numeral'

import useStyles from './styles'

const Menu = ({
  categories,
  modifier,
  onEdit,
  onDelete,
  onItemUnlink,
  onItemAvailabilityChange,
  onItemAdd,
  onModifierNameSubmit,
  onModifierItemAdd,
  onModifierDelete,
  onModifierAvailabilityChange
}) => {
  const classes = useStyles()
  const [expanded, setExpanded] = useState(false)

  const handleExpansionPanelChange = (panel) => (event, expanded) => {
    setExpanded(expanded ? panel : false)
  }

  const handleEdit = (category) => (event) => {
    event.stopPropagation()
    onEdit(category)
  }

  const handleDelete = (category) => (event) => {
    event.stopPropagation()
    onDelete(category)
  }

  const handleItemUnlink = (category, item) => (event) => {
    event.stopPropagation()
    onItemUnlink(category, item)
  }

  const handItemAvailabilityChange = (category, item, option) => (event) => {
    event.stopPropagation()
    onItemAvailabilityChange(category, item, option, event.target.checked)
  }

  const handleItemAdd = (category) => (event) => {
    event.stopPropagation()
    onItemAdd(category)
  }

  const handleModifierNameSubmitSub = (name) => {
    onModifierNameSubmit(name)
  }

  const handleModifierItemAdd = (category, item) => () => {
    onModifierItemAdd(category, item)
  }

  const handleModifierDelete = (category, item, modifier) => (event) => {
    event.stopPropagation()
    onModifierDelete(category, item, modifier)
  }

  // eslint-disable-next-line
  const renderItem = (category) => (item) => (
    <Fragment key={item.id}>
      <ListItem className={classes.listItem} disabled={!item.available}>
        <ListItemText
          primary={<Typography>{item.name}</Typography>}
          secondary={
            <>
              <Typography color='textSecondary'>{item.description}</Typography>
              <Typography>{numeral(item.price).format('$ 0.00')}</Typography>
            </>
          }
          disableTypography
        />
        <ListItemSecondaryAction>
          <IconButton aria-label='apagar' size='small' onClick={handleItemUnlink(category, item)}>
            <Delete />
          </IconButton>
          <Switch
            checked={item.available}
            onChange={handItemAvailabilityChange(category, item, null)}
          />
        </ListItemSecondaryAction>
      </ListItem>
      {item.modifiers?.map((modifier) => (
        <Fragment key={modifier.id}>
          <ListItem
            className={classes.modifierNested}
            disabled={!item.available || !modifier.available}
          >
            <ListItemText
              primary={<Typography color='textSecondary'>{modifier.name}</Typography>}
              disableTypography
            />
            <ListItemSecondaryAction>
              <IconButton
                aria-label='apagar'
                size='small'
                onClick={handleModifierDelete(category, item, modifier)}
              >
                <Delete />
              </IconButton>
              {
                // <Switch
                //   checked={item.available}
                //   onChange={handModifierAvailabilityChange(category, item, modifier)}
                // />
              }
            </ListItemSecondaryAction>
          </ListItem>
          {modifier.options?.map((option) => (
            <ListItem
              className={classes.optionNested}
              key={option.id}
              disabled={!item.available || !modifier.available || !option.available}
            >
              <ListItemText
                primary={<Typography>{option.name}</Typography>}
                secondary={
                  <>
                    <Typography color='textSecondary'>{option.description}</Typography>
                    <Typography>{numeral(option.price).format('$ 0.00')}</Typography>
                  </>
                }
                disableTypography
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={option.available}
                  disabled={!item.available || !modifier.available}
                  onChange={handItemAvailabilityChange(category, item, option)}
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </Fragment>
      ))}
      <ListItem className={classes.modifierNested}>
        <NewModifierForm
          category={category}
          item={item}
          modifier={modifier}
          onModifierItemAdd={handleModifierItemAdd(category, item)}
          onSubmit={handleModifierNameSubmitSub}
        />
      </ListItem>
    </Fragment>
  )

  const renderCategory = (category, index) => {
    const hasItems = !!category.items?.length

    return (
      <ExpansionPanel
        key={category.id}
        expanded={expanded === index}
        TransitionProps={{ unmountOnExit: true }}
        onChange={handleExpansionPanelChange(index)}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1bh-content'
          id='panel1bh-header'
        >
          <Typography className={classes.name}>{category.name}</Typography>
          <Typography className={classes.description}>{category.description}</Typography>
          <Box className={classes.actions}>
            <IconButton aria-label='apagar' size='small' onClick={handleDelete(category)}>
              <Delete />
            </IconButton>
            <IconButton aria-label='editar' size='small' onClick={handleEdit(category)}>
              <Edit />
            </IconButton>
          </Box>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.expansionPanelDetails}>
          <Grid container justify='center'>
            <Grid item xs={12}>
              <List className={classes.list} disablePadding>
                {category.items?.map(renderItem(category))}
              </List>
            </Grid>
            <Grid item>
              <Box className={classes.box}>
                {!hasItems && (
                  <Typography variant='caption' color='textSecondary' align='center'>
                    Ainda não há items nessa categoria
                  </Typography>
                )}
                <Button
                  variant='outlined'
                  color='primary'
                  size='small'
                  startIcon={<AddCircleOutline />}
                  onClick={handleItemAdd(category)}
                >
                  Adicionar item
                </Button>
              </Box>
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    )
  }

  return categories?.map(renderCategory)
}

Menu.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          description: PropTypes.string.isRequired,
          available: PropTypes.bool.isRequired,
          price: PropTypes.number.isRequired,
          modifiers: PropTypes.arrayOf(
            PropTypes.shape({
              id: PropTypes.string.isRequired,
              name: PropTypes.string.isRequired,
              options: PropTypes.arrayOf(
                PropTypes.shape({
                  id: PropTypes.string.isRequired,
                  name: PropTypes.string.isRequired,
                  description: PropTypes.string.isRequired,
                  available: PropTypes.bool.isRequired,
                  price: PropTypes.number.isRequired
                })
              )
            })
          )
        }).isRequired
      )
    }).isRequired
  ).isRequired,
  modifier: PropTypes.object,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onItemUnlink: PropTypes.func,
  onItemAvailabilityChange: PropTypes.func,
  onItemAdd: PropTypes.func,
  onModifierNameSubmit: PropTypes.func,
  onModifierItemAdd: PropTypes.func,
  onModifierDelete: PropTypes.func,
  onModifierAvailabilityChange: PropTypes.func
}

Menu.defaultProps = {
  categories: [],
  onEdit: () => {},
  onDelete: () => {},
  onItemUnlink: () => {},
  onItemAvailabilityChange: () => {},
  onItemAdd: () => {},
  onModifierNameSubmit: () => {},
  onModifierItemAdd: () => {},
  onModifierDelete: () => {},
  onModifierAvailabilityChange: () => {}
}

export default Menu
