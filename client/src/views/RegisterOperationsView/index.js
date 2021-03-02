import React, { useState, useContext, useEffect } from 'react'

import moment from 'moment'

import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'

import Assignment from '@material-ui/icons/Assignment'
import AssignmentTurnedIn from '@material-ui/icons/AssignmentTurnedIn'
import Delete from '@material-ui/icons/DeleteOutlined'

import Alert from 'src/components/Alert'
import Dialog from 'src/components/Dialog'
import List from 'src/components/List'
import Main from 'src/components/Main'
import Page from 'src/components/Page'
import Placeholder from 'src/components/Placeholder'

import AppBarContext from 'src/contexts/AppBarContext'

import usePagination from 'src/hooks/usePagination'
import useRegisterOperation from 'src/hooks/useRegisterOperation'

import CloseRegisterContent from 'src/dialogs/CloseRegisterContent'
import OpenRegisterContent from 'src/dialogs/OpenRegisterContent'
import RegisterOperationPreviewContent from 'src/dialogs/RegisterOperationPreviewContent'

import { FirebaseEvents, LabelTypes } from 'src/utils/enums'

import helpscout from 'src/services/helpscout'

import { analytics } from 'src/firebase'

import useStyles from './styles'

const INITIAL_DIALOG_STATE = {
  openRegister: false,
  closeRegister: false,
  view: false
}

const labels = [
  {
    key: ['createdAt'],
    type: LabelTypes.date,
    name: 'Data',
    format: 'DD/MM/YYYY'
  },
  {
    key: ['operationType'],
    name: 'Operação',
    render: (value) => {
      return value === 'close' ? 'Fechamento de caixa' : 'Abertura de caixa'
    }
  },
  {
    key: ['createdBy'],
    name: 'Autor',
    render: (value) => {
      return value.email
    }
  }
]

