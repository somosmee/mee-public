import React, { useState, useEffect } from 'react'

import { useQuery } from '@apollo/react-hooks'
import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import AddCircle from '@material-ui/icons/AddCircle'
import ChevronRight from '@material-ui/icons/ChevronRight'

import Loading from 'src/components/Loading'
import Search from 'src/components/Search'

import { GET_CUSTOMERS } from 'src/graphql/customer/queries'

import useSearch from 'src/hooks/useSearch'

import useStyles from './styles'

const CustomerSearchStep = ({ onSelect, onAddNew }) => {
  const classes = useStyles()

  const theme = useTheme()
  const upMedium = useMediaQuery(theme.breakpoints.up('md'))

  const [search, results] = useSearch({ entity: 'customer' })
  const [term, setTerm] = useState('')

  const { loading, data } = useQuery(GET_CUSTOMERS, { fetchPolicy: 'network-only' })

  useEffect(() => {
    search(term)
  }, [term, search])

  const handleChange = (value) => {
    setTerm(value)
  }

  const handleClick = (customer) => () => {
    onSelect(customer)
  }

  const handleAddNew = () => {
    onAddNew()
  }

  const renderCustomer = (customer, index) => (
    <Paper className={classes.customerPaper} key={index}>
      <ListItem button onClick={handleClick(customer)}>
        <ListItemText
          primary={`${customer.firstName} ${customer.lastName}`}
          secondary={customer.mobile}
        />
        <ChevronRight />
      </ListItem>
    </Paper>
  )

  const hasCustomers = !!data?.customers?.customers.length
  const customers = results.data.length > 0 ? results.data : data?.customers?.customers

  return (
    <>
      <DialogContent className={classes.content}>
        {loading ? (
          <Loading drawer={false} />
        ) : (
          <>
            {hasCustomers ? (
              <>
                <Search
                  value={term}
                  placeholder='Pesquise pelo celular'
                  onChange={handleChange}
                  fullWidth={!upMedium}
                  filter
                />
                <List>{customers.map(renderCustomer)}</List>
              </>
            ) : (
              <Button
                id='add-customer'
                variant='outlined'
                color='primary'
                size='large'
                fullWidth
                startIcon={<AddCircle />}
                onClick={handleAddNew}
              >
                Adicionar cliente
              </Button>
            )}
          </>
        )}
      </DialogContent>
      {hasCustomers && (
        <Paper className={classes.paper} elevation={10}>
          <DialogActions>
            <Button
              id='add-customer'
              variant='outlined'
              color='primary'
              size='large'
              fullWidth
              startIcon={<AddCircle />}
              onClick={handleAddNew}
            >
              Adicionar cliente
            </Button>
          </DialogActions>
        </Paper>
      )}
    </>
  )
}

CustomerSearchStep.propTypes = {
  onSelect: PropTypes.func,
  onAddNew: PropTypes.func
}

CustomerSearchStep.defaultProps = {
  onSelect: () => {},
  onAddNew: () => {}
}

export default CustomerSearchStep
