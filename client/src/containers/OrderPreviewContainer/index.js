import React from 'react'
import { useParams } from 'react-router-dom'

import { useQuery } from '@apollo/react-hooks'
import PropTypes from 'prop-types'

import OrderPreviewView from 'src/views/OrderPreviewView'

import { GET_ORDER_PREVIEW } from 'src/graphql/order/queries'

const OrderPreviewContainer = () => {
  const { orderId } = useParams()

  const { data } = useQuery(GET_ORDER_PREVIEW, { variables: { id: orderId } })

  return <OrderPreviewView order={data?.orderPreview} />
}

OrderPreviewContainer.propTypes = {
  orderId: PropTypes.string
}

OrderPreviewContainer.defaultProps = {}

export default OrderPreviewContainer
