import React, { useState, useContext, useEffect } from 'react'

import moment from 'moment'

import green from '@material-ui/core/colors/green'
import red from '@material-ui/core/colors/red'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'

import Delete from '@material-ui/icons/DeleteOutlined'
import Edit from '@material-ui/icons/EditOutlined'
import TrendingDownIcon from '@material-ui/icons/TrendingDown'
import TrendingUpIcon from '@material-ui/icons/TrendingUp'

import Alert from 'src/components/Alert'
import Dialog from 'src/components/Dialog'
import List from 'src/components/List'
import Main from 'src/components/Main'
import Page from 'src/components/Page'

import AppBarContext from 'src/contexts/AppBarContext'

import useCompany from 'src/hooks/useCompany'

import UpsertPaymentMethodContent from 'src/dialogs/UpsertPaymentMethodContent'

import { FirebaseEvents, Payments, PaymentMethodTypes } from 'src/utils/enums'
import numeral from 'src/utils/numeral'

import helpscout from 'src/services/helpscout'

import { analytics } from 'src/firebase'

import useStyles from './styles'

const labels = [
  {
    key: ['method'],
    name: 'Método',
    render: (value) => {
      return Payments[value].label
    }
  },
  {
    key: ['name'],
    name: 'Nome'
  },
  {
    key: ['fee'],
    name: 'Taxa'
  },
  {
    key: ['operationType'],
    name: 'Tipo',
    render: (value) => {
      return value === 'percentage' ? 'Porcentagem' : 'Taxa fixa'
    }
  }
]

