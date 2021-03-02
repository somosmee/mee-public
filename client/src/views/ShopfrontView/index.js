import React, { useContext, useEffect, useState, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'

import PropTypes from 'prop-types'

import CardActions from '@material-ui/core/CardActions'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import Step from '@material-ui/core/Step'
import StepContent from '@material-ui/core/StepContent'
import StepLabel from '@material-ui/core/StepLabel'
import Stepper from '@material-ui/core/Stepper'
import { useTheme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Add from '@material-ui/icons/Add'
import CropFreeIcon from '@material-ui/icons/CropFree'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import LinkIcon from '@material-ui/icons/Link'
import Storefront from '@material-ui/icons/Storefront'

import UpsertSelectOneStep from 'src/components/AddPurchaseSteps/UpsertSelectOneStep'
import Alert from 'src/components/Alert'
import Button from 'src/components/Button'
import DialogStepper from 'src/components/DialogStepper'
import Main from 'src/components/Main'
import Page from 'src/components/Page'
import Placeholder from 'src/components/Placeholder'
import BarcodeStep from 'src/components/ProductSteps/BarcodeStep'
import InternalStep from 'src/components/ProductSteps/InternalStep'
import Shopfront from 'src/components/Shopfront'
import ShopfrontQRCode from 'src/components/ShopfrontQRCode'

import { GET_PRODUCTS, SEARCH_PRODUCTS } from 'src/graphql/product/queries'

import AppBarContext from 'src/contexts/AppBarContext'

import useCompany from 'src/hooks/useCompany'
import useProduct from 'src/hooks/useProduct'
import useUserAddress from 'src/hooks/useUserAddress'
import useUserDeliveryFee from 'src/hooks/useUserDeliveryFee'

import UpsertProductContent from 'src/dialogs/UpsertProductContent'

import addressUtils from 'src/utils/address'
import { FirebaseEvents, AddProductShopfrontSteps } from 'src/utils/enums'

import helpscout from 'src/services/helpscout'

import { analytics } from 'src/firebase'

import useStyles from './styles'

const ShopfrontView = ({
  loading,
  shopfront,
  onLinkCopied,
  onCreateProduct,
  createProductLoading,
  onAddProductShopfront,
  onDeleteProductShopfront
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const upMedium = useMediaQuery(theme.breakpoints.up('md'))

  const {
    getMyCompany: [getMyCompany, { data }],
    updateMyCompany: [updateMyCompany]
  } = useCompany()

  const company = data?.myCompany

  const { UpsertAddressForm, addressProps } = useUserAddress(company?.address)
  const { DeliveryFeesForm, deliveryFeeProps } = useUserDeliveryFee(company?.settings.delivery)
  const [, setAppBar] = useContext(AppBarContext)
  const orderReceiptRef = useRef()
  const handlePrint = useReactToPrint({ content: () => orderReceiptRef.current })
  const {
    getProductByGTIN: [getProductByGTIN, getProductByGTINResult]
  } = useProduct()

  const [openDialog, setOpenDialog] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const [internal, setInternal] = useState(null)
  const [gtin, setGTIN] = useState(null)
  const [activeDialogStep, setActiveDialogStep] = useState(AddProductShopfrontSteps.selectProduct)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [activeConfigStep, setActiveConfigStep] = useState(0)

  const hasInfoSetup = company?.address && company?.settings.delivery?.length > 0
  const hasProducts = shopfront?.products?.length > 0
  const [hostname] = window.location.href.split('/shopfront')
  const shopfrontLink = `${hostname}/vitrines/${shopfront?._id}`

  useEffect(() => {
    const title = 'Vitrine digital 🛒'
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

  const handleOpenAddProductDialog = () => {
    setOpenDialog(true)
  }

  const handleCloseAddProductDialog = () => {
    setOpenDialog(false)
    setActiveDialogStep(AddProductShopfrontSteps.selectProduct)
  }

  const handleAlertClose = () => {
    setOpenAlert(false)
  }

  const handleAlertExited = () => {
    setSelectedProduct(null)
  }

  const handleClickCreateNewProduct = () => {
    setActiveDialogStep(AddProductShopfrontSteps.internal)
  }

  const handleUpdateAddress = async ({ noNumber, ...input }) => {
    if (noNumber) input.number = 'S/N'

    const geoData = await addressUtils.geocodeAddress(input)
    await updateMyCompany({ address: { ...input, ...geoData } })

    setActiveConfigStep((prevActiveConfigStep) => prevActiveConfigStep + 1)
  }

  const handleUpdateDeliveryFee = (submit) => async () => {
    await submit()
  }

  const handleDeleteProduct = (product) => {
    setSelectedProduct(product)
    setOpenAlert(true)
  }

  const handleAlertConfirm = async () => {
    await onDeleteProductShopfront({ userProduct: selectedProduct._id })
    setOpenAlert(false)
  }

  const handleSubmitCreateProduct = async (input) => {
    await onCreateProduct(input)
    setInternal(null)
    setGTIN(null)
    setActiveDialogStep(AddProductShopfrontSteps.selectProduct)
  }

  const handleSelectProduct = async (product) => {
    await onAddProductShopfront({
      product: product._id,
      price: product.price
    })

    handleCloseAddProductDialog()
  }

  const handleDialogBack = () => {
    switch (activeDialogStep) {
      case AddProductShopfrontSteps.selectProduct:
        handleCloseAddProductDialog()
        break
      case AddProductShopfrontSteps.createProduct:
        setActiveDialogStep(AddProductShopfrontSteps.selectProduct)
        break
      default:
        break
    }
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(shopfrontLink)
    onLinkCopied()
  }

  const handleInternalSubmit = (internal) => {
    setInternal(internal)

    if (internal) {
      setActiveDialogStep(AddProductShopfrontSteps.createProduct)
    } else {
      setActiveDialogStep(AddProductShopfrontSteps.barcode)
    }
  }

  const handleBarcodeSubmit = async ({ gtin }) => {
    setGTIN(gtin)
    await getProductByGTIN(gtin)
    setActiveDialogStep(AddProductShopfrontSteps.createProduct)
  }

  // fill product gtin info logic
  let productData = null

  if (!internal && gtin && getProductByGTINResult?.data?.productGTIN) {
    const { _id, ...rest } = getProductByGTINResult?.data?.productGTIN
    productData = rest
  }

  const actions = [
    {
      startIcon: <Add />,
      label: 'Adicionar produto',
      variant: 'outlined',
      color: 'primary',
      onClick: handleOpenAddProductDialog
    }
  ]
  const fab = { actions: { onClick: handleOpenAddProductDialog } }

  const placeholder = hasInfoSetup && !hasProducts && (
    <Placeholder
      icon={<Storefront />}
      message='Ainda não há produtos na sua vitrine'
      symbol='👋'
      actions={actions}
    />
  )

  return (
    <Page className={classes.root}>
      <Main loading={loading} placeholder={placeholder} fab={fab}>
        {(!company?.address || !hasInfoSetup) && (
          <Container maxWidth='sm'>
            <Typography variant='h5' paragraph>
              Adicionar o endereço e taxa de entrega
            </Typography>
            <Stepper activeStep={activeConfigStep} orientation='vertical'>
              <Step>
                <StepLabel>Informe o endereço do seu estabelecimento</StepLabel>
                <StepContent>
                  <UpsertAddressForm
                    {...addressProps}
                    onSubmit={handleUpdateAddress}
                    actions={(submitting, pristine, invalid) => (
                      <CardActions>
                        <Button
                          type='submit'
                          variant='contained'
                          color='primary'
                          loading={submitting}
                        >
                          Salvar endereço
                        </Button>
                      </CardActions>
                    )}
                  />
                </StepContent>
              </Step>
              <Step>
                <StepLabel>Informe a sua taxa de entrega</StepLabel>
                <StepContent>
                  <DeliveryFeesForm
                    {...deliveryFeeProps}
                    actions={(loading, onSubmit, isEmpty) => (
                      <CardActions>
                        <Button
                          variant='contained'
                          color='primary'
                          loading={loading}
                          disabled={isEmpty}
                          onClick={handleUpdateDeliveryFee(onSubmit)}
                        >
                          Salvar taxa e criar vitrine
                        </Button>
                      </CardActions>
                    )}
                  />
                </StepContent>
              </Step>
            </Stepper>
          </Container>
        )}
        {hasInfoSetup && hasProducts && (
          <Grid container justify='center' spacing={3}>
            <Grid xs={12} item container justify='center' spacing={3}>
              <Grid item>
                <Button
                  startIcon={<FileCopyIcon />}
                  onClick={handleCopyToClipboard}
                  color='primary'
                  variant='outlined'
                >
                  Copiar link da sua Vitrine
                </Button>
              </Grid>
              <Grid item>
                <Link
                  href={shopfrontLink}
                  target='_blank'
                  rel='noopener noreferrer'
                  color='inherit'
                >
                  <Button startIcon={<LinkIcon />} color='primary' variant='outlined'>
                    Visitar Vitrine
                  </Button>
                </Link>
              </Grid>
              <Grid item>
                <Button
                  startIcon={<CropFreeIcon />}
                  onClick={handlePrint}
                  color='primary'
                  variant='outlined'
                >
                  Imprimir QR Code
                </Button>
              </Grid>
            </Grid>
            <Grid xs={12} item>
              <ShopfrontQRCode ref={orderReceiptRef} link={shopfrontLink} />
            </Grid>
            <Grid xs={12} className={classes.shopfront} item>
              <Shopfront products={shopfront.products} onDeleteProduct={handleDeleteProduct} />
            </Grid>
          </Grid>
        )}
        <DialogStepper
          fullScreen={!upMedium}
          fullWidth
          open={openDialog}
          activeStep={activeDialogStep}
          onBack={handleDialogBack}
          onClose={handleCloseAddProductDialog}
        >
          <UpsertSelectOneStep
            id={AddProductShopfrontSteps.selectProduct}
            title='Selecione um produto'
            onSelect={handleSelectProduct}
            onAddNew={handleClickCreateNewProduct}
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
            id={AddProductShopfrontSteps.internal}
            title='Criar produto'
            onSubmit={handleInternalSubmit}
          />
          <BarcodeStep
            id={AddProductShopfrontSteps.barcode}
            loading={getProductByGTINResult.loading}
            title='Adicione o código de barras'
            onSubmit={handleBarcodeSubmit}
          />
          <UpsertProductContent
            id={AddProductShopfrontSteps.createProduct}
            title={'Adicionar informações do produto'}
            loading={createProductLoading}
            initialValues={productData ?? { internal, gtin }}
            onSubmit={handleSubmitCreateProduct}
          />
        </DialogStepper>
        <Alert
          open={openAlert}
          onClose={handleAlertClose}
          onExited={handleAlertExited}
          title='Excluir produto da vitrine?'
          primaryLabel='Excluir'
          secondaryLabel='Voltar'
          onPrimary={handleAlertConfirm}
          onSecondary={handleAlertClose}
        >
          Este produto será apagado permanentemente da vitrine.
        </Alert>
      </Main>
    </Page>
  )
}

ShopfrontView.propTypes = {
  loading: PropTypes.bool,
  shopfront: PropTypes.object,
  onLinkCopied: PropTypes.func,
  onCreateProduct: PropTypes.func,
  createProductLoading: PropTypes.bool,
  onAddProductShopfront: PropTypes.func,
  onDeleteProductShopfront: PropTypes.func
}

ShopfrontView.defaultProps = {
  onLinkCopied: () => {},
  onCreateProduct: () => {},
  onAddProductShopfront: () => {},
  onDeleteProductShopfront: () => {}
}

export default ShopfrontView
