import React from 'react'

import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart'
import DeleteIcon from '@material-ui/icons/Delete'
import SaveIcon from '@material-ui/icons/Save'

import useStyles from './styles'

const CreateListStep = ({
  list,
  listTitle,
  footerListText,
  onDelete,
  onAddNew,
  onSubmit,
  primaryTextAttributes,
  secondaryTextAttributes
}) => {
  const classes = useStyles()

  const handleAddNew = () => {
    onAddNew()
  }

  const renderQueryResult = (queryResult, index) => (
    <Paper className={classes.paper} key={index}>
      <ListItem>
        <ListItemText
          primary={queryResult[primaryTextAttributes]}
          secondary={queryResult[secondaryTextAttributes]}
        />
        <ListItemSecondaryAction>
          <IconButton edge='end' aria-label='delete' onClick={() => onDelete(queryResult)}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </Paper>
  )

  const hasItems = list && !!list.length

  return (
    <>
      <DialogContent className={classes.content}>
        <Button
          variant='outlined'
          size='large'
          fullWidth
          startIcon={<AddShoppingCartIcon />}
          onClick={handleAddNew}
        >
          Adicionar um item a lista
        </Button>
        {hasItems && (
          <>
            <Typography variant='h6' className={classes.title}>
              {listTitle}
            </Typography>
            <List component='nav'>{list.map(renderQueryResult)}</List>
            <Typography variant='h6' className={classes.footer}>
              {footerListText}
            </Typography>
          </>
        )}
      </DialogContent>
      <Paper className={classes.actionPaper} elevation={10}>
        <DialogActions className={classes.actions}>
          <Button
            variant='contained'
            color='primary'
            size='large'
            fullWidth
            disabled={!hasItems}
            startIcon={<SaveIcon />}
            onClick={onSubmit}
          >
            Salvar
          </Button>
        </DialogActions>
      </Paper>
    </>
  )
}

CreateListStep.propTypes = {
  list: PropTypes.array,
  listTitle: PropTypes.string,
  footerListText: PropTypes.string,
  onDelete: PropTypes.func,
  onAddNew: PropTypes.func,
  onSubmit: PropTypes.func,
  primaryTextAttributes: PropTypes.string,
  secondaryTextAttributes: PropTypes.string
}

CreateListStep.defaultProps = {
  list: [],
  onSelect: () => {},
  onAddNew: () => {},
  onSubmit: () => {}
}

export default CreateListStep