const PaymentMethodsView = () => {
  const classes = useStyles()

  const [, setAppBar] = useContext(AppBarContext)

  /**
   * REACT STATE
   */

  const [openDialog, setOpenDialog] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const [selectedOperation, setSelectedOperation] = useState(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null)

  useEffect(() => {
    const title = 'Métodos de Pagamento'
    setAppBar({ prominent: false, overhead: false, color: 'white', title: title.toLowerCase() })
    document.title = `${title} | Mee`
    analytics.logEvent(FirebaseEvents.SCREEN_VIEW, { screen_name: title })
  }, [setAppBar])

  useEffect(() => {
    helpscout.hideBeacon()
  }, [])

  const {
    getMyCompany: [getMyCompany, { data: dataCompany }],
    updateMyCompany: [updateMyCompany]
  } = useCompany()
  const company = dataCompany?.myCompany

  useEffect(() => {
    getMyCompany()
  }, [])

  /**
   * CONTROLLERS
   */

  const cleanInput = (item) => ({
    ...item,
    financialFund: item.financialFund?.id || null
  })

  const handleSubmit = async (input, operation) => {
    const key =
      operation === PaymentMethodTypes.PURCHASE ? 'purchasePaymentMethods' : 'paymentMethods'

    if (!input.id) {
      updateMyCompany({ [key]: [...company[key].map(cleanInput), input] })
    } else {
      const index = company[key].findIndex((pay) => pay.id === input.id)

      if (index >= 0) {
        const inputArray = [...company[key].map(cleanInput)]
        inputArray[index] = input
        updateMyCompany({ [key]: inputArray })
      }
    }

    handleCloseDialog()
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedPaymentMethod(null)
  }

  const handleOpenDialog = () => {
    setOpenDialog(true)
  }

  const handleOpenAlert = () => {
    setOpenAlert(true)
  }

  const handleCloseAlert = () => {
    setOpenAlert(false)
    setSelectedPaymentMethod(null)
  }

  const handleEditClick = (item, operation) => () => {
    setSelectedPaymentMethod(item)
    setSelectedOperation(operation)
    handleOpenDialog()
  }

  const handleDeleteClick = (item, operation) => () => {
    setSelectedPaymentMethod(item)
    setSelectedOperation(operation)
    handleOpenAlert()
  }

  const handleDeleteSubmit = () => {
    setOpenAlert(false)
    const index = company.paymentMethods.findIndex((pay) => pay.id === selectedPaymentMethod.id)

    if (index >= 0) {
      const inputArray = [...company.paymentMethods]
      inputArray.splice(index)
      updateMyCompany({
        paymentMethods: inputArray.map(cleanInput)
      })
    }

    setSelectedPaymentMethod(null)
  }

  const handleCreatePurchaseClick = () => {
    setSelectedOperation(PaymentMethodTypes.PURCHASE)
    handleOpenDialog()
  }

  const handleCreateSaleClick = () => {
    setSelectedOperation(PaymentMethodTypes.SALE)
    handleOpenDialog()
  }

  const fab = {
    actions: [
      {
        icon: <TrendingDownIcon style={{ color: red[600] }} />,
        label: 'Compras',
        onClick: handleCreatePurchaseClick
      },
      {
        icon: <TrendingUpIcon style={{ color: green[600] }} />,
        label: 'Vendas',
        onClick: handleCreateSaleClick
      }
    ]
  }

  return (
    <Page className={classes.root}>
      <Main fab={fab}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant='h4' gutterBottom>
              Vendas
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <List
              loading={false}
              labels={labels}
              items={company?.paymentMethods}
              getItemTitle={(item) => item.description}
              getItemAdornmentTitle={(item) => numeral(item.value).format('$ 0.00')}
              getItemSubtitle={(item) => item.operation}
              getItemDescription={(item) => moment(item.dueAt).format('DD/MM/YYY HH:mm')}
              onClick={() => {}}
              onFilterChange={() => {}}
              renderActions={(item, index) => (
                <>
                  <Tooltip title='Editar'>
                    <IconButton
                      aria-label='Editar'
                      onClick={handleEditClick(item, PaymentMethodTypes.SALE)}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Deletar'>
                    <IconButton
                      disabled={index < 5}
                      aria-label='Deletar'
                      onClick={handleDeleteClick(item, PaymentMethodTypes.SALE)}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant='h4' gutterBottom>
              Compras
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <List
              loading={false}
              labels={labels}
              items={company?.purchasePaymentMethods}
              getItemTitle={(item) => item.description}
              getItemAdornmentTitle={(item) => numeral(item.value).format('$ 0.00')}
              getItemSubtitle={(item) => item.operation}
              getItemDescription={(item) => moment(item.dueAt).format('DD/MM/YYY HH:mm')}
              onClick={() => {}}
              onFilterChange={() => {}}
              renderActions={(item, index) => (
                <>
                  <Tooltip title='Editar'>
                    <IconButton
                      aria-label='Editar'
                      onClick={handleEditClick(item, PaymentMethodTypes.PURCHASE)}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Deletar'>
                    <IconButton
                      disabled={index < 5}
                      aria-label='Deletar'
                      onClick={handleDeleteClick(item, PaymentMethodTypes.PURCHASE)}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            />
          </Grid>
        </Grid>
        <Dialog
          open={openDialog}
          activeContent={'paymentMethod'}
          onClose={handleCloseDialog}
          onExited={() => {}}
        >
          <UpsertPaymentMethodContent
            id={'paymentMethod'}
            title={`${selectedPaymentMethod ? 'Atualizar' : 'Criar'} método de pagamento`}
            initialValues={
              selectedPaymentMethod
                ? {
                    ...selectedPaymentMethod,
                    fee:
                      selectedPaymentMethod.operationType === 'percentage'
                        ? selectedPaymentMethod.fee * 100
                        : selectedPaymentMethod.fee
                  }
                : null
            }
            operation={selectedOperation}
            onSubmit={handleSubmit}
          />
        </Dialog>
        <Alert
          open={openAlert}
          loading={false}
          onClose={handleCloseAlert}
          title={'Deletar método de pagamento'}
          onPrimary={handleDeleteSubmit}
          primaryLabel={'Deletar'}
          onSecondary={handleCloseAlert}
          secondaryLabel='Voltar'
        >
          {'Esse método de pagamento será deletado permanentemente.'}
        </Alert>
      </Main>
    </Page>
  )
}

PaymentMethodsView.propTypes = {}

PaymentMethodsView.defaultProps = {}

export default PaymentMethodsView
