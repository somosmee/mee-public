import React, { useState, useContext, useEffect } from 'react'

import moment from 'moment'

import Box from '@material-ui/core/Box'
import green from '@material-ui/core/colors/green'
import red from '@material-ui/core/colors/red'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'

import AccountBalance from '@material-ui/icons/AccountBalance'
import AccountBalanceWallet from '@material-ui/icons/AccountBalanceWallet'
import AssessmentIcon from '@material-ui/icons/AssessmentOutlined'
import Delete from '@material-ui/icons/DeleteOutlined'
import TrendingDownIcon from '@material-ui/icons/TrendingDown'
import TrendingUpIcon from '@material-ui/icons/TrendingUp'

import Alert from 'src/components/Alert'
import Dialog from 'src/components/Dialog'
import FinancialFundCard from 'src/components/FinancialFundCard'
import List from 'src/components/List'
import Main from 'src/components/Main'
import Page from 'src/components/Page'
import Placeholder from 'src/components/Placeholder'

import AppBarContext from 'src/contexts/AppBarContext'

import useFinancialFund from 'src/hooks/useFinancialFund'
import useFinancialStatement from 'src/hooks/useFinancialStatement'
import usePagination from 'src/hooks/usePagination'

import UpsertFinancialFundContent from 'src/dialogs/UpsertFinancialFundContent'
import UpsertFinancialStatementContent from 'src/dialogs/UpsertFinancialStatementContent'

import {
  FirebaseEvents,
  LabelTypes,
  FinancialOperations,
  FinancialFundCategories
} from 'src/utils/enums'
import numeral from 'src/utils/numeral'

import helpscout from 'src/services/helpscout'

import { analytics } from 'src/firebase'

import useStyles from './styles'

const labels = [
  {
    key: ['operation'],
    name: 'Operação',
    render: (value) => {
      if (value === FinancialOperations.INCOME) {
        return (
          <Tooltip title='Receita' aria-label='receita'>
            <TrendingUpIcon style={{ color: green[600] }} />
          </Tooltip>
        )
      }
      if (value === FinancialOperations.EXPENSE) {
        return (
          <Tooltip title='Despesa' aria-label='despesa'>
            <TrendingDownIcon style={{ color: red[600] }} />
          </Tooltip>
        )
      }
    }
  },
  {
    key: ['dueAt'],
    type: LabelTypes.date,
    name: 'Data',
    format: 'DD/MM/YYYY HH:mm:ss'
  },
  {
    key: ['description'],
    name: 'Descrição'
  },
  {
    key: ['value'],
    name: 'Valor',
    type: 'currency'
  }
]

