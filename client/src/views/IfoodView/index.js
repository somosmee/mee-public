import React, { useContext, useState, useEffect } from 'react'

import { useMutation, useQuery, useLazyQuery } from '@apollo/react-hooks'
import debounce from 'lodash.debounce'

import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Paper from '@material-ui/core/Paper'
import { useTheme } from '@material-ui/core/styles'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Add from '@material-ui/icons/Add'

import Alert from 'src/components/Alert'
import Dialog from 'src/components/Dialog'
import Main from 'src/components/Main'
import Menu from 'src/components/Menu'
import Page from 'src/components/Page'
import TabPanel from 'src/components/TabPanel'

import { CREATE_SETUP_SESSION } from 'src/graphql/billing/gqls'
import {
  GET_IFOOD_CATEGORIES,
  CREATE_IFOOD_CATEGORY,
  UPDATE_IFOOD_CATEGORY,
  DELETE_IFOOD_CATEGORY,
  ADD_IFOOD_ITEM,
  UNLINK_IFOOD_ITEM,
  UPDATE_IFOOD_ITEM_AVAILABILITY,
  CREATE_IFOOD_MODOFIER,
  UPDATE_IFOOD_MODOFIER,
  DELETE_IFOOD_MODOFIER,
  GET_IFOOD_PRICE_ANALYSIS
} from 'src/graphql/ifood/queries'
import { OPEN_NOTIFICATION } from 'src/graphql/notification/queries'
import { GET_PRODUCT, SEARCH_PRODUCTS } from 'src/graphql/product/queries'

import AppBarContext from 'src/contexts/AppBarContext'

import AddIfoodItemContent from 'src/dialogs/AddIfoodItemContent'
import AddIfoodModifierItemContent from 'src/dialogs/AddIfoodModifierItemContent'
import UpsertIfoodCategoryContent from 'src/dialogs/UpsertIfoodCategoryContent'

import { FirebaseEvents } from 'src/utils/enums'

import { analytics } from 'src/firebase'

import useStyles from './styles'

const DialogContents = {
  upsertIfoodCategory: 'upsertIfoodCategory',
  addIfoodItem: 'addIfoodItem',
  addIfoodModifierItem: 'addIfoodModifierItem'
}

const TabStatus = Object.freeze({
  DASHBOARD: 'dashboard',
  MENU: 'menu'
})

