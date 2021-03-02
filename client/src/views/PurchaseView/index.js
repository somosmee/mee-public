import React, { useContext, useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'

import { useQuery, useMutation } from '@apollo/react-hooks'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import Add from '@material-ui/icons/AddCircleOutlined'
import Edit from '@material-ui/icons/EditOutlined'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'

import Link from 'src/components/Link'
import List from 'src/components/List'
import ListItemAction from 'src/components/ListItemAction'
import Main from 'src/components/Main'
import Page from 'src/components/Page'
import Placeholder from 'src/components/Placeholder'
import PurchaseInfo from 'src/components/PurchaseInfo'

import {
  GET_PURCHASE,
  CREATE_PURCHASE_ITEM,
  UPDATE_PURCHASE_ITEM,
  IMPORT_PURCHASE_ITEMS
} from 'src/graphql/purchase/gqls'

import AppBarContext from 'src/contexts/AppBarContext'

import ImportEditItemForm from 'src/forms/ImportEditItemForm'
import ImportNewProductForm from 'src/forms/ImportNewProductForm'

import { FirebaseEvents, LabelTypes, PurchaseItemStatus, Paths } from 'src/utils/enums'
import numeral from 'src/utils/numeral'

import { analytics } from 'src/firebase'

import useStyles from './styles'

const labels = [
  [
    {
      key: ['gtin'],
      name: 'Chave de acesso'
    },
    {
      key: ['name'],
      name: 'Nome'
    }
  ],
  {
    key: ['quantity'],
    name: 'Quantidade',
    type: LabelTypes.number
  },
  {
    key: ['measurement'],
    name: 'Unidade'
  },
  {
    key: ['unitPrice'],
    name: 'Preço unitário',
    type: LabelTypes.currency
  },
  {
    key: ['totalPrice'],
    name: 'Total',
    type: LabelTypes.currency
  },
  {
    key: ['status'],
    name: 'Status'
  }
]

const PurchaseView = () => {
  const classes = useStyles()

  const { purchaseId } = useParams()
  const history = useHistory()
  const [, setAppBar] = useContext(AppBarContext)

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [openImportEditItemForm, setOpenImportEditItemForm] = useState(null)
  const [openNewProductForm, setOpenNewProductForm] = useState(null)

  const { data } = useQuery(GET_PURCHASE, { variables: { id: purchaseId } })
  const [createPurchaseItem] = useMutation(CREATE_PURCHASE_ITEM)
  const [updatePurchaseItem] = useMutation(UPDATE_PURCHASE_ITEM)
  const [importPurchaseItems] = useMutation(IMPORT_PURCHASE_ITEMS)

  useEffect(() => {
    const title = 'Compra'
    setAppBar({ prominent: false, overhead: false, color: 'white', title: title.toLowerCase() })
    document.title = `${title} | Mee`
    analytics.logEvent(FirebaseEvents.SCREEN_VIEW, { screen_name: title })
  }, [setAppBar])

  const handleDialogClose = () => {
    setOpenImportEditItemForm(false)
    setOpenNewProductForm(false)
  }

  const handleResetState = () => {
    setSelectedProduct(null)
  }

  const handleAction = (action, item) => () => {
    switch (action) {
      case 'edit':
        setSelectedProduct(item)
        setOpenImportEditItemForm(true)
        break
      case 'add':
        setSelectedProduct(item)
        setOpenNewProductForm(true)
        break
      default:
        break
    }
  }

  const handleEditItem = async ({ id, gtin, quantity }) => {
    const variables = { id: purchaseId, item: id, input: { gtin, quantity } }

    try {
      await updatePurchaseItem({ variables })
      // openSnackbar({ variant: 'success', message: 'Item atualizado' })
    } catch ({ message }) {
      // openSnackbar({ variant: 'error', message })
    } finally {
      handleDialogClose()
    }
  }

  const handleAddItem = async (values) => {
    const variables = { id: purchaseId, input: { ...values } }

    try {
      await createPurchaseItem({ variables })
      // openSnackbar({ variant: 'success', message: 'Produto adicionado' })
    } catch ({ message }) {
      // openSnackbar({ variant: 'error', message })
    } finally {
      handleDialogClose()
    }
  }

  const handleImport = async () => {
    const variables = { id: purchaseId }

    try {
      await importPurchaseItems({ variables })
      // openSnackbar({ variant: 'success', message: 'Importação feita' })
    } catch ({ message }) {
      // openSnackbar({ variant: 'error', message })
    }
  }

  const handleBack = () => {
    history.push(Paths.purchases.path)
  }

  const purchase = data && data.purchase
  const openDialog = openImportEditItemForm || openNewProductForm
  const hasItems = !!purchase?.items.length
  const hasDraft =
    hasItems && purchase.items.some((item) => item.status === PurchaseItemStatus.draft.type)
  const allImported =
    hasItems &&
    purchase.items.every((item) => item.status === PurchaseItemStatus.addedToInventory.type)
  const placeholder = !hasItems && (
    <Placeholder message={'Ainda não há items nesta compra'} symbol={'👋'} />
  )

  return (
    <Page className={classes.root}>
      <Main placeholder={placeholder}>
        <Box marginBottom={2}>
          <Link startIcon={<KeyboardArrowLeft />} onClick={handleBack}>
            Voltar
          </Link>
        </Box>
        {hasItems && (
          <>
            {hasDraft && !allImported && (
              <Toolbar className={classes.toolbar}>
                <Typography color='inherit' variant='subtitle1'>
                  Os produtos serão automáticamente adicionados ao seu estoque
                </Typography>
                <Button
                  className={classes.button}
                  variant='contained'
                  color='secondary'
                  onClick={handleImport}
                >
                  Adicionar ao estoque
                </Button>
              </Toolbar>
            )}
            <PurchaseInfo purchase={purchase} />
            <List
              labels={labels}
              items={purchase.items}
              getItemTitle={(item) => item.name}
              getItemAdornmentTitle={(item) => numeral(item.totalPrice).format('$ 0.00')}
              getItemSubtitle={(item) => item.gtin}
              getItemDescription={(item) =>
                `${item.quantity} x ${numeral(item.unitPrice).format('$ 0.00')}`
              }
              getItemInformation={(item) => PurchaseItemStatus[item.status]?.label}
              getItemDisabled={(item) =>
                item.status === PurchaseItemStatus.new.type ||
                item.status === PurchaseItemStatus.addedToInventory.type
              }
              renderActions={(item, index, disabled) => (
                <>
                  <ListItemAction
                    title='Editar'
                    onClick={handleAction('edit', item, index)}
                    disabled={item.status === PurchaseItemStatus.addedToInventory.type}
                  >
                    <Edit />
                  </ListItemAction>
                  <ListItemAction
                    title='Adicionar'
                    onClick={handleAction('add', item, index)}
                    disabled={item.product}
                  >
                    <Add />
                  </ListItemAction>
                </>
              )}
            />
          </>
        )}
        <Dialog open={openDialog} onClose={handleDialogClose} onExited={handleResetState}>
          {openImportEditItemForm && (
            <ImportEditItemForm
              product={selectedProduct}
              onSubmit={handleEditItem}
              onClose={handleDialogClose}
            />
          )}
          {openNewProductForm && (
            <ImportNewProductForm
              product={{
                gtin: selectedProduct.gtin,
                ncm: selectedProduct.ncm,
                name: selectedProduct.name,
                measurement: selectedProduct.measurement
              }}
              onSubmit={handleAddItem}
              onClose={handleDialogClose}
            />
          )}
        </Dialog>
      </Main>
    </Page>
  )
}

export default PurchaseView
