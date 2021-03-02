import React from 'react'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import SearchIcon from '@material-ui/icons/Search'

import numeral from 'src/utils/numeral'

import useStyles from './styles'

const SearchResult = ({ text, notFound, onClick, suggestions, hasSuggestions }) => {
  const classes = useStyles()

  const handleClick = (suggestion) => (event) => {
    onClick(suggestion)
  }

  const renderSuggestion = (suggestion) => (
    <ListItem
      className={classes.litItem}
      key={suggestion._id}
      button
      divider
      onClick={handleClick(suggestion)}
    >
      <ListItemIcon className={classes.listItemIcon}>
        <SearchIcon />
      </ListItemIcon>
      <ListItemText
        classes={{
          root: classes.listItemRoot,
          primary: classes.listItemPrimary
        }}
        primary={suggestion.name}
        secondary={suggestion.gtin}
      />
      {numeral(suggestion.price).format('$0.00')}
    </ListItem>
  )

  if (notFound) {
    return (
      <List dense>
        <ListItem className={classes.litItem} button divider>
          <ListItemIcon className={classes.listItemIcon}>
            <SearchIcon />
          </ListItemIcon>
          <ListItemText primary={`Nenhum resultado encontrado para "${text}"`} />
        </ListItem>
      </List>
    )
  }

  if (hasSuggestions) {
    return <List dense>{suggestions.map(renderSuggestion)}</List>
  }

  return null
}

export default SearchResult