const IfoodView = () => {
  const stripe = window.Stripe(process.env.REACT_APP_STRIPE_API_KEY)

  const theme = useTheme()
  const classes = useStyles()
  const upMedium = useMediaQuery(theme.breakpoints.up('md'))

  const [, setAppBar] = useContext(AppBarContext)
  const [openDialog, setOpenDialog] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const [activeContent, setActiveContent] = useState(null)
  const [text, setText] = useState('')
  const setTextDebounced = debounce(setText, 250)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [modifier, setModifier] = useState(null)
  const [selectedItemIds, setSelectedItemIds] = useState([])
  const [suggestions, setSuggestions] = useState(null)
  const [gtin, setGtin] = useState(null)
  const [tab, setTab] = useState(TabStatus.DASHBOARD)

  const [openNotification] = useMutation(OPEN_NOTIFICATION)
  const [, { data: dataSession }] = useMutation(CREATE_SETUP_SESSION)

  const categoryOptions = {
    refetchQueries: [{ query: GET_IFOOD_CATEGORIES }],
    awaitRefetchQueries: true
  }

  const [getProduct, product] = useLazyQuery(GET_PRODUCT, { fetchPolicy: 'network-only' })
  const [searchProducts, results] = useLazyQuery(SEARCH_PRODUCTS, {
    variables: { text },
    fetchPolicy: 'network-only'
  })
  const { loading: getIfoodCategoriesLoading, data: getIfoodCategories } = useQuery(
    GET_IFOOD_CATEGORIES,
    {
      fetchPolicy: 'network-only'
    }
  )
  const [createIfoodCategory, { loading: createIfoodCategoryLoading }] = useMutation(
    CREATE_IFOOD_CATEGORY,
    categoryOptions
  )
  const [updateIfoodCategory, { loading: updateIfoodCategoryLoading }] = useMutation(
    UPDATE_IFOOD_CATEGORY
  )
  const [deleteIfoodCategory, { loading: deleteIfoodCategoryLoading }] = useMutation(
    DELETE_IFOOD_CATEGORY,
    categoryOptions
  )
  const [addIfoodItem] = useMutation(ADD_IFOOD_ITEM, categoryOptions)
  const [unlinkIfoodItem] = useMutation(UNLINK_IFOOD_ITEM, categoryOptions)
  const { data: dataPriceAnalysis } = useQuery(GET_IFOOD_PRICE_ANALYSIS, {
    fetchPolicy: 'network-only'
  })

  const [updateIfoodItemAvailability] = useMutation(UPDATE_IFOOD_ITEM_AVAILABILITY)
  const [createIfoodModifier] = useMutation(CREATE_IFOOD_MODOFIER, categoryOptions)
  const [deleteIfoodModifier] = useMutation(DELETE_IFOOD_MODOFIER, categoryOptions)
  const [updateIfoodModifier] = useMutation(UPDATE_IFOOD_MODOFIER)

  if (dataSession) {
    stripe
      .redirectToCheckout({
        // Make the id field from the Checkout Session creation API response
        // available to this file, so you can provide it as parameter here
        // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
        sessionId: dataSession.createSetupSession.session
      })
      .then(function(result) {
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer
        // using `result.error.message`.
      })
  }

  useEffect(() => {
    const title = 'Cardápio - iFood'
    setAppBar({ prominent: false, overhead: false, color: 'white', title: title.toLowerCase() })
    document.title = 'iFood | Mee'
    analytics.logEvent(FirebaseEvents.SCREEN_VIEW, { screen_name: title })
  }, [setAppBar])

  useEffect(() => {
    text ? searchProducts() : setSuggestions(null)
  }, [text, searchProducts])

  useEffect(() => {
    const hasResults = results?.data?.searchProducts.length

    if (results.called && !results.loading && hasResults) {
      setSuggestions(results.data.searchProducts)
    } else if (results.error) {
      setSuggestions(null)
    }
  }, [results])

  useEffect(() => {
    if (gtin) {
      getProduct({ variables: { input: { gtin } } })
    }
  }, [gtin, getProduct])

  useEffect(() => {
    window.Beacon('destroy')
  })

  const handleAlertOpen = (category) => {
    setSelectedCategory(category)
    setOpenAlert(true)
  }

  const handleAlertClose = () => {
    setOpenAlert(false)
  }

  const handleAlertOnExited = () => {
    setSelectedCategory(null)
  }

  const handleDialogClose = () => {
    setOpenDialog(false)
  }

  const handleOnExited = () => {
    setSelectedCategory(null)
    setSelectedItemIds([])
  }

  const handleItemAdd = (category) => {
    setSelectedCategory(category)
    setActiveContent(DialogContents.addIfoodItem)
    setOpenDialog(true)
  }

  const handleIfoodCreateCategory = () => {
    setActiveContent(DialogContents.upsertIfoodCategory)
    setOpenDialog(true)
  }

  const handleIfoodCategorySubmit = async ({ externalCode, ...category }) => {
    try {
      if (externalCode) {
        await updateIfoodCategory({ variables: { input: { externalCode, ...category } } })
        openNotification({
          variables: { input: { variant: 'success', message: 'Menu atualizado' } }
        })
        analytics.logEvent(FirebaseEvents.IFOOD_MENU_CATEGORY_UPDATE)
      } else {
        await createIfoodCategory({ variables: { input: category } })
        openNotification({
          variables: { input: { variant: 'success', message: 'Menu criado' } }
        })
        analytics.logEvent(FirebaseEvents.IFOOD_MENU_CATEGORY_CREATE)
      }
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    } finally {
      handleDialogClose()
    }
  }

  const handleCategoryEdit = async (category) => {
    setSelectedCategory(category)
    setActiveContent(DialogContents.upsertIfoodCategory)
    setOpenDialog(true)
  }

  const handleIfoodCategoryDelete = async () => {
    try {
      await deleteIfoodCategory({
        variables: {
          input: { id: selectedCategory.id, externalCode: selectedCategory.externalCode }
        }
      })
      openNotification({
        variables: { input: { variant: 'success', message: 'Menu apagado' } }
      })
      analytics.logEvent(FirebaseEvents.IFOOD_MENU_CATEGORY_DELETE, {
        category: selectedCategory.externalCode
      })
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    } finally {
      handleAlertClose()
    }
  }

  const handleIfoodItemAdd = async (product) => {
    try {
      await addIfoodItem({
        variables: {
          input: {
            category: selectedCategory.id,
            categoryExternalCode: selectedCategory.externalCode,
            product: product._id
          }
        }
      })
      openNotification({
        variables: { input: { variant: 'success', message: 'Item adicionado' } }
      })
      analytics.logEvent(FirebaseEvents.IFOOD_MENU_ITEM_ADD, {
        category: selectedCategory.externalCode,
        product: product._id
      })
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    } finally {
      setOpenDialog(false)
    }
  }

  const handleItemUnlink = async (category, item) => {
    try {
      await unlinkIfoodItem({
        variables: {
          input: {
            category: category.id,
            categoryExternalCode: category.externalCode,
            externalCode: item.externalCode
          }
        }
      })
      openNotification({
        variables: { input: { variant: 'success', message: 'Item desvinculado da categoria' } }
      })
      analytics.logEvent(FirebaseEvents.IFOOD_MENU_ITEM_DELETE, {
        category: category.externalCode,
        externalCode: item.externalCode
      })
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const handleItemAvailabilityChange = async (category, item, option, available) => {
    try {
      await updateIfoodItemAvailability({
        variables: {
          input: {
            category: category.id,
            item: option ? item.id : null,
            externalCode: option ? option.externalCode : item.externalCode,
            available
          }
        }
      })
      openNotification({
        variables: { input: { variant: 'success', message: 'Disponibilidade do item atualizada' } }
      })
      analytics.logEvent(FirebaseEvents.IFOOD_MENU_ITEM_AVAILABILITY_CHANGE, {
        externalCode: item.externalCode,
        available
      })
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const handleModifierItemSubmit = async () => {
    try {
      await createIfoodModifier({
        variables: {
          input: {
            category: selectedCategory.id,
            categoryExternalCode: selectedCategory.externalCode,
            name: modifier.name,
            gtin: selectedProduct.externalCode,
            modifiers: selectedItemIds,
            minimum: 1,
            maximum: 1
          }
        }
      })
      openNotification({
        variables: { input: { variant: 'success', message: 'Complemento criado' } }
      })
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    } finally {
      setOpenDialog(false)
    }
  }

  const handleModifierDelete = async (category, item, modifier) => {
    try {
      await deleteIfoodModifier({
        variables: {
          input: {
            category: category.id,
            externalCode: modifier.externalCode,
            item: item.id,
            name: modifier.name,
            minimum: modifier.minimum,
            maximum: modifier.maximum,
            position: modifier.position
          }
        }
      })
      openNotification({
        variables: { input: { variant: 'success', message: 'Complemento deletado' } }
      })
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    } finally {
      setOpenDialog(false)
    }
  }

  const handleModifierAvailabilityChange = async (category, item, modifier, available) => {
    try {
      await updateIfoodModifier({
        variables: {
          input: {
            category: category.id,
            externalCode: modifier.externalCode,
            item: item.id,
            name: modifier.name,
            minimum: modifier.minimum,
            maximum: modifier.maximum,
            position: modifier.position,
            available
          }
        }
      })
      openNotification({
        variables: {
          input: { variant: 'success', message: 'Disponibilidade do complemento atualizada' }
        }
      })
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const handleModifierItemAdd = (category, item) => {
    setGtin(item.externalCode)
    setSelectedCategory(category)
    setSelectedProduct(item)
    setActiveContent(DialogContents.addIfoodModifierItem)
    setOpenDialog(true)
  }

  const handleModifierItemChange = (id) => {
    if (selectedItemIds.includes(id)) {
      setSelectedItemIds((prevItemIds) => prevItemIds.filter((currentId) => currentId !== id))
    } else {
      setSelectedItemIds((prevItemIds) => prevItemIds.concat(id))
    }
  }

  const handleModifierNameSubmit = (name) => {
    setModifier((prevState) => ({ ...prevState, name }))
  }

  const handleFilterChange = (term) => {
    setTextDebounced(term)
  }

  const handleTabChange = (event, newValue) => {
    if (tab !== newValue) {
      setTab(newValue)
    }
  }

  const renderProduct = (item, index) => (
    <ListItem key={index}>
      <ListItemText primary={`${item.name} ${item.percent.toFixed(2)}%`} />
    </ListItem>
  )

  const actions = [
    {
      startIcon: <Add />,
      label: 'Adicionar categoria',
      variant: 'outlined',
      color: 'primary',
      onClick: handleIfoodCreateCategory
    }
  ]

  const fab = {
    actions: {
      onClick: handleIfoodCreateCategory
    }
  }

  const hasPriceAnalysis = dataPriceAnalysis?.ifoodPriceAnalysis

  return (
    <Page className={classes.root}>
      <Main header loading={getIfoodCategoriesLoading} actions={actions} fab={fab}>
        <Paper className={classes.tabs} square>
          <Tabs
            value={tab}
            indicatorColor='primary'
            textColor='primary'
            variant={upMedium ? 'fullWidth' : 'scrollable'}
            scrollButtons='auto'
            onChange={handleTabChange}
            aria-label='Order tab status'
          >
            <Tab value={TabStatus.DASHBOARD} label='Dashboard' />
            <Tab value={TabStatus.MENU} label='Cardápio' />
          </Tabs>
        </Paper>
        <TabPanel value={tab} tab={TabStatus.DASHBOARD}>
          <Container maxWidth='sm' disableGutters>
            <Grid container spacing={3}>
              {hasPriceAnalysis && (
                <>
                  <Grid item xs={12} sm={6}>
                    <Card className={classes.card}>
                      <CardHeader title={'Visão geral dos preços'} />
                      <CardContent>
                        <Typography color='textSecondary' gutterBottom>
                          Média de preço do mercado: R${' '}
                          {dataPriceAnalysis?.ifoodPriceAnalysis?.general?.marketMedian.toFixed(2)}
                        </Typography>
                        <Typography color='textSecondary' gutterBottom>
                          Sua média de preços: R${' '}
                          {dataPriceAnalysis?.ifoodPriceAnalysis?.general?.median.toFixed(2)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card className={classes.card}>
                      <CardHeader title={'Alerta de preços'} />
                      <CardContent>
                        {dataPriceAnalysis?.ifoodPriceAnalysis?.alerts?.length === 0 && (
                          <Typography color='textSecondary' gutterBottom>
                            Não encontramos produtos suficientes para comparação
                          </Typography>
                        )}
                        {dataPriceAnalysis?.ifoodPriceAnalysis?.alerts?.length > 0 && (
                          <Box>
                            <Typography color='textSecondary' gutterBottom>
                              Porcentagem que os seus preços se encontram acima ou abaixo da média
                              do mercado.
                            </Typography>
                            {
                              <List subheader={<ListSubheader>Produtos</ListSubheader>} dense>
                                {dataPriceAnalysis?.ifoodPriceAnalysis?.alerts.map(renderProduct)}
                              </List>
                            }
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </>
              )}
              {!hasPriceAnalysis && (
                <Grid item xs={12}>
                  <Paper>
                    <Typography color='textPrimary' gutterBottom>
                      Estamos coletando e processando os dados da sua região. Aguarde :)
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Container>
        </TabPanel>

        <TabPanel value={tab} tab={TabStatus.MENU}>
          <Container maxWidth='sm' disableGutters>
            <Menu
              categories={getIfoodCategories?.getIfoodCategories.categories || []}
              modifier={modifier}
              onEdit={handleCategoryEdit}
              onDelete={handleAlertOpen}
              onItemUnlink={handleItemUnlink}
              onItemAvailabilityChange={handleItemAvailabilityChange}
              onItemAdd={handleItemAdd}
              onModifierItemAdd={handleModifierItemAdd}
              onModifierNameSubmit={handleModifierNameSubmit}
              onModifierDelete={handleModifierDelete}
              onModifierAvailabilityChange={handleModifierAvailabilityChange}
            />
          </Container>
        </TabPanel>
        <Alert
          open={openAlert}
          title='Apagar categoria?'
          loading={deleteIfoodCategoryLoading}
          onPrimary={handleIfoodCategoryDelete}
          primaryLabel='Sim'
          onSecondary={handleAlertClose}
          secondaryLabel='Não'
          onExited={handleAlertOnExited}
          onClose={handleAlertClose}
        >
          Não será possível reverter.
        </Alert>
        <Dialog
          className={classes.dialog}
          open={openDialog}
          activeContent={activeContent}
          onClose={handleDialogClose}
          onExited={handleOnExited}
        >
          <UpsertIfoodCategoryContent
            id={DialogContents.upsertIfoodCategory}
            title={selectedCategory ? 'Editar categoria' : 'Criar categoria'}
            loading={createIfoodCategoryLoading || updateIfoodCategoryLoading}
            category={selectedCategory}
            onSubmit={handleIfoodCategorySubmit}
          />
          <AddIfoodItemContent
            id={DialogContents.addIfoodItem}
            title={`Quais itens quer adicionar em ${selectedCategory?.name}?`}
            loading={results.loading}
            options={suggestions}
            onInputChange={handleFilterChange}
            onProductChange={handleIfoodItemAdd}
          />
          <AddIfoodModifierItemContent
            id={DialogContents.addIfoodModifierItem}
            title={`Quais complementos quer adicionar em ${selectedProduct?.name}?`}
            loading={product.loading}
            items={selectedItemIds}
            product={product.called && product.data?.product}
            onChange={handleModifierItemChange}
            onSubmit={handleModifierItemSubmit}
          />
        </Dialog>
      </Main>
    </Page>
  )
}

// IfoodView.propTypes = {}
//
// IfoodView.defaultProps = {}

export default IfoodView
