import React, { useState, useContext, useEffect } from 'react'

import clsx from 'clsx'

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
import Color from 'src/components/Color'
import Dialog from 'src/components/Dialog'
import List from 'src/components/List'
import Main from 'src/components/Main'
import Page from 'src/components/Page'

import AppBarContext from 'src/contexts/AppBarContext'

import useCompany from 'src/hooks/useCompany'
import useFinancialStatementCategory from 'src/hooks/useFinancialStatementCategory'

import UpsertFinancialStatementCategoryContent from 'src/dialogs/UpsertFinancialStatementCategoryContent'

import { FirebaseEvents, FinancialOperations } from 'src/utils/enums'

import helpscout from 'src/services/helpscout'

import { analytics } from 'src/firebase'

import useStyles from './styles'

const FinancialStatementCategoriesView = () => {
  const classes = useStyles()

  const labels = [
    {
      key: ['color'],
      name: 'Cor',
      // eslint-disable-next-line
      render: (value) => <Color color={value} />
    },
    {
      key: ['name'],
      name: 'Nome'
    }
  ]

  const [, setAppBar] = useContext(AppBarContext)

  /**
   * REACT STATE
   */

  const [openDialog, setOpenDialog] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const [selectedOperation, setSelectedOperation] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    const title = 'Categorias'
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

  const {
    deleteFinancialStatementCategory: [deleteFinancialStatementCategory]
  } = useFinancialStatementCategory()

  /**
   * CONTROLLERS
   */

  const handleSubmit = async (input, operation) => {
    const key = operation === FinancialOperations.EXPENSE ? 'expenseCategories' : 'incomeCategories'

    if (!input.id) {
      updateMyCompany({ [key]: [...company[key], input] })
    } else {
      const index = company[key].findIndex((pay) => pay.id === input.id)

      if (index >= 0) {
        const inputArray = [...company[key]]
        inputArray[index] = input
        updateMyCompany({ [key]: inputArray })
      }
    }

    handleCloseDialog()
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedCategory(null)
    setSelectedOperation(null)
  }

  const handleOpenDialog = () => {
    setOpenDialog(true)
  }

  const handleOpenAlert = () => {
    setOpenAlert(true)
  }

  const handleCloseAlert = () => {
    setOpenAlert(false)
    setSelectedCategory(null)
    setSelectedOperation(null)
  }

  const handleEditClick = (item, operation) => () => {
    setSelectedCategory(item)
    setSelectedOperation(operation)
    handleOpenDialog()
  }

  const handleDeleteClick = (item, operation) => () => {
    setSelectedCategory(item)
    setSelectedOperation(operation)
    handleOpenAlert()
  }

  const handleDeleteSubmit = async () => {
    setOpenAlert(false)

    await deleteFinancialStatementCategory({ id: selectedCategory.id })

    setSelectedCategory(null)
    setSelectedOperation(null)
  }

  const handleCreateExpenseCategoryClick = () => {
    setSelectedOperation(FinancialOperations.EXPENSE)
    handleOpenDialog()
  }

  const handleCreateIncomeCategoryClick = () => {
    setSelectedOperation(FinancialOperations.INCOME)
    handleOpenDialog()
  }

  const fab = {
    actions: [
      {
        icon: <TrendingDownIcon style={{ color: red[600] }} />,
        label: 'Despesa',
        onClick: handleCreateExpenseCategoryClick
      },
      {
        icon: <TrendingUpIcon style={{ color: green[600] }} />,
        label: 'Receita',
        onClick: handleCreateIncomeCategoryClick
      }
    ]
  }

  return (
    <Page className={classes.root}>
      <Main fab={fab}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant='h4' gutterBottom>
              Despesas
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <List
              loading={false}
              labels={labels}
              items={company?.expenseCategories}
              getItemTitle={(item) => item.name}
              getItemSubtitle={(item) => {
                const circle = (
                  <div
                    className={clsx(classes.shape, classes.shapeCircle)}
                    style={{ backgroundColor: item.color }}
                  />
                )
                return circle
              }}
              onClick={() => {}}
              onFilterChange={() => {}}
              renderActions={(item, index) => (
                <>
                  <Tooltip title='Editar'>
                    <IconButton
                      aria-label='Editar'
                      onClick={handleEditClick(item, FinancialOperations.EXPENSE)}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Deletar'>
                    <IconButton
                      disabled={index < 5}
                      aria-label='Deletar'
                      onClick={handleDeleteClick(item, FinancialOperations.EXPENSE)}
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
              Receitas
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <List
              loading={false}
              labels={labels}
              items={company?.incomeCategories}
              getItemTitle={(item) => item.name}
              getItemSubtitle={(item) => {
                const circle = (
                  <div
                    className={clsx(classes.shape, classes.shapeCircle)}
                    style={{ backgroundColor: item.color }}
                  />
                )
                return circle
              }}
              onClick={() => {}}
              onFilterChange={() => {}}
              renderActions={(item, index) => (
                <>
                  <Tooltip title='Editar'>
                    <IconButton
                      aria-label='Editar'
                      onClick={handleEditClick(item, FinancialOperations.INCOME)}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Deletar'>
                    <IconButton
                      disabled={index < 3}
                      aria-label='Deletar'
                      onClick={handleDeleteClick(item, FinancialOperations.INCOME)}
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
          <UpsertFinancialStatementCategoryContent
            id={'paymentMethod'}
            title={`${selectedCategory ? 'Atualizar' : 'Criar'} categoria`}
            operation={selectedOperation}
            initialValues={selectedCategory || null}
            onSubmit={handleSubmit}
          />
        </Dialog>
        <Alert
          open={openAlert}
          loading={false}
          onClose={handleCloseAlert}
          title={'Deletar categoria'}
          onPrimary={handleDeleteSubmit}
          primaryLabel={'Deletar'}
          onSecondary={handleCloseAlert}
          secondaryLabel='Voltar'
        >
          {
            'Essa categoria será deletada permanentemente e as transações que estavam dentro dela irão para categoria geral de despesas ou receitas.'
          }
        </Alert>
      </Main>
    </Page>
  )
}

FinancialStatementCategoriesView.propTypes = {}

FinancialStatementCategoriesView.defaultProps = {}

export default FinancialStatementCategoriesView
