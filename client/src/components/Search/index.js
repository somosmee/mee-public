import React, { forwardRef, useState, useEffect, useRef } from 'react'

import PropTypes from 'prop-types'

import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import InputAdornment from '@material-ui/core/InputAdornment'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import SearchIcon from '@material-ui/icons/Search'
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket'

import numeral from 'src/utils/numeral'

import useStyles from './styles'

const Search = forwardRef(
  (
    {
      id,
      size,
      variant,
      focus,
      className,
      placeholder,
      value,
      options,
      suggestions,
      filter,
      loading,
      disabled,
      fullWidth,
      onChange,
      onOptionClick
    },
    ref
  ) => {
    const classes = useStyles()

    const searchRef = useRef(null)

    const [anchorElement, setAnchorElement] = useState(null)

    useEffect(() => {
      if (suggestions.length > 0 && !value) {
        if (!anchorElement) setAnchorElement(searchRef.current)
      } else {
        if (!filter) {
          if (value) {
            if (!anchorElement) setAnchorElement(searchRef.current)
          } else {
            setAnchorElement(null)
          }
        }
      }
    }, [filter, value, setAnchorElement])

    const handleClickAway = () => {
      if (!filter) setAnchorElement(null)
    }

    const handleChange = (event) => {
      onChange(event.target.value)
    }

    const handleFocus = () => {
      if (!filter && value && !anchorElement) {
        setAnchorElement(searchRef.current)
      }
    }

    const handleOptionClick = (option) => (event) => {
      onOptionClick(option)
      ref.current.focus()
    }

    const renderOption = (option) => (
      <ListItem key={option._id} button onClick={handleOptionClick(option)}>
        {!option.confidence && (
          <ListItemIcon className={classes.icon}>
            <ShoppingBasketIcon />
          </ListItemIcon>
        )}
        <ListItemText
          disableTypography
          primary={
            <Typography className={classes.title} variant='body2' noWrap>
              {option.name}
            </Typography>
          }
          secondary={
            option.confidence ? (
              <Typography variant='caption' color='textSecondary'>
                {option.gtin} - {`prob: ${(100 * option.confidence).toFixed(2)}%`}
              </Typography>
            ) : (
              <Typography variant='caption' color='textSecondary'>
                {option.gtin}
              </Typography>
            )
          }
        />
        <Typography variant='body2' align='right'>
          {numeral(option.price).format('$ 0.00')}
        </Typography>
      </ListItem>
    )

    const hasOptions = !!options.length
    const hasSuggestions = !!suggestions.length
    const noResults = !hasOptions && !!value

    console.log('anchorElement:', anchorElement)
    console.log('!filter:', !filter)
    console.log('suggestions:', suggestions)

    return (
      <ClickAwayListener onClickAway={handleClickAway}>
        <div className={classes.root}>
          <TextField
            id={id}
            size={size}
            variant={variant}
            ref={searchRef}
            inputRef={ref}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position='end'>
                  <Box width={20}>{loading && <CircularProgress color='inherit' size={20} />}</Box>
                </InputAdornment>
              )
            }}
            fullWidth={fullWidth}
            autoComplete='off'
          />
          {hasSuggestions && (
            <Popper
              className={classes.poper}
              style={{ width: searchRef?.current?.clientWidth }}
              open={!!anchorElement}
              anchorEl={anchorElement}
              modifiers={{
                flip: { enabled: false },
                preventOverflow: { enabled: false, boundariesElement: 'scrollParent' },
                hide: { enabled: false }
              }}
              keepMounted
            >
              <Paper>
                <List
                  id='search-results'
                  dense
                  aria-label='resultados'
                  subheader={
                    <ListSubheader component='div' id='nested-list-subheader'>
                      Sugestões
                    </ListSubheader>
                  }
                >
                  {suggestions.map(renderOption)}
                </List>
              </Paper>
            </Popper>
          )}
          {!filter && value && (
            <Popper
              className={classes.poper}
              style={{ width: searchRef?.current?.clientWidth }}
              open={!!anchorElement}
              anchorEl={anchorElement}
              modifiers={{
                flip: { enabled: false },
                preventOverflow: { enabled: false, boundariesElement: 'scrollParent' },
                hide: { enabled: false }
              }}
              keepMounted
            >
              <Paper>
                <List id='search-results' dense aria-label='resultados'>
                  {options.map(renderOption)}
                  {noResults && (
                    <ListItem>
                      <ListItemText
                        disableTypography
                        primary={
                          <Typography
                            align='center'
                            noWrap
                          >{`Nenhum resultado encontrado para "${value}"`}</Typography>
                        }
                      />
                    </ListItem>
                  )}
                </List>
              </Paper>
            </Popper>
          )}
        </div>
      </ClickAwayListener>
    )
  }
)

Search.displayName = 'Search'

Search.propTypes = {
  id: PropTypes.string,
  variant: PropTypes.string,
  size: PropTypes.string,
  focus: PropTypes.bool,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.object),
  suggestions: PropTypes.arrayOf(PropTypes.object),
  filter: PropTypes.bool,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  onChange: PropTypes.func,
  onOptionClick: PropTypes.func
}

Search.defaultProps = {
  id: 'search',
  variant: 'standard',
  size: 'normal',
  placeholder: 'Pesquisar',
  options: [],
  suggestions: [],
  autocomplete: false,
  loading: false,
  disabled: false,
  fullWidth: false,
  onChange: () => {},
  onOptionClick: () => {}
}

export default Search
