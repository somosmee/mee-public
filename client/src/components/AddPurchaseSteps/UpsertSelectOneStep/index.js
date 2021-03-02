import React, { useState, useEffect } from 'react'

import { useQuery } from '@apollo/react-hooks'
import PropTypes from 'prop-types'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import AddCircle from '@material-ui/icons/AddCircle'
import ChevronRight from '@material-ui/icons/ChevronRight'

import Loading from 'src/components/Loading'
import Search from 'src/components/Search'

import useSearch from 'src/hooks/useSearch'

import useStyles from './styles'

const UpsertSelectOneStep = ({
  onSelect,
  onAddNew,
  getQuery,
  getQueryName,
  searchQuery,
  searchQueryName,
  entity,
  entitiyLabel,
  primaryTextAttributes,
  secondaryTextAttributes,
  noDataText
}) => {
  const classes = useStyles()

  const [search, results] = useSearch({ entity: entity.slice(0, -1) })
  const [term, setTerm] = useState('')

  const { loading, data } = useQuery(getQuery, { fetchPolicy: 'network-only' })

  useEffect(() => {
    search(term)
  }, [term, search])

  const handleChange = (value) => {
    setTerm(value)
  }

  const handleClick = (queryResult) => () => {
    onSelect(queryResult)
  }

  const handleAddNew = () => {
    onAddNew && onAddNew()
  }

  const renderQueryResult = (queryResult, index) => (
    <Paper className={classes.paper} key={index}>
      <ListItem button onClick={handleClick(queryResult)}>
        <ListItemText
          primary={queryResult[primaryTextAttributes]}
          secondary={queryResult[secondaryTextAttributes]}
        />
        <ChevronRight />
      </ListItem>
    </Paper>
  )

  const hasData = !!data?.[getQueryName]?.[entity].length
  const queryResults =
    results.data.length > 0 ? results.data : hasData && data[getQueryName][entity]

  return (
    <>
      <DialogContent className={classes.content}>
        {loading && <Loading />}
        {!loading && hasData && (
          <>
            <Search
              value={term}
              placeholder={`Busque um ${entitiyLabel}`}
              onChange={handleChange}
              filter
            />
            <List component='nav'>{queryResults.map(renderQueryResult)}</List>
          </>
        )}
        {!loading && !hasData && onAddNew && (
          <Button
            variant='outlined'
            color='primary'
            size='large'
            fullWidth
            startIcon={<AddCircle />}
            onClick={handleAddNew}
          >
            {`Adicionar ${entitiyLabel}`}
          </Button>
        )}
        {!loading && !hasData && !onAddNew && (
          <Box display='flex' justifyContent='center' marginTop='50px'>
            <Typography>{noDataText}</Typography>
          </Box>
        )}
      </DialogContent>
      {onAddNew && (
        <Paper className={classes.actionPaper} elevation={10}>
          <DialogActions className={classes.actions}>
            <Button
              variant='outlined'
              color='primary'
              size='large'
              fullWidth
              startIcon={<AddCircle />}
              onClick={handleAddNew}
            >
              {`Adicionar ${entitiyLabel}`}
            </Button>
          </DialogActions>
        </Paper>
      )}
    </>
  )
}

UpsertSelectOneStep.propTypes = {
  onSelect: PropTypes.func,
  onAddNew: PropTypes.func,
  getQuery: PropTypes.object,
  getQueryName: PropTypes.string,
  searchQuery: PropTypes.object,
  searchQueryName: PropTypes.string,
  entity: PropTypes.string,
  noDataText: PropTypes.string,
  entitiyLabel: PropTypes.string,
  primaryTextAttributes: PropTypes.string,
  secondaryTextAttributes: PropTypes.string
}

UpsertSelectOneStep.defaultProps = {
  onSelect: () => {}
}

export default UpsertSelectOneStep
