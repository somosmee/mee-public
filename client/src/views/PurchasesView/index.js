import React, { useContext, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { useQuery, useMutation } from '@apollo/react-hooks'

import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Add from '@material-ui/icons/Add'
import BallotIcon from '@material-ui/icons/BallotOutlined'
import Description from '@material-ui/icons/Description'
import ReceiptIcon from '@material-ui/icons/ReceiptOutlined'

import AddItemStep from 'src/components/AddPurchaseSteps/AddItemStep'
import CreateListStep from 'src/components/AddPurchaseSteps/CreateListStep'
import UpsertSelectOneStep from 'src/components/AddPurchaseSteps/UpsertSelectOneStep'
import UpsertSupplierStep from 'src/components/AddPurchaseSteps/UpsertSupplierStep'
import Dialog from 'src/components/Dialog'
import DialogStepper from 'src/components/DialogStepper'
import List from 'src/components/List'
import Main from 'src/components/Main'
import Page from 'src/components/Page'
import Placeholder from 'src/components/Placeholder'
import BarcodeStep from 'src/components/ProductSteps/BarcodeStep'
import InternalStep from 'src/components/ProductSteps/InternalStep'

import SelectImportGoalStep from 'src/views/PurchasesView/SelectImportGoalStep'

import { OPEN_NOTIFICATION } from 'src/graphql/notification/queries'
import { GET_PRODUCTS, SEARCH_PRODUCTS } from 'src/graphql/product/queries'
import { GET_PURCHASES, ADD_PURCHASE, ADD_MANUAL_PURCHASE } from 'src/graphql/purchase/gqls'
import { GET_SUPPLIERS, SEARCH_SUPPLIERS, CREATE_SUPPLIER } from 'src/graphql/supplier/queries'

import AppBarContext from 'src/contexts/AppBarContext'

import useCompany from 'src/hooks/useCompany'
import usePagination from 'src/hooks/usePagination'
import useProduct from 'src/hooks/useProduct'

import NewPurchaseContent from 'src/dialogs/NewPurchaseContent'
import UpsertFinancialStatementContent from 'src/dialogs/UpsertFinancialStatementContent'
import UpsertProductContent from 'src/dialogs/UpsertProductContent'

import { FirebaseEvents, PurchaseStatus, AddPurchaseSteps, LabelTypes } from 'src/utils/enums'

import helpscout from 'src/services/helpscout'

import { analytics } from 'src/firebase'

import useStyles from './styles'

const labels = [
  {
    key: ['purchasedAt'],
    type: LabelTypes.date,
    name: 'Data',
    format: 'DD/MM/YYYY HH:mm:ss'
  },
  {
    key: ['supplier.displayName'],
    name: 'Fornecedor'
  },
  {
    key: ['total'],
    name: 'Total',
    type: 'currency'
  }
]

const INITIAL_DIALOG_STATE = {
  invoice: false,
  manual: false
}

const PurchasesView = () => {
  const classes = useStyles()
  const theme = useTheme()
  const upMedium = useMediaQuery(theme.breakpoints.up('md'))

  const {
    getMyCompany: [getMyCompany, { data }]
  } = useCompany()
  const company = data?.myCompany

  const [, setAppBar] = useContext(AppBarContext)
  const history = useHistory()
  const [pagination, setPagination] = usePagination()
  const {
    getProductByGTIN: [getProductByGTIN, getProductByGTINResult],
    createProduct: [createProduct, createProductResult]
  } = useProduct()

  useEffect(() => {
    const title = 'Compras'
    setAppBar({ prominent: false, overhead: false, color: 'white', title: title.toLowerCase() })
    document.title = `${title} | Mee`
    analytics.logEvent(FirebaseEvents.SCREEN_VIEW, { screen_name: title })
  }, [setAppBar])

  useEffect(() => {
    helpscout.hideBeacon()
  }, [])

  useEffect(() => {
    getMyCompany()
  }, [])

  /* STATE */
  const [list, setList] = useState([])
  const [gtin, setGTIN] = useState(null)
  const [internal, setInternal] = useState(null)
  const [selectGoal, setSelectGoal] = useState(null)
  const [openDialog, setOpenDialog] = useState(INITIAL_DIALOG_STATE)
  const [activeStep, setActiveStep] = useState(AddPurchaseSteps.selectGoal)
  const [selectedSupplierId, setSelectedSupplierId] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)

  /* GRAPHQL */
  const options = {
    refetchQueries: [{ query: GET_PURCHASES }],
    awaitRefetchQueries: true
  }

  const { loading, data: dataPurchases, refetch } = useQuery(GET_PURCHASES, {
    variables: {
      input: { pagination: { first: pagination.offset, skip: pagination.page * pagination.offset } }
    },
    fetchPolicy: 'network-only'
  })
  const [addPurchase] = useMutation(ADD_PURCHASE, options)
  const [addManualPurchase] = useMutation(ADD_MANUAL_PURCHASE)
  const [createSupplier] = useMutation(CREATE_SUPPLIER)
  const [openNotification] = useMutation(OPEN_NOTIFICATION)

  /* HADLE FUNCTIONS */

  const handleDialogInvoiceOpen = () => {
    setOpenDialog((prevState) => ({ ...prevState, invoice: true }))
    analytics.logEvent(FirebaseEvents.CREATE_AUTOMATIC_PURCHASE_CLICK)
  }

  const handleDialogManualOpen = () => {
    setOpenDialog((prevState) => ({ ...prevState, manual: true }))
    analytics.logEvent(FirebaseEvents.CREATE_MANUAL_PURCHASE_CLICK)
  }

  const handleDialogClose = () => {
    setOpenDialog(INITIAL_DIALOG_STATE)
  }

  const handleSubmit = async (data) => {
    const variables = { accessKey: data.accessKey }

    try {
      await addPurchase({ variables })
      analytics.logEvent(FirebaseEvents.CREATE_PURCHASE, { type: 'automatic' })
      // openSnackbar({ variant: 'success', message: 'Compra adicionada' })
    } catch ({ message }) {
      // openSnackbar({ variant: 'error', message })
    } finally {
      handleDialogClose()
    }
  }

  const handleClick = (purchase) => {
    history.push(`/purchases/${purchase._id}`)
  }

  const handleAddNewSupplier = () => {
    setActiveStep(AddPurchaseSteps.newSupplier)
  }

  const handleAddNewProduct = () => {
    setActiveStep(AddPurchaseSteps.selectProduct)
  }

  const resetState = () => {
    setActiveStep(AddPurchaseSteps.selectGoal)
    // setSelectedCustomerId(null)
    // setSelectedAddressId(null)
    // setAddress(null)
  }

  const handleBack = () => {
    switch (activeStep) {
      case AddPurchaseSteps.selectGoal:
        setOpenDialog(INITIAL_DIALOG_STATE)
        setActiveStep(AddPurchaseSteps.selectGoal)
        break
      case AddPurchaseSteps.supplier:
        setActiveStep(AddPurchaseSteps.selectGoal)
        break
      case AddPurchaseSteps.newSupplier:
        setActiveStep(AddPurchaseSteps.supplier)
        break
      case AddPurchaseSteps.financialStatement:
        setActiveStep(AddPurchaseSteps.supplier)
        break
      case AddPurchaseSteps.items:
        resetState()
        setActiveStep(AddPurchaseSteps.supplier)
        break
      case AddPurchaseSteps.selectProduct:
        setActiveStep(AddPurchaseSteps.items)
        break
      case AddPurchaseSteps.internal:
        setActiveStep(AddPurchaseSteps.selectProduct)
        break
      case AddPurchaseSteps.barcode:
        setActiveStep(AddPurchaseSteps.internal)
        break
      case AddPurchaseSteps.addInfo:
        setActiveStep(AddPurchaseSteps.internal)
        break
      case AddPurchaseSteps.newItem:
        setActiveStep(AddPurchaseSteps.selectProduct)
        break
      default:
        break
    }
  }

  const handleSelectSupplier = async (supplier) => {
    setSelectedSupplierId(supplier._id)

    try {
      if (selectGoal === 'expense') {
        setActiveStep(AddPurchaseSteps.financialStatement)
      } else {
        setActiveStep(AddPurchaseSteps.items)
      }
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const handleSelectProduct = async (product) => {
    setSelectedProduct({
      product: product._id,
      gtin: product.gtin,
      name: product.name,
      measurement: product.measurement,
      ncm: product.ncm
    })

    try {
      setActiveStep(AddPurchaseSteps.newItem)
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const handleCreateProduct = async () => {
    try {
      setActiveStep(AddPurchaseSteps.internal)
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const handleNewSupplierSubmit = async (input) => {
    try {
      const {
        data: {
          createSupplier: { _id }
        }
      } = await createSupplier({ variables: { input } })
      analytics.logEvent(FirebaseEvents.CREATE_SUPPLIER)
      setSelectedSupplierId(_id)
      openNotification({
        variables: { input: { variant: 'success', message: 'Fornecedor criado com sucesso!' } }
      })

      if (selectGoal === 'expense') {
        setActiveStep(AddPurchaseSteps.financialStatement)
      } else {
        setActiveStep(AddPurchaseSteps.items)
      }
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const handleConfirmItem = async (newItem) => {
    const { gtin, measurement, name, ncm, product, quantity, totalPrice, unitPrice } = newItem
    newItem = {
      gtin,
      measurement,
      name,
      ncm,
      product,
      quantity: parseFloat(quantity),
      totalPrice: parseFloat(totalPrice),
      unitPrice: parseFloat(unitPrice),
      secondaryText: `R$ ${newItem.unitPrice} x ${
        newItem.quantity
      } = R$ ${newItem.totalPrice.toFixed(2)}`
    }

    const productIndex = list.findIndex((item) => item.product === newItem.product)
    if (productIndex > -1) {
      setList((prevState) => {
        const newList = [...prevState]
        newList[productIndex] = newItem
        return newList
      })
    } else {
      setList((prevState) => [...prevState, newItem])
    }
    setActiveStep(AddPurchaseSteps.items)
  }

  const handleDeleteItem = (selectedItem) => {
    const productIndex = list.findIndex((item) => item.product === selectedItem.product)

    if (productIndex > -1) {
      setList((prevState) => {
        const newList = [...prevState]
        newList.splice(productIndex, 1)
        return newList
      })
    }
  }

  const handleSelectImportGoal = (option) => {
    setSelectGoal(option)
    setActiveStep(AddPurchaseSteps.supplier)
  }

  const handleManualPurchaseSubmit = async ({ value, dueAt, paymentMethod, financialFund }) => {
    const input = {
      total: value || undefined,
      supplier: selectedSupplierId,
      items:
        list.map((item) => {
          delete item.secondaryText
          return item
        }) || [],
      paymentMethod: paymentMethod || undefined,
      financialFund: financialFund || undefined,
      purchasedAt: dueAt
    }

    try {
      await addManualPurchase({ variables: { input } })
      analytics.logEvent(FirebaseEvents.CREATE_PURCHASE, { type: 'manual' })

      setSelectedSupplierId(null)
      setSelectedProduct(null)
      setList([])
      setOpenDialog(INITIAL_DIALOG_STATE)
      setActiveStep(AddPurchaseSteps.selectGoal)

      openNotification({
        variables: { input: { variant: 'success', message: 'Compra criada com sucesso!' } }
      })

      refetch()
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  // Create product steps
  const handleInternalSubmit = (internal) => {
    setInternal(internal)

    if (internal) {
      setActiveStep(AddPurchaseSteps.addInfo)
    } else {
      setActiveStep(AddPurchaseSteps.barcode)
    }
  }

  const handleBarcodeSubmit = async ({ gtin }) => {
    setGTIN(gtin)
    await getProductByGTIN(gtin)
    setActiveStep(AddPurchaseSteps.addInfo)
  }

  const handleSubmitCreateProduct = async (values) => {
    const { internal, gtin, name, ncm, description, image, price, measurement } = values

    const input = {
      name,
      description,
      price,
      ncm,
      measurement
    }

    if (image instanceof File) input.image = image

    try {
      const product = await createProduct({ internal, gtin, ...input })
      analytics.logEvent(FirebaseEvents.CREATE_PRODUCT)

      setSelectedProduct({
        product: product._id,
        gtin: product.gtin,
        name: product.name,
        measurement: product.measurement,
        ncm: product.ncm
      })

      setActiveStep(AddPurchaseSteps.newItem)
      openNotification({
        variables: { input: { variant: 'success', message: 'Produto criado!' } }
      })
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const handlePageChange = (currentPage) => {
    setPagination({ page: currentPage })
  }

  const handleRowsPerPageChange = (rows) => {
    setPagination({ offset: rows })
  }

  let productData = null

  if (!internal && gtin && getProductByGTINResult?.data?.productGTIN) {
    const { _id, ...rest } = getProductByGTINResult?.data?.productGTIN
    productData = rest
  }

  /* UI VARIABLES */
  const hasPurchases = dataPurchases?.purchases?.pagination?.totalItems !== 0
  const paginationQuery = dataPurchases?.purchases?.pagination
  const actions = [
    {
      startIcon: <Add />,
      label: 'Adicionar compra com nota fiscal',
      variant: 'outlined',
      color: 'primary',
      onClick: handleDialogInvoiceOpen
    },
    {
      startIcon: <Add />,
      label: 'Adicionar compra manualmente',
      variant: 'outlined',
      color: 'primary',
      onClick: handleDialogManualOpen
    }
  ]
  const fab = {
    actions: [
      {
        icon: <BallotIcon />,
        label: 'Compra manual',
        onClick: handleDialogManualOpen
      },
      {
        icon: <ReceiptIcon />,
        label: 'Cupom Fiscal',
        onClick: handleDialogInvoiceOpen
      }
    ]
  }
  const placeholder = !hasPurchases && !loading && (
    <Placeholder
      icon={<Description />}
      message={'Ainda não há compras'}
      symbol={'👋'}
      actions={actions}
    />
  )

  return (
    <Page className={classes.root}>
      <Main fab={fab} placeholder={placeholder} toolbar>
        <List
          loading={loading}
          avatar
          labels={labels}
          pagination={paginationQuery}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          items={dataPurchases?.purchases.purchases}
          getItemTitle={(item) => item.supplier?.displayName}
          getItemAdornmentTitle={(item) => PurchaseStatus[item.status].label}
          getItemSubtitle={(item) => item.invoice?.accessKey}
          getItemDescription={(item) => item.purchasedAt?.toDate()}
          getItemDisabled={(item) => item.status !== PurchaseStatus.success.type}
          onClick={handleClick}
        />
        <Dialog open={openDialog.invoice} activeContent={'discount'} onClose={handleDialogClose}>
          <NewPurchaseContent
            id={'discount'}
            company={company}
            title='Importar cupom fiscal'
            onSubmit={handleSubmit}
          />
        </Dialog>
        <DialogStepper
          fullScreen={!upMedium}
          fullWidth
          open={openDialog.manual}
          activeStep={activeStep}
          onBack={handleBack}
          onClose={handleDialogClose}
        >
          <SelectImportGoalStep
            id={AddPurchaseSteps.selectGoal}
            title='Adicionar compra manualmente'
            onSubmit={handleSelectImportGoal}
          />
          <UpsertSelectOneStep
            id={AddPurchaseSteps.supplier}
            title='Quem é o fornecedor?'
            onSelect={handleSelectSupplier}
            onAddNew={handleAddNewSupplier}
            getQuery={GET_SUPPLIERS}
            getQueryName={'suppliers'}
            searchQuery={SEARCH_SUPPLIERS}
            searchQueryName={'searchSuppliers'}
            entity={'suppliers'}
            entitiyLabel={'fornecedor'}
            primaryTextAttributes={'displayName'}
            secondaryTextAttributes={'nationalId'}
          />
          <UpsertSupplierStep
            id={AddPurchaseSteps.newSupplier}
            title='Adicione um fornecedor'
            onSubmit={handleNewSupplierSubmit}
          />
          <UpsertFinancialStatementContent
            id={AddPurchaseSteps.financialStatement}
            title='Detalhes da compra'
            isPurchase
            operation={'expense'}
            onSubmit={handleManualPurchaseSubmit}
          />
          <CreateListStep
            id={AddPurchaseSteps.items}
            title='Quais produtos você comprou?'
            listTitle='Lista de compras'
            list={list}
            footerListText={`Total R$ ${list
              .map((item) => item.totalPrice)
              .reduce((a, b) => a + b, 0.0)
              .toFixed(2)}`}
            onDelete={handleDeleteItem}
            onAddNew={handleAddNewProduct}
            onSubmit={handleManualPurchaseSubmit}
            primaryTextAttributes={'name'}
            secondaryTextAttributes={'secondaryText'}
          />
          <UpsertSelectOneStep
            id={AddPurchaseSteps.selectProduct}
            title='Selecione um produto'
            onSelect={handleSelectProduct}
            onAddNew={handleCreateProduct}
            getQuery={GET_PRODUCTS}
            getQueryName={'products'}
            searchQuery={SEARCH_PRODUCTS}
            searchQueryName={'searchProducts'}
            entity={'products'}
            entitiyLabel={'produto'}
            primaryTextAttributes={'name'}
            secondaryTextAttributes={'gtin'}
          />
          <InternalStep
            id={AddPurchaseSteps.internal}
            title='Criar produto'
            onSubmit={handleInternalSubmit}
          />
          <BarcodeStep
            id={AddPurchaseSteps.barcode}
            loading={getProductByGTINResult.loading}
            title='Adicione o código de barras'
            onSubmit={handleBarcodeSubmit}
          />
          <UpsertProductContent
            id={AddPurchaseSteps.addInfo}
            title={'Adicionar informações do produto'}
            loading={createProductResult.loading}
            initialValues={productData ?? { internal, gtin }}
            onSubmit={handleSubmitCreateProduct}
          />
          <AddItemStep
            id={AddPurchaseSteps.newItem}
            title={`Quanto você pagou no item ${selectedProduct && selectedProduct.name}?`}
            item={selectedProduct}
            onSubmit={handleConfirmItem}
          />
        </DialogStepper>
      </Main>
    </Page>
  )
}

export default PurchasesView
