import React from 'react'

import PropTypes from 'prop-types'

import IconButton from '@material-ui/core/IconButton'
import { useTheme } from '@material-ui/core/styles'

import FirstPageIcon from '@material-ui/icons/FirstPage'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import LastPageIcon from '@material-ui/icons/LastPage'

import useStyles from './styles'

const TablePaginationActions = ({
  count,
  page,
  rowsPerPage,
  onChangePage,
  showFirstButton,
  showLastButton
}) => {
  const classes = useStyles()

  const theme = useTheme()

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0)
  }

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1)
  }

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1)
  }

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
  }

  return (
    <div className={classes.root}>
      {showFirstButton && (
        <IconButton
          id='first-page'
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label='primeira página'
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
      )}
      <IconButton
        id='previous-page'
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label='página anterior'
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        id='next-page'
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='próxima página'
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      {showLastButton && (
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label='última página'
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      )}
    </div>
  )
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  showFirstButton: PropTypes.bool,
  showLastButton: PropTypes.bool
}

TablePaginationActions.defaultProps = {
  showFirstButton: false,
  showLastButton: false
}

export default TablePaginationActions
