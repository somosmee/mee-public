import React, { useContext, useState, useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import Tour from 'reactour'

import PropTypes from 'prop-types'

import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'

import Add from '@material-ui/icons/Add'
import Delete from '@material-ui/icons/DeleteOutlined'
import Edit from '@material-ui/icons/EditOutlined'
import Publish from '@material-ui/icons/Publish'
import ShoppingBasket from '@material-ui/icons/ShoppingBasket'
import SwapVert from '@material-ui/icons/SwapVertOutlined'

import Alert from 'src/components/Alert'
import Dialog from 'src/components/Dialog'
import List from 'src/components/List'
import Main from 'src/components/Main'
import Page from 'src/components/Page'
import Placeholder from 'src/components/Placeholder'
import BarcodeStep from 'src/components/ProductSteps/BarcodeStep'
import InternalStep from 'src/components/ProductSteps/InternalStep'

import AppBarContext from 'src/contexts/AppBarContext'

import useInventory from 'src/hooks/useInventory'
import useMe from 'src/hooks/useMe'
import usePagination from 'src/hooks/usePagination'
import useProduct from 'src/hooks/useProduct'
import useSearch from 'src/hooks/useSearch'

import ImportProductsContent from 'src/dialogs/ImportProductsContent'
import InventoryAdjustmentContent from 'src/dialogs/InventoryAdjustmentContent'
import UpsertProductContent from 'src/dialogs/UpsertProductContent'

import { FirebaseEvents, CreateProductSteps } from 'src/utils/enums'
import numeral from 'src/utils/numeral'

import helpscout from 'src/services/helpscout'

import { analytics } from 'src/firebase'

import useStyles from './styles'

const labels = [
  [
    {
      key: ['gtin']
    },
    {
      key: ['name'],
      name: 'Nome'
    }
  ],
  {
    key: ['description'],
    name: 'Descrição'
  },
  {
    key: ['balance'],
    name: 'Quantidade',
    type: 'number'
  },
  {
    key: ['price'],
    name: 'Preço',
    type: 'currency'
  }
]

const DialogContents = {
  upsertProduct: 'upsertProduct',
  inventoryAdjustment: 'inventoryAdjustment'
}

const ProductsView = () => {
  const classes = useStyles()

  const location = useLocation()
  const history = useHistory()
  const [pagination, setPagination] = usePagination()
  const { me } = useMe()
  const {
    getProductByGTIN: [getProductByGTIN, getProductByGTINResult],
    getProducts: [getProducts, getProducstResult],
    createProduct: [createProduct, createProductResult],
    updateProduct: [updateProduct, updateProductResult],
    deleteProduct: [deleteProduct, deleteProductResult],
    importProducts: [importProducts, importProductsResult]
  } = useProduct()
  const {
    inventoryAdjustment: [inventoryAdjustmentResult, inventoryAdjustment]
  } = useInventory()
  const [, setAppBar] = useContext(AppBarContext)
  const [search, results] = useSearch({ entity: 'product' })

  const { state } = location

  const [term, setTerm] = useState('')
  const [gtin, setGTIN] = useState(null)
  const [internal, setInternal] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [openImportDialog, setOpenImportDialog] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [activeContent, setActiveContent] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [openTour, setOpenTour] = useState(state?.tour)
  const [activeStep, setActiveStep] = useState(CreateProductSteps.internal)

  useEffect(() => {
    const title = 'Produtos'
    setAppBar({ prominent: false, overhead: false, color: 'white', title: title.toLowerCase() })
    document.title = `${title} | Mee`
    analytics.logEvent(FirebaseEvents.SCREEN_VIEW, { screen_name: title })
  }, [setAppBar])

  useEffect(() => {
    getProducts({ pagination })
  }, [pagination.page, pagination.offset, getProducts])

  useEffect(() => {
    search(term)
  }, [term, search])

  useEffect(() => {
    helpscout.hideBeacon()
  }, [])

  const handleDialogClose = () => {
    setOpenDialog(false)
  }

  const handleOnExited = () => {
    setSelectedProduct(null)
  }

  const handleCreateProduct = () => {
    handleCloseTour()
    setActiveContent(DialogContents.upsertProduct)
    setOpenCreateDialog(true)
  }

  const handleClick = (product) => {
    history.push(`products/${product._id}`)
  }

  const handleAction = (action, product) => (event) => {
    event && event.stopPropagation()
    setSelectedProduct(product)

    switch (action) {
      case 'edit':
        setActiveContent(DialogContents.upsertProduct)
        setOpenDialog(true)
        break
      case 'inventoryAdjustment':
        setActiveContent(DialogContents.inventoryAdjustment)
        setOpenDialog(true)
        break
      case 'delete':
        setOpenAlert(true)
        break
      default:
        break
    }
  }

  const handleSubmit = async (values) => {
    const {
      internal,
      gtin,
      name,
      ncm,
      description,
      image,
      price,
      measurement,
      tax,
      modifiers,
      bundle,
      productionLine
    } = values

    const input = {
      name,
      description,
      price,
      ncm,
      measurement
    }

    if (image instanceof File) input.image = image

    if (tax && tax.icmsOrigin && tax.icmsTaxPercentage) {
      input.tax = tax
    }

    if (modifiers?.length) {
      input.modifiers = modifiers
    }

    if (bundle?.length) {
      input.bundle = bundle.map(({ product, quantity }) => ({ product, quantity }))
    }

    if (productionLine) {
      input.productionLine = productionLine
    }

    try {
      if (selectedProduct) {
        await updateProduct({ product: selectedProduct._id, ...input })
        setOpenDialog(false)
      } else {
        await createProduct({ internal, gtin, ...input })
        setOpenCreateDialog(false)
        handleCreateDialogExited()
      }
    } catch (error) {}
  }

  const handlePageChange = (currentPage) => {
    setPagination({ page: currentPage })
  }

  const handleRowsPerPageChange = (rows) => {
    setPagination({ offset: rows })
  }

  const handleInventoryAdjustment = async (adjustment) => {
    try {
      await inventoryAdjustment({
        ...adjustment,
        product: selectedProduct._id,
        balance: parseFloat(adjustment.balance)
      })

      await getProducstResult?.refetch()
      handleDialogClose()
    } catch (error) {}
  }

  const handleSearchChange = (term) => {
    setTerm(term)
  }

  const handleCloseTour = () => {
    setOpenTour(false)
  }

  const handleBack = () => {
    switch (activeStep) {
      case CreateProductSteps.internal:
        handleCreateDialogClose()
        break
      case CreateProductSteps.barcode:
        setInternal(null)
        setGTIN(null)
        setActiveStep(CreateProductSteps.internal)
        break
      case CreateProductSteps.addInfo:
        setInternal(null)
        setGTIN(null)
        setActiveStep(CreateProductSteps.internal)
        break
      default:
        break
    }
  }

  const handleInternalSubmit = (internal) => {
    setInternal(internal)

    if (internal) {
      setActiveStep(CreateProductSteps.addInfo)
    } else {
      setActiveStep(CreateProductSteps.barcode)
    }
  }

  const handleBarcodeSubmit = async ({ gtin }) => {
    setGTIN(gtin)
    await getProductByGTIN(gtin)
    setActiveStep(CreateProductSteps.addInfo)
  }

  const handleCreateDialogClose = () => {
    setOpenCreateDialog(false)
  }

  const handleCreateDialogExited = () => {
    setInternal(null)
    setGTIN(null)
    setActiveStep(CreateProductSteps.internal)
  }

  const handleAlertExited = () => {
    setSelectedProduct(null)
  }

  const handleAlertClose = () => {
    setOpenAlert(false)
  }

  const handleDeleteProductSubmit = async () => {
    try {
      await deleteProduct({ id: selectedProduct._id })
      handleAlertClose()
    } catch (error) {}
  }

  const handleOpenImportDialog = () => {
    setOpenImportDialog(true)
    analytics.logEvent(FirebaseEvents.IMPORT_PRODUCTS_CLICK)
  }

  const handleImportDialogClose = () => {
    setOpenImportDialog(false)
  }

  const handleImportSubmit = async (products) => {
    try {
      await importProducts(products)
      handleImportDialogClose()
    } catch (error) {}
  }

  const hasProducts = getProducstResult?.data?.products?.pagination?.totalItems !== 0
  const actions = [
    {
      startIcon: <Add />,
      label: 'Adicionar produto',
      variant: 'outlined',
      color: 'primary',
      onClick: handleCreateProduct
    },
    {
      startIcon: <Publish />,
      label: 'Importar produtos',
      variant: 'outlined',
      color: 'primary',
      onClick: handleOpenImportDialog
    }
  ]

  const placeholder = !hasProducts && (
    <Placeholder
      icon={<ShoppingBasket />}
      message={'Ainda não há produtos'}
      symbol={'👋'}
      actions={actions}
    />
  )

  const fab = {
    id: 'add_product',
    actions: [
      {
        icon: <Add />,
        label: 'Adicionar',
        onClick: handleCreateProduct
      },
      {
        icon: <Publish />,
        label: 'Importar',
        onClick: handleOpenImportDialog
      }
    ]
  }

  const steps = [
    {
      selector: '[id="add_product"]',
      content: 'Clique aqui para criar um produto'
    }
  ]

  let productData = null

  if (!internal && gtin && getProductByGTINResult?.data?.productGTIN) {
    const { _id, ...rest } = getProductByGTINResult?.data?.productGTIN
    productData = rest
  }

  return (
    <Page className={classes.root}>
      <Main fab={fab} placeholder={placeholder}>
        <List
          loading={getProducstResult.loading}
          avatar
          actionButton={{
            icon: <Publish />,
            label: 'Importar produtos',
            onClick: handleOpenImportDialog
          }}
          labels={labels}
          items={getProducstResult?.data?.products.products}
          getItemImage={(item) => item.image}
          getItemTitle={(item) => item.name}
          getItemAdornmentTitle={(item) => numeral(item.price).format('$ 0.00')}
          getItemSubtitle={(item) => item.gtin}
          getItemDescription={(item) => item.description}
          getItemInformation={(item) => `${item.balance.toString()} unidades`}
          pagination={getProducstResult?.data?.products.pagination}
          search={{
            loading: results.loading,
            placeholder: 'Pesquisar produto',
            items: results.data,
            value: term,
            onChange: handleSearchChange
          }}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onClick={handleClick}
          renderActions={(item, index) => (
            <>
              <Tooltip title='Editar'>
                <IconButton aria-label='Editar' onClick={handleAction('edit', item, index)}>
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title='Ajustar estoque'>
                <IconButton
                  aria-label='Ajustar estoque'
                  onClick={handleAction('inventoryAdjustment', item, index)}
                >
                  <SwapVert />
                </IconButton>
              </Tooltip>
              <Tooltip title='Deletar'>
                <IconButton aria-label='Deletar' onClick={handleAction('delete', item, index)}>
                  <Delete />
                </IconButton>
              </Tooltip>
            </>
          )}
        />
        <Tour
          steps={steps}
          isOpen={openTour}
          onRequestClose={handleCloseTour}
          rounded={10}
          showButtons={false}
          showNavigation={false}
          showNavigationNumber={false}
        />
        <Dialog
          open={openCreateDialog}
          activeContent={activeStep}
          onBack={handleBack}
          onClose={handleCreateDialogClose}
          onExited={handleCreateDialogExited}
        >
          <InternalStep
            id={CreateProductSteps.internal}
            title='Criar produto'
            onSubmit={handleInternalSubmit}
          />
          <BarcodeStep
            id={CreateProductSteps.barcode}
            loading={getProductByGTINResult.loading}
            title='Adicione o código de barras'
            onSubmit={handleBarcodeSubmit}
          />
          <UpsertProductContent
            id={CreateProductSteps.addInfo}
            title='Adicionar informações do produto'
            loading={createProductResult.loading || updateProductResult.loading}
            initialValues={productData ?? { internal, gtin }}
            onSubmit={handleSubmit}
          />
        </Dialog>
        <Dialog
          open={openDialog}
          activeContent={activeContent}
          onClose={handleDialogClose}
          onExited={handleOnExited}
        >
          <UpsertProductContent
            id={DialogContents.upsertProduct}
            title={selectedProduct ? 'Editar produto' : 'Criar produto'}
            alert='Você precisa incluir informações na aba Impostos para gerar CF-e!'
            loading={createProductResult.loading || updateProductResult.loading}
            initialValues={selectedProduct}
            alertTax={!me.tax}
            onSubmit={handleSubmit}
          />
          <InventoryAdjustmentContent
            id={DialogContents.inventoryAdjustment}
            title='Ajustar estoque'
            loading={inventoryAdjustmentResult.loading}
            initialValues={selectedProduct}
            onSubmit={handleInventoryAdjustment}
          />
        </Dialog>
        <Dialog open={openImportDialog} onClose={handleImportDialogClose}>
          <ImportProductsContent
            title='Importar produtos'
            loading={importProductsResult.loading}
            onSubmit={handleImportSubmit}
          />
        </Dialog>
        <Alert
          open={openAlert}
          loading={deleteProductResult.loading}
          title='Apagar produto'
          onPrimary={handleDeleteProductSubmit}
          primaryLabel='Apagar'
          onSecondary={handleAlertClose}
          secondaryLabel='Cancelar'
          onClose={handleAlertClose}
          onExited={handleAlertExited}
        >
          O produto será apagado permanentemente. Tem certeza que deseja continuar?
        </Alert>
      </Main>
    </Page>
  )
}

ProductsView.propTypes = {
  location: PropTypes.object,
  user: PropTypes.object
}

ProductsView.defaultProps = {}

export default ProductsView
