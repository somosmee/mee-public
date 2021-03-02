import React, { useContext, useState, useEffect } from 'react'

import PropTypes from 'prop-types'

import OrdersHistoryView from 'src/views/OrdersHistoryView'

import AppBarContext from 'src/contexts/AppBarContext'

import useOrder from 'src/hooks/useOrder'
import useOrders from 'src/hooks/useOrders'
import usePagination from 'src/hooks/usePagination'
import useSearch from 'src/hooks/useSearch'

import { FirebaseEvents } from 'src/utils/enums'

import { analytics } from 'src/firebase'

const OrdersHistoryContainer = ({ productId, ...rest }) => {
  const [, setAppBar] = useContext(AppBarContext)
  const [pagination, setPagination] = usePagination()

  /**
   * REACT STATES
   */

  const [term, setTerm] = useState('')
  const [search, searchResults] = useSearch({ entity: 'order' })
  const [filters, setFilters] = useState({ start: null, end: null })

  /**
   * APOLLO QUERIES & MUTATIONS
   */

  const { orders, refetch, loading } = useOrders({
    ...filters,
    first: pagination.offset,
    skip: pagination.page * pagination.offset
  })

  const { upsertOrder, cancelOrder } = useOrder()

  /**
   * REACT STATES
   */

  const [openDialog, setOpenDialog] = useState(false)

  /**
   * REACT USE EFFECTS
   */

  useEffect(() => {
    const title = 'Pedidos'
    setAppBar({ prominent: false, overhead: false, color: 'white', title: title.toLowerCase() })
    document.title = `${title} | Mee`
    analytics.logEvent(FirebaseEvents.SCREEN_VIEW, { screen_name: title })
  }, [setAppBar])

  useEffect(() => {
    search(term)
  }, [term, search])

  /**
   * CONTROLLERS
   */

  const handleUpsertOrder = async (order) => {
    upsertOrder(order, {
      onSuccess: () => {
        setOpenDialog(false)
        refetch()
      }
    })
  }

  const handleCancelOrder = async (selectedOrder, values) => {
    await cancelOrder(selectedOrder, values, {
      onSuccess: () => {
        setOpenDialog(false)
      }
    })
  }

  const handleSetOpenDialog = (flag) => {
    setOpenDialog(flag)
  }

  const handleFilterChange = (filter) => {
    setFilters((prevState) => ({ ...prevState, ...filter }))
  }

  const handleSearchChange = (term) => {
    setTerm(term)
  }

  const handlePageChange = (currentPage) => {
    setPagination({ page: currentPage })
  }

  const handleRowsPerPageChange = (rows) => {
    setPagination({ offset: rows })
  }

  return (
    <OrdersHistoryView
      orders={orders}
      term={term}
      filters={filters}
      loading={loading}
      openDialog={openDialog}
      searchResults={searchResults}
      onSetOpenDialog={handleSetOpenDialog}
      onUpsertOrder={handleUpsertOrder}
      onCancelOrder={handleCancelOrder}
      onFilterChange={handleFilterChange}
      onSearchChange={handleSearchChange}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleRowsPerPageChange}
    />
  )
}

OrdersHistoryContainer.propTypes = {
  user: PropTypes.object,
  location: PropTypes.object,
  productId: PropTypes.string
}

OrdersHistoryContainer.defaultProps = {}

export default OrdersHistoryContainer
