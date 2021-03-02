import React, { useRef, useState, useEffect } from 'react'

import { useMutation } from '@apollo/react-hooks'
import PropTypes from 'prop-types'

import Box from '@material-ui/core/Box'
import DialogBase from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'

import Alert from 'src/components/Alert'
import Button from 'src/components/Button'
import OrderItemList from 'src/components/OrderItemList'
import Search from 'src/components/Search'

import { OPEN_NOTIFICATION } from 'src/graphql/notification/queries'

import useOrder from 'src/hooks/useOrder'
import useSearch from 'src/hooks/useSearch'

import EditItemOrderDialog from 'src/dialogs/EditItemOrderDialog'

import numeral from 'src/utils/numeral'

import useStyles from './styles'

const UpsertOrderContent = ({ loading, order, onClose, addOnlyMode, onSubmit }) => {
  const classes = useStyles()

  const searchInputRef = useRef(null)
  const [search, results] = useSearch({ entity: 'product' })
  const [openDialog, setOpenDialog] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const [index, setIndex] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [term, setTerm] = useState('')

  const [_id] = useState(order?._id || null)
  const [items, setItems] = useState(!addOnlyMode ? (order ? order.items : []) : [])

  const [openNotification] = useMutation(OPEN_NOTIFICATION)
  const {
    getSuggestions: [getSuggestions, { data }]
  } = useOrder()

  useEffect(() => {
    getSuggestions({ id: order._id })
  }, [])

  console.log('data:', data)

  useEffect(() => {
    searchInputRef.current.focus()
  }, [])

  useEffect(() => {
    if (term !== '') {
      search(term)
    }
  }, [term, search])

  const handleAction = (action) => async (index, item, quantity) => {
    setIndex(index)
    setSelectedItem(item)

    switch (action) {
      case 'addNote':
        setOpenDialog(true)
        break
      case 'delete':
        setOpenAlert(true)
        break
      case 'increase':
        handleIncreaseItemQuantity(index)
        break
      case 'decrease':
        handleDecreaseItemQuantity(index)
        break
      case 'quantity':
        handleChangeItemQuantity(index, quantity)
        break
      default:
        break
    }
  }

  /**
   * LIST CONTROLLERS
   */
  const handleIncreaseItemQuantity = (index) => {
    const newItems = items.map((item, currentIndex) => {
      if (currentIndex === index) item.quantity += 1
      return item
    })

    setItems(newItems)
  }

  const handleDecreaseItemQuantity = (index) => {
    const newItems = items.map((item, currentIndex) => {
      if (currentIndex === index) {
        if (item.quantity > 1) {
          item.quantity -= 1
        }
      }
      return item
    })

    setItems(newItems)
  }

  const handleDeleteItem = (index) => {
    const newItems = items.filter((_, currentIndex) => currentIndex !== index)

    setItems(newItems)
  }

  const handleAddItem = (newItem) => {
    const index = items.findIndex((item) => item.gtin === newItem.gtin)

    let newItems

    // is a new item
    if (index === -1) {
      newItems = [newItem].concat(items)
    } else {
      // item exists and we need to increase
      newItems = [...items]
      const item = newItems[index]
      item.quantity += 1
      // remove item
      newItems.splice(index, 1)
      // add it on top
      newItems.unshift(item)
    }

    setItems(newItems)
  }

  const handleEditItemNote = (index, note) => {
    const newItems = items.map((item, currentIndex) => {
      if (currentIndex === index) item.note = note
      return item
    })

    setItems(newItems)
  }

  const handleChangeItemQuantity = (index, quantity) => {
    const newItems = items.map((item, currentIndex) => {
      if (currentIndex === index) item.quantity = quantity
      return item
    })

    setItems(newItems)
  }

  /**
   * Search
   */

  const handleSearchChange = (term) => {
    setTerm(term)
  }

  const handleOptionClick = async (product) => {
    const { _id, gtin, name, description, price, measurement, ncm, productionLine } = product
    try {
      handleAddItem({
        product: _id,
        gtin,
        name,
        description,
        price,
        measurement,
        ncm,
        quantity: 1,
        note: '',
        productionLine
      })
      setTerm('')
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  /**
   * DialogActions
   * */

  const handleCancel = () => {
    onClose()
  }

  const handleSubmit = async () => {
    onSubmit({ _id: _id, items: items, updatedAt: order?.updatedAt })
  }

  /**
   * Dialog
   */

  const handleDialogClose = () => {
    setOpenDialog(false)
    setSelectedItem(null)
  }

  const handleNoteSubmit = async (note) => {
    try {
      handleEditItemNote(index, note)
      setOpenDialog(false)
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  /**
   * Alert
   */

  const handleAlertConfirm = async () => {
    try {
      handleDeleteItem(index)
      setOpenAlert(false)
      openNotification({ variables: { input: { variant: 'success', message: 'Item removido' } } })
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const handleAlertClose = () => {
    setOpenAlert(false)
    setIndex(null)
  }

  const hasItems = !!items.length

  return (
    <>
      <DialogContent className={classes.content}>
        <Search
          size={'large'}
          variant={'outlined'}
          ref={searchInputRef}
          className={classes.search}
          loading={results.loading}
          placeholder='Busque um produto'
          value={term}
          onChange={handleSearchChange}
          options={results.data}
          suggestions={[
            {
              balance: -5,
              bundle: null,
              confidence: 0.2435897435897436,
              createdAt: '2021-02-24T20:24:23.906Z',
              deletedAt: null,
              description: null,
              gtin: '2000001000021',
              image: null,
              internal: true,
              measurement: 'unit',
              modifiers: [],
              name: 'costela',
              ncm: null,
              price: 15.3,
              productionLine: null,
              updatedAt: '2021-02-24T21:06:55.092Z',
              __typename: 'Product',
              _id: '6036b5f7f71697003d4340a1'
            }
          ]}
          onOptionClick={handleOptionClick}
          fullWidth
        />

        {hasItems && (
          <>
            <OrderItemList
              items={items}
              onAddNote={handleAction('addNote')}
              onDelete={handleAction('delete')}
              onIncrease={handleAction('increase')}
              onDecrease={handleAction('decrease')}
              onQuantityChange={handleAction('quantity')}
            />
            <Typography className={classes.total} variant='h6'>
              {`Total: ${numeral(
                items.reduce((total, item) => total + item.price * item.quantity, 0)
              ).format('$ 0.00')}`}
            </Typography>
          </>
        )}
        {!hasItems && (
          <Box margin='20px 20px 20px 20px'>
            <Typography variant='body1' gutterBottom>
              Você ainda não selecionou nenhum item para o seu pedido.
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button id='back' color='secondary' size='large' variant='outlined' onClick={handleCancel}>
          VOLTAR
        </Button>
        <Button
          id={_id ? 'save' : 'create'}
          type='submit'
          loading={loading}
          variant='contained'
          color='primary'
          size='large'
          disabled={!hasItems}
          onClick={handleSubmit}
        >
          {_id ? 'SALVAR' : 'CRIAR'}
        </Button>
      </DialogActions>
      <DialogBase open={openDialog} onClose={handleDialogClose} aria-labelledby='form-dialog-title'>
        {selectedItem && (
          <EditItemOrderDialog note={selectedItem.note} onSubmit={handleNoteSubmit} />
        )}
      </DialogBase>
      <Alert
        open={openAlert}
        title='Remover item?'
        onPrimary={handleAlertConfirm}
        primaryLabel='Remover'
        onSecondary={handleAlertClose}
        secondaryLabel='Voltar'
      >
        Este item será removido do pedido.
      </Alert>
    </>
  )
}

UpsertOrderContent.propTypes = {
  loading: PropTypes.bool,
  order: PropTypes.object,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  addOnlyMode: PropTypes.bool
}

UpsertOrderContent.defaultProps = {
  addOnlyMode: false
}

export default UpsertOrderContent