const RegisterOperationsView = () => {
  const classes = useStyles()

  const [, setAppBar] = useContext(AppBarContext)
  const [pagination, setPagination] = usePagination()

  /**
   * REACT STATE
   */

  const [openDialog, setOpenDialog] = useState(INITIAL_DIALOG_STATE)
  const [openAlert, setOpenAlert] = useState(false)
  const [selectedRegisterOperation, setSelectedRegisterOperation] = useState(null)

  useEffect(() => {
    const title = 'Histórico de fechamentos'
    setAppBar({ prominent: false, overhead: false, color: 'white', title: title.toLowerCase() })
    document.title = `${title} | Mee`
    analytics.logEvent(FirebaseEvents.SCREEN_VIEW, { screen_name: title })
  }, [setAppBar])

  useEffect(() => {
    helpscout.hideBeacon()
  }, [])

  const {
    getRegisterOperations: [getRegisterOperations, { data, loading }],
    createRegisterOperation: [createRegisterOperation],
    deleteRegisterOperation: [deleteRegisterOperation]
  } = useRegisterOperation()

  useEffect(() => {
    getRegisterOperations({ first: pagination.offset, skip: pagination.page * pagination.offset })
  }, [])

  const registerOperations = data?.registerOperations?.registerOperations

  /**
   * CONTROLLERS
   */

  const handleOpenRegisterSubmit = async (input) => {
    await createRegisterOperation(input)

    handleCloseDialog()
  }

  const handleCloseRegisterSubmit = async (input) => {
    await createRegisterOperation(input)

    handleCloseDialog()
  }

  const handleCloseDialog = () => {
    setOpenDialog(INITIAL_DIALOG_STATE)
  }

  const handleOpenAlert = () => {
    setOpenAlert(true)
  }

  const handleClickOpenRegister = () => {
    setOpenDialog((state) => ({ ...state, openRegister: true }))
  }

  const handleClickCloseRegister = () => {
    setOpenDialog((state) => ({ ...state, closeRegister: true }))
  }

  const handleCloseAlert = () => {
    setOpenAlert(false)
    setSelectedRegisterOperation(null)
  }

  const handleDeleteClick = (item) => (event) => {
    event.stopPropagation()
    handleOpenAlert()
    setSelectedRegisterOperation(item)
  }

  const handleDeleteSubmit = async () => {
    await deleteRegisterOperation({ id: selectedRegisterOperation.id })
    handleCloseAlert()
  }

  const handlePageChange = (currentPage) => {
    setPagination({ page: currentPage })
  }

  const handleRowsPerPageChange = (rows) => {
    setPagination({ offset: rows })
  }

  const handleClick = (item) => {
    setSelectedRegisterOperation(item)
    setOpenDialog((state) => ({ ...state, view: true }))
  }

  const hasRegisterOperations = data?.registerOperations?.pagination?.totalItems !== 0

  const placeholder = !hasRegisterOperations && (
    <Placeholder
      icon={<Assignment />}
      message={'Ainda não há fechamentos'}
      subtitle={
        <Box>
          <Typography className={classes.subtitle} variant='body1' color='textSecondary'>
            Aqui você pode:
          </Typography>
          <ul className={classes.bulletPoints}>
            <Typography variant='subtitle1' color='textSecondary' component='li'>
              Ver seu histórico de <b>aberturas e fechamentos de caixa</b>
            </Typography>
            <Typography variant='body1' color='textSecondary' component='li'>
              Abrir e fechar o caixa
            </Typography>
          </ul>
        </Box>
      }
      symbol={'👋'}
    />
  )

  const fab = {
    actions: [
      {
        icon: <Assignment />,
        label: 'Abrir caixa',
        onClick: handleClickOpenRegister
      },
      {
        icon: <AssignmentTurnedIn />,
        label: 'Fechar caixa',
        onClick: handleClickCloseRegister
      }
    ]
  }

  return (
    <Page className={classes.root}>
      <Main fab={fab} placeholder={placeholder}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <List
              id='registerOperations'
              loading={loading}
              labels={labels}
              items={registerOperations}
              onClick={handleClick}
              pagination={data?.registerOperations.pagination}
              getItemTitle={(item) => moment(item.createdAt).format('DD/MM/YYYY')}
              getItemSubtitle={(item) => item.operationType}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              renderActions={(item, index, disabled) => (
                <Tooltip title='Excluir'>
                  <IconButton
                    id='delete'
                    aria-label='Excluir'
                    disabled={disabled}
                    onClick={handleDeleteClick(item)}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              )}
            />
          </Grid>
        </Grid>
        <Dialog open={openDialog.openRegister} onClose={handleCloseDialog} onExited={() => {}}>
          <OpenRegisterContent title={'Abrir caixa'} onSubmit={handleOpenRegisterSubmit} />
        </Dialog>
        <Dialog open={openDialog.closeRegister} onClose={handleCloseDialog} onExited={() => {}}>
          <CloseRegisterContent title={'Fechar caixa'} onSubmit={handleCloseRegisterSubmit} />
        </Dialog>
        <Dialog open={openDialog.view} onClose={handleCloseDialog} onExited={() => {}}>
          <RegisterOperationPreviewContent
            title={
              selectedRegisterOperation?.operationType === 'close'
                ? 'Fechamento de Caixa'
                : 'Abertura de Caixa'
            }
            registerOperation={selectedRegisterOperation}
          />
        </Dialog>
        <Alert
          open={openAlert}
          loading={false}
          onClose={handleCloseAlert}
          title={'Deletar operação de caixa'}
          onPrimary={handleDeleteSubmit}
          primaryLabel={'Deletar'}
          onSecondary={handleCloseAlert}
          secondaryLabel='Voltar'
        >
          {
            'Esse registro será permanentemente deletado junto com todas as transações de ajuste. Deseja continuar?'
          }
        </Alert>
      </Main>
    </Page>
  )
}

RegisterOperationsView.propTypes = {}

RegisterOperationsView.defaultProps = {}

export default RegisterOperationsView
