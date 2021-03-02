import React, { useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'

import PropTypes from 'prop-types'

import ProductView from 'src/views/ProductView'

import useInventory from 'src/hooks/useInventory'
import usePagination from 'src/hooks/usePagination'
import useProduct from 'src/hooks/useProduct'

import { Paths } from 'src/utils/enums'

const ProductContainer = () => {
  const history = useHistory()
  const { productId } = useParams()
  const [pagination, setPagination] = usePagination({ offset: 5 })

  const {
    getProduct: [getProduct, getProductResult]
  } = useProduct()
  const {
    getInventoryMovements: [getInventoryMovementsResult, getInventoryMovements]
  } = useInventory()

  useEffect(() => {
    getProduct({ product: productId })
  }, [])

  useEffect(() => {
    getInventoryMovements({
      product: productId,
      pagination: { first: pagination.offset, skip: pagination.page * pagination.offset }
    })
  }, [pagination.page, pagination.offset])

  const handleBack = () => {
    history.push(Paths.products.path)
  }

  const handleLoadMore = () => {
    setPagination({ offset: pagination.offset + 5 })
  }

  return (
    <ProductView
      product={getProductResult}
      inventoryMovements={getInventoryMovementsResult}
      handleBack={handleBack}
      handleLoadMore={handleLoadMore}
    />
  )
}

ProductContainer.propTypes = {
  productId: PropTypes.string.isRequired
}

ProductContainer.defaultProps = {}

export default ProductContainer
