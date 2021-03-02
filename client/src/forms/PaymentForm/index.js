import React, { useEffect } from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'

import Divider from '@material-ui/core//Divider'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListSubheader from '@material-ui/core/ListSubheader'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import TextFieldMaterial from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import AccountBalance from '@material-ui/icons/AccountBalance'
import Category from '@material-ui/icons/Category'
import LocalAtm from '@material-ui/icons/LocalAtm'
import Money from '@material-ui/icons/Money'
import Payment from '@material-ui/icons/Payment'

import ChipGroup from 'src/components/ChipGroup'
import PriceFormat from 'src/components/PriceFormat'
import TextField from 'src/components/TextField'

import useCompany from 'src/hooks/useCompany'

import { Payments, Banknotes } from 'src/utils/enums'
import numeral from 'src/utils/numeral'

import useStyles from './styles'

const validate = (values) => {
  const errors = {}

  if (!values.value) {
    errors.value = 'Valor pago é obrigatório'
  }

  if (parseFloat(values?.value || 0) <= 0) {
    errors.value = 'Valor precisa ser maior que 0'
  }

  return errors
}

const PaymentForm = ({ actions, initialValues: { total }, onSubmit }) => {
  const classes = useStyles()

  const {
    getMyCompany: [getMyCompany, { loading, data: dataCompany }]
  } = useCompany()
  const company = dataCompany?.myCompany

  useEffect(() => {
    getMyCompany()
  }, [])

  if (loading) {
    return (
      <Grid>
        <CircularProgress />
      </Grid>
    )
  }

  const hasPaymentMethods = company?.paymentMethods?.length > 0

  const { form, handleSubmit, values, invalid, pristine, submitting } = useForm({
    initialValues: {
      total,
      value: parseFloat(total),
      received: parseFloat(total),
      category: '600075bf981c03d9baa2db73',
      method: company?.paymentMethods[0]
    },
    validate,
    onSubmit
  })

  const value = useField('value', form)
  const category = useField('category', form)
  const financialFund = useField('financialFund', form)

  const isCash = values.method?.method === Payments.cash.type
  const banknotes = [
    { type: total, label: `${numeral(total).format('$ 0.0')}` },
    ...Banknotes
  ].filter((banknote) => banknote.type > parseFloat(total))

  const change = parseFloat(values.received) - parseFloat(values.value)

  const handleAmountReceivedChange = (value) => {
    form.change('received', value)
  }

  const handleAmountReceivedInputChange = (event) => {
    form.change('received', event.target.value)
  }

  const handleSetType = (id) => {
    const paymentMethod = company.paymentMethods.find((pm) => pm.id === id)
    form.change('method', paymentMethod)
    form.change('financialFund', paymentMethod.financialFund?.id || null)
  }

  const renderFundMenuItem = (fund, index) => {
    return (
      <MenuItem key={index} value={fund.id}>
        {fund.name}
      </MenuItem>
    )
  }

  const renderCategoryMenuItem = (category) => {
    return (
      <MenuItem key={category.id} value={category.id}>
        {category.name}
      </MenuItem>
    )
  }

  const margin = 'dense'

  return (
    <form classes={classes.root} onSubmit={handleSubmit}>
      <Grid container spacing={2} alignItems='center'>
        <Grid item xs>
          <Typography variant='h4'>Total do pedido</Typography>
        </Grid>
        <Grid item>
          <Typography variant='h4'>{numeral(total).format()}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider variant='middle' />
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <List subheader={<ListSubheader>Forma de pagamento</ListSubheader>} disablePadding>
              <ListItem>
                <ListItemIcon>
                  {values.method === 'cash' && <Money />}
                  {values.method !== 'cash' && <Payment />}
                </ListItemIcon>
                {hasPaymentMethods && (
                  <ChipGroup
                    values={Object.values(
                      company.paymentMethods.map((pay) => ({
                        type: pay.id,
                        label: pay.name
                      }))
                    )}
                    selected={values.method?.id}
                    onChange={handleSetType}
                  />
                )}
              </ListItem>
            </List>
          </Paper>
        </Grid>
        {isCash && (
          <Grid item xs={12}>
            <Paper>
              <List subheader={<ListSubheader>Valor recebido</ListSubheader>} disablePadding>
                <ListItem>
                  <ListItemIcon>
                    <LocalAtm />
                  </ListItemIcon>
                  <ChipGroup
                    values={banknotes}
                    selected={parseFloat(values.received)}
                    onChange={handleAmountReceivedChange}
                  />
                  <TextFieldMaterial
                    value={values.received}
                    onChange={handleAmountReceivedInputChange}
                    InputProps={{
                      inputComponent: PriceFormat
                    }}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        )}
        <Grid item xs={12}>
          <Paper>
            <List subheader={<ListSubheader>Valor a pagar</ListSubheader>} disablePadding>
              <ListItem>
                <ListItemIcon>
                  <LocalAtm />
                </ListItemIcon>
                <TextField
                  {...value}
                  placeholder='0,00'
                  InputProps={{
                    inputComponent: PriceFormat
                  }}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item></Grid>
        {isCash && (
          <>
            <Grid item xs={12}>
              <Divider variant='middle' />
            </Grid>
            <Grid item xs>
              <Typography variant='h4'>Troco</Typography>
            </Grid>
            <Grid item>
              <Typography variant='h4'>{numeral(change).format('0.00')}</Typography>
            </Grid>
          </>
        )}
      </Grid>
      <Grid item xs={12}>
        <Divider className={classes.divider} variant='middle' />
      </Grid>
      <Grid className={classes.financialFundContainer} item xs={12}>
        <Paper>
          <List subheader={<ListSubheader>Categoria</ListSubheader>} disablePadding>
            <ListItem>
              <ListItemIcon>
                <Category />
              </ListItemIcon>
              <TextField
                select
                {...category}
                type='text'
                label='Categoria'
                margin={margin}
                fullWidth
              >
                {company?.incomeCategories?.map(renderCategoryMenuItem)}
              </TextField>
            </ListItem>
          </List>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Divider className={classes.divider} variant='middle' />
      </Grid>
      <Grid className={classes.financialFundContainer} item xs={12}>
        <Paper>
          <List subheader={<ListSubheader>Fundo financeiro</ListSubheader>} disablePadding>
            <ListItem>
              <ListItemIcon>
                <AccountBalance />
              </ListItemIcon>
              <TextField
                select
                {...financialFund}
                type='text'
                label='Fundo Financeiro'
                margin={margin}
                fullWidth
              >
                {company?.financialFunds
                  ?.concat([{ id: null, name: 'Nenhum' }])
                  .map(renderFundMenuItem)}
              </TextField>
            </ListItem>
          </List>
        </Paper>
      </Grid>
      {actions && actions(submitting, pristine, invalid, handleSubmit)}
    </form>
  )
}

PaymentForm.propTypes = {
  actions: PropTypes.func,
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object
}

PaymentForm.defaultProps = {
  actions: () => {},
  onSubmit: () => {}
}

export default PaymentForm