const FinancialStatementsView = () => {
  const classes = useStyles()

  const [, setAppBar] = useContext(AppBarContext)

  /**
   * REACT STATE
   */

  const [openAlert, setOpenAlert] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedFund, setSelectedFund] = useState(null)
  const [openFundDialog, setOpenFundDialog] = useState(false)
  const [selectedStatement, setSelectedStatement] = useState(null)
  const [selectedOperation, setSelectedOperation] = useState(null)
  const [selectedFundOperation, setSelectedFundOperation] = useState(null)

  useEffect(() => {
    const title = 'Extrato'
    setAppBar({ prominent: false, overhead: false, color: 'white', title: title.toLowerCase() })
    document.title = `${title} | Mee`
    analytics.logEvent(FirebaseEvents.SCREEN_VIEW, { screen_name: title })
  }, [setAppBar])

  useEffect(() => {
    helpscout.hideBeacon()
  }, [])

  const [pagination, setPagination] = usePagination()

  const {
    getFinancialStatements: [getFinancialStatements, { data, loading }],
    createFinancialStatement: [createFinancialStatement],
    deleteFinancialStatement: [deleteFinancialStatement, { loading: loadingDelete }]
  } = useFinancialStatement()

  const {
    getFinancialFunds: [getFinancialFunds, { data: dataFunds }],
    createFinancialFund: [createFinancialFund],
    updateFinancialFund: [updateFinancialFund]
  } = useFinancialFund()

  useEffect(() => {
    getFinancialStatements({ pagination })
  }, [pagination.page, pagination.offset, dataFunds])

  useEffect(() => {
    getFinancialFunds()
  }, [])

  const financialStatements = data?.financialStatements?.financialStatements
  const paginationQuery = data?.financialStatements?.pagination
  const hasStatements = data?.financialStatements?.pagination?.totalItems !== 0

  /**
   * CONTROLLERS
   */

  const handlePageChange = (currentPage) => {
    setPagination({ page: currentPage })
  }

  const handleRowsPerPageChange = (rows) => {
    setPagination({ offset: rows })
  }

  const handleAddExpense = () => {
    setOpenDialog(true)
    setSelectedOperation(FinancialOperations.EXPENSE)
  }

  const handleAddIncome = () => {
    setOpenDialog(true)
    setSelectedOperation(FinancialOperations.INCOME)
  }

  const handleOpenRegister = () => {
    setOpenFundDialog(true)
    setSelectedFundOperation(FinancialFundCategories.REGISTER)
  }

  const handleOpenAccount = () => {
    setOpenFundDialog(true)
    setSelectedFundOperation(FinancialFundCategories.BANK_ACCOUNT)
  }

  const handleSubmit = async (input) => {
    await createFinancialStatement({ ...input, operation: selectedOperation })
    setOpenDialog(false)
    setSelectedOperation(null)
  }

  const handleFinancialFundSubmit = async (input) => {
    if (input.id) {
      await updateFinancialFund({ id: input.id, name: input.name })
    } else {
      await createFinancialFund(input)
    }

    setOpenFundDialog(false)
    setSelectedFundOperation(null)
  }

  const handleClose = () => {
    setOpenDialog(false)
  }

  const handleCloseFund = () => {
    setOpenFundDialog(false)
    setSelectedFund(null)
  }

  const handleExited = () => {
    setSelectedOperation(null)
  }

  const handleExitedFund = () => {
    setSelectedFundOperation(null)
  }

  const handleDeleteSubmit = async () => {
    await deleteFinancialStatement({ id: selectedStatement._id })
    setOpenAlert(false)
    setSelectedStatement(null)
  }

  const handleCloseAlert = () => {
    setOpenAlert(false)
    setSelectedStatement(null)
  }

  const handleEdit = (fund) => {
    setSelectedFund(fund)
    setOpenFundDialog(true)
  }

  const handleAction = (action, product) => (event) => {
    event && event.stopPropagation()
    setSelectedStatement(product)

    switch (action) {
      case 'delete':
        setOpenAlert(true)
        break
      default:
        break
    }
  }

  const renderDeleteMessage = () => {
    if (selectedStatement) {
      if (selectedStatement.order) {
        return 'O pedido associado a essa movimentação será permanentemente cancelado. Deseja continuar?'
      }
      if (selectedStatement.purchase) {
        return 'A compra associada a essa movimentação será permanentemente deletada. Deseja continuar?'
      }
    }

    return 'A movimentação será permanentemente deletada. Deseja continuar?'
  }

  const renderDeleteButtonLabel = () => {
    if (selectedStatement) {
      if (selectedStatement.order) {
        return 'Cancelar Pedido'
      }
      if (selectedStatement.purchase) {
        return 'Deletar Compra'
      }
    }

    return 'Deletar'
  }

  const fab = {
    actions: [
      {
        icon: <TrendingDownIcon style={{ color: red[600] }} />,
        label: 'Despesa',
        onClick: handleAddExpense
      },
      {
        icon: <TrendingUpIcon style={{ color: green[600] }} />,
        label: 'Receita',
        onClick: handleAddIncome
      },
      {
        icon: <AccountBalanceWallet />,
        label: 'Caixa',
        onClick: handleOpenRegister
      },
      {
        icon: <AccountBalance />,
        label: 'Conta bancária',
        onClick: handleOpenAccount
      }
    ]
  }

  const placeholder = !hasStatements && (
    <Placeholder
      icon={<AssessmentIcon />}
      message={'Ainda não há movimentações'}
      subtitle={
        <Box>
          <Typography className={classes.subtitle} variant='body1' color='textSecondary'>
            Aqui você pode:
          </Typography>
          <ul className={classes.bulletPoints}>
            <Typography variant='subtitle1' color='textSecondary' component='li'>
              Ver seu histórico de <b>entradas e saídas de caixa</b>
            </Typography>
            <Typography variant='body1' color='textSecondary' component='li'>
              Adicionar <b>despesas</b> e <b>receitas</b>
            </Typography>
            <Typography variant='body1' color='textSecondary' component='li'>
              Criar fundos financeiros como <b>caixas</b> e <b>contas bancárias</b>
            </Typography>
          </ul>
        </Box>
      }
      symbol={'👋'}
    />
  )

  return (
    <Page className={classes.root}>
      <Main fab={fab} placeholder={placeholder}>
        <Grid container spacing={3}>
          {dataFunds?.financialFunds &&
            dataFunds.financialFunds.map((fund, index) => (
              <Grid item key={index}>
                <FinancialFundCard fund={fund} onEdit={handleEdit} />
              </Grid>
            ))}
          <Grid item xs={12}>
            <List
              loading={loading}
              labels={labels}
              items={financialStatements}
              getItemTitle={(item) => item.description}
              getItemAdornmentTitle={(item) => numeral(item.value).format('$ 0.00')}
              getItemSubtitle={(item) => item.operation}
              getItemDescription={(item) => moment(item.dueAt).format('DD/MM/YYY HH:mm')}
              onClick={() => {}}
              pagination={paginationQuery}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onFilterChange={() => {}}
              renderActions={(item, index) => (
                <Tooltip title='Deletar'>
                  <IconButton aria-label='Deletar' onClick={handleAction('delete', item, index)}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              )}
            />
          </Grid>
        </Grid>

        <Dialog
          open={openDialog && selectedOperation}
          activeContent={'financialStatement'}
          onClose={handleClose}
          onExited={handleExited}
        >
          <UpsertFinancialStatementContent
            id={'financialStatement'}
            title='Adicionar despesa'
            operation={selectedOperation}
            onSubmit={handleSubmit}
          />
        </Dialog>
        <Dialog
          open={openFundDialog}
          activeContent={'financialFund'}
          onClose={handleCloseFund}
          onExited={handleExitedFund}
        >
          <UpsertFinancialFundContent
            id={'financialFund'}
            title={
              selectedFundOperation === 'register'
                ? `${selectedFund ? 'Atualizar' : 'Adicionar'} caixa`
                : `${selectedFund ? 'Atualizar' : 'Adicionar'} conta bancária`
            }
            initialValues={selectedFund}
            operation={selectedFundOperation}
            onSubmit={handleFinancialFundSubmit}
          />
        </Dialog>
        <Alert
          open={openAlert}
          loading={loadingDelete}
          title='Deletar movimentação'
          onPrimary={handleDeleteSubmit}
          primaryLabel={renderDeleteButtonLabel()}
          onSecondary={handleCloseAlert}
          secondaryLabel='Cancelar'
        >
          {renderDeleteMessage()}
        </Alert>
      </Main>
    </Page>
  )
}

FinancialStatementsView.propTypes = {}

FinancialStatementsView.defaultProps = {}

export default FinancialStatementsView
