import React, { useEffect } from 'react'

import PropTypes from 'prop-types'
import { v4 as uuidv4 } from 'uuid'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Checkbox from '@material-ui/core/Checkbox'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import TextField from '@material-ui/core/TextField'

import AddOutlined from '@material-ui/icons/AddOutlined'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'

import Button from 'src/components/Button'

import useStyles from './styles'

const not = (a, b) => {
  return a.filter((value) => b.map((item) => item.id).indexOf(value.id) === -1)
}

const intersection = (a, b) => {
  return a.filter((value) => b.map((item) => item.id).indexOf(value.id) !== -1)
}

const union = (a, b) => {
  return [...a, ...not(b, a)]
}

const mapItems = (items) => {
  const list = []
  const map = {}

  for (const item of items) {
    for (let i = 0; i < item.quantity; i++) {
      const data = { id: uuidv4(), ...item }
      list.push(data)
      map[data.id] = data
    }
  }

  return { list, map }
}

const groupItems = (items) => {
  const map = {}

  for (const item of items) {
    if (item.product in map) {
      const data = map[item.product]
      map[item.product] = { ...data, quantity: data.quantity + 1 }
    } else {
      map[item.product] = { ...item, quantity: 1 }
    }
  }

  return Object.values(map)
}

const TransferItemsContent = ({ loading, orders, initialValues, onClose, onSubmit }) => {
  const classes = useStyles()

  /**
   * SEARCH
   */

  // left
  const [searchTermLeft, setSearchTermLeft] = React.useState('')
  const [searchResultsLeft, setSearchResultsLeft] = React.useState([])

  const handleChangeLeft = (event) => {
    setSearchTermLeft(event.target.value)
  }

  // right
  const [searchTermRight, setSearchTermRight] = React.useState('')
  const [searchResultsRight, setSearchResultsRight] = React.useState([])

  const handleChangeRight = (event) => {
    setSearchTermRight(event.target.value)
  }

  useEffect(() => {
    const results = orders.filter(
      (order) =>
        order.title?.toLowerCase().includes(searchTermLeft) ||
        order.shortID.toLowerCase().includes(searchTermLeft)
    )
    setSearchResultsLeft(results)
  }, [searchTermLeft])

  useEffect(() => {
    const results = orders.filter(
      (order) =>
        order.title?.toLowerCase().includes(searchTermRight) ||
        order.shortID.toLowerCase().includes(searchTermRight)
    )
    setSearchResultsRight(results)
  }, [searchTermRight])

  const [orderLeft, setOrderLeft] = React.useState(initialValues)
  const [orderRight, setOrderRight] = React.useState(null)

  const [checked, setChecked] = React.useState([])

  let iniItems = []

  if (initialValues) {
    const { list } = mapItems(initialValues.items)
    iniItems = list
  }

  const [left, setLeft] = React.useState(iniItems)

  const [right, setRight] = React.useState(null)

  const leftChecked = intersection(checked, left)
  const rightChecked = intersection(checked, right || [])

  const handleToggle = (item) => () => {
    const currentIndex = checked.map((item) => item.id).indexOf(item.id)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(item)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
  }

  const numberOfChecked = (items) => intersection(checked, items).length

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items))
    } else {
      setChecked(union(checked, items))
    }
  }

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked))
    setLeft(not(left, leftChecked))
    setChecked(not(checked, leftChecked))
  }

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked))
    setRight(not(right, rightChecked))
    setChecked(not(checked, rightChecked))
  }

  const handleSubmit = () => {
    const newOrderLeft = {
      ...orderLeft,
      items: groupItems(
        left.map((item) => {
          const { id, ...data } = item
          return data
        })
      )
    }

    const newOrderRight = {
      ...orderRight,
      items: groupItems(
        right.map((item) => {
          const { id, ...data } = item
          return data
        })
      )
    }

    onSubmit({ orderLeft: newOrderLeft, orderRight: newOrderRight })
  }

  const handleBackLeft = () => {
    setOrderLeft(null)
  }

  const handleBackRight = () => {
    setOrderRight(null)
  }

  const customList = (title, items, side) => (
    <Card>
      <Button
        color='primary'
        disabled={side === 'left'}
        startIcon={<KeyboardArrowLeft />}
        onClick={side === 'left' ? handleBackLeft : handleBackRight}
      >
        Voltar
      </Button>
      <CardHeader
        className={classes.cardHeader}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
            disabled={items.length === 0}
            inputProps={{ 'aria-label': 'all items selected' }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selecionados`}
      />
      <Divider />
      <List className={classes.list} dense component='div' role='list'>
        {items.map((item) => {
          const labelId = `transfer-list-all-item-${item.id}-label`

          return (
            <ListItem key={item.id} role='listitem' button onClick={handleToggle(item)}>
              <ListItemIcon>
                <Checkbox
                  checked={checked.map((i) => i.id).indexOf(item.id) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={item.name} />
            </ListItem>
          )
        })}
        <ListItem />
      </List>
    </Card>
  )

  const handleSelectOrderLeft = (order) => () => {
    const { list } = mapItems(order.items)

    setOrderLeft(order)
    setLeft(list)
    setSearchResultsLeft([])
  }

  const handleSelectOrderRight = (order) => () => {
    const { list } = mapItems(order.items)

    setOrderRight(order)
    setRight(list)
    setSearchResultsRight([])
  }

  const handleSelectNewOrderRight = () => {
    setOrderRight({})
    setRight([])
    setSearchResultsRight([])
  }

  const renderSelectOrderList = (orders, side) => (
    <Card>
      <CardContent>
        <Grid container spacing={1} direction='column'>
          <Grid item>
            {side === 'right' && (
              <Button
                startIcon={<AddOutlined />}
                color='primary'
                onClick={handleSelectNewOrderRight}
              >
                Criar novo pedido
              </Button>
            )}
          </Grid>
          <Grid item>
            <TextField
              id='search'
              label='Buscar pedido'
              placeholder='Digite o título ou número do pedido'
              onChange={side === 'left' ? handleChangeLeft : handleChangeRight}
            />
          </Grid>
          <Grid item>
            <Divider />
          </Grid>
        </Grid>
        <List className={classes.list} dense component='div' role='list'>
          {orders.map((order) => (
            <ListItem
              key={order._id}
              role='listitem'
              button
              disabled={side === 'left' ? false : order?._id === orderLeft?._id}
              onClick={
                side === 'left' ? handleSelectOrderLeft(order) : handleSelectOrderRight(order)
              }
            >
              <ListItemText
                id={order._id}
                primary={`${order.title || 'sem título'} #${order.shortID}`}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  )

  const isNewOrder = !!(orderRight && orderRight._id === undefined)

  return (
    <>
      <DialogContent className={classes.root}>
        <Grid container spacing={2} justify='center' alignItems='center' className={classes.root}>
          {!orderLeft && (
            <Grid item>
              {renderSelectOrderList(
                searchResultsLeft?.length > 0 ? searchResultsLeft : orders,
                'left'
              )}
            </Grid>
          )}
          {orderLeft && (
            <Grid item>
              {customList(`${orderLeft?.title || ''} #${orderLeft.shortID}`, left, 'left')}
            </Grid>
          )}
          <Grid item>
            <Grid container direction='column' alignItems='center'>
              <Button
                variant='outlined'
                size='small'
                className={classes.button}
                onClick={handleCheckedRight}
                disabled={leftChecked.length === 0 || !right}
                aria-label='move selected right'
              >
                &gt;
              </Button>
              <Button
                variant='outlined'
                size='small'
                className={classes.button}
                onClick={handleCheckedLeft}
                disabled={rightChecked.length === 0}
                aria-label='move selected left'
              >
                &lt;
              </Button>
            </Grid>
          </Grid>
          {!orderRight && (
            <Grid item>
              {renderSelectOrderList(
                searchResultsRight?.length > 0 ? searchResultsRight : orders,
                'right'
              )}
            </Grid>
          )}
          {orderRight && (
            <Grid item>
              {customList(
                `${orderRight?.title || ''} #${orderRight.shortID || 'novo pedido'}`,
                right,
                'right'
              )}
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color='secondary' size='large' variant='outlined' onClick={onClose}>
          CANCELAR
        </Button>
        <Button
          color='primary'
          variant='contained'
          type='submit'
          size='large'
          disabled={!right || (isNewOrder && right?.length === 0) || !left}
          loading={loading}
          onClick={handleSubmit}
        >
          SALVAR
        </Button>
      </DialogActions>
    </>
  )
}

TransferItemsContent.propTypes = {
  initialValues: PropTypes.object,
  orders: PropTypes.array,
  loading: PropTypes.bool,
  order: PropTypes.object,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func
}

TransferItemsContent.defaultProps = {}

export default TransferItemsContent
