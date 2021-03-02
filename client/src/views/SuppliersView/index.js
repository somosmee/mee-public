import React, { useContext, useState, useEffect } from 'react'

import { useQuery, useMutation } from '@apollo/react-hooks'

import Dialog from '@material-ui/core/Dialog'

import Add from '@material-ui/icons/Add'
import Remove from '@material-ui/icons/DeleteOutlined'
import Edit from '@material-ui/icons/EditOutlined'
import LocalShipping from '@material-ui/icons/LocalShipping'

import Alert from 'src/components/Alert'
import List from 'src/components/List'
import ListItemAction from 'src/components/ListItemAction'
import Main from 'src/components/Main'
import Page from 'src/components/Page'
import Placeholder from 'src/components/Placeholder'

import { OPEN_NOTIFICATION } from 'src/graphql/notification/queries'
import {
  GET_SUPPLIERS,
  CREATE_SUPPLIER,
  UPDATE_SUPPLIER,
  DELETE_SUPPLIER
} from 'src/graphql/supplier/queries'

import AppBarContext from 'src/contexts/AppBarContext'

import NewSupplierForm from 'src/forms/NewSupplierForm'

import usePagination from 'src/hooks/usePagination'

import { FirebaseEvents } from 'src/utils/enums'

import helpscout from 'src/services/helpscout'

import { analytics } from 'src/firebase'

import useStyles from './styles'

const labels = [
  [
    {
      key: ['nationalId'],
      name: 'CNPJ'
    },
    {
      key: ['displayName'],
      name: 'Nome'
    }
  ],
  {
    key: ['name'],
    name: 'Razão Social'
  },
  {
    key: ['phone'],
    name: 'Telefone'
  },
  {
    key: ['description'],
    name: 'Descrição'
  }
]

const SuppliersView = () => {
  const classes = useStyles()

  const [, setAppBar] = useContext(AppBarContext)
  const [pagination, setPagination] = usePagination()

  const options = {
    refetchQueries: [
      {
        query: GET_SUPPLIERS,
        variables: {
          input: {
            pagination: { first: pagination.offset, skip: pagination.page * pagination.offset }
          }
        }
      }
    ]
  }

  const [openDialog, setOpenDialog] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState(null)

  const { loading, data } = useQuery(GET_SUPPLIERS, {
    variables: {
      input: { pagination: { first: pagination.offset, skip: pagination.page * pagination.offset } }
    },
    fetchPolicy: 'network-only'
  })
  const [createSupplier] = useMutation(CREATE_SUPPLIER, options)
  const [updateSupplier] = useMutation(UPDATE_SUPPLIER, options)
  const [deleteSupplier] = useMutation(DELETE_SUPPLIER, options)
  const [openNotification] = useMutation(OPEN_NOTIFICATION)

  useEffect(() => {
    const title = 'Fornecedores'
    setAppBar({ prominent: false, overhead: false, color: 'white', title: title.toLowerCase() })
    document.title = `${title} | Mee`
    analytics.logEvent(FirebaseEvents.SCREEN_VIEW, { screen_name: title })
  }, [setAppBar])

  useEffect(() => {
    helpscout.hideBeacon()
  }, [])

  const handleAlertClose = () => {
    setOpenAlert(false)
  }

  const handleDialogClose = () => {
    setOpenDialog(false)
  }

  const handleOnExited = () => {
    setSelectedSupplier(null)
  }

  const handleCreateSupplier = () => {
    setOpenDialog(true)
  }

  const handleAction = (action, supplier) => () => {
    setSelectedSupplier(supplier)

    switch (action) {
      case 'edit':
        setOpenDialog(true)
        break
      case 'delete':
        setOpenAlert(true)
        break
      default:
        break
    }
  }

  const handleAlertConfirm = async () => {
    try {
      await deleteSupplier({ variables: { id: selectedSupplier._id } })
      setOpenAlert(false)
      openNotification({
        variables: { input: { variant: 'success', message: 'Fornecedor removido' } }
      })
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const handleSubmit = async ({ displayName, nationalId, name, url, phone, description }) => {
    const input = {
      displayName,
      name,
      phone,
      url,
      description
    }

    try {
      if (selectedSupplier) {
        await updateSupplier({ variables: { id: selectedSupplier._id, input } })
        setOpenDialog(false)
        openNotification({
          variables: { input: { variant: 'success', message: 'Fornecedor atualizado' } }
        })
      } else {
        await createSupplier({ variables: { input: { nationalId, ...input } } })
        analytics.logEvent({ nationalId, ...input })
        analytics.logEvent(FirebaseEvents.CREATE_SUPPLIER, { nationalId, ...input })
        setOpenDialog(false)
        openNotification({
          variables: { input: { variant: 'success', message: 'Fornecedor adicionado' } }
        })
      }
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const handlePageChange = (currentPage) => {
    setPagination({ page: currentPage })
  }

  const handleRowsPerPageChange = (rows) => {
    setPagination({ offset: rows })
  }

  const hasSuppliers = data?.suppliers?.pagination?.totalItems !== 0
  const actions = [
    {
      startIcon: <Add />,
      label: 'Adicionar fornecedor',
      variant: 'outlined',
      color: 'primary',
      onClick: handleCreateSupplier
    }
  ]
  const fab = { actions: { onClick: handleCreateSupplier } }
  const placeholder = !hasSuppliers && (
    <Placeholder
      icon={<LocalShipping />}
      message={'Ainda não há fornecedores'}
      symbol={'👋'}
      actions={actions}
    />
  )

  return (
    <Page className={classes.root}>
      <Main fab={fab} placeholder={placeholder}>
        <List
          loading={loading}
          avatar
          labels={labels}
          items={data?.suppliers.suppliers}
          pagination={data?.suppliers.pagination}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          getItemTitle={(item) => `${item.displayName} | ${item.name}`}
          getItemAdornmentTitle={(item) => item.mobile}
          getItemSubtitle={(item) => item.nationalId}
          getItemDescription={(item) => item.email}
          getItemDisabled={(item) => !!item.deletedAt}
          renderActions={(item, index, disabled) => (
            <>
              <ListItemAction title='Editar' onClick={handleAction('edit', item, index)}>
                <Edit />
              </ListItemAction>
              <ListItemAction
                title='Remover'
                disabled={disabled}
                onClick={handleAction('delete', item, index)}
              >
                <Remove />
              </ListItemAction>
            </>
          )}
        />
        <Dialog open={openDialog} onClose={handleDialogClose} onExited={handleOnExited}>
          <NewSupplierForm
            supplier={selectedSupplier}
            onSubmit={handleSubmit}
            onClose={handleDialogClose}
          />
        </Dialog>
        <Alert
          open={openAlert}
          title='Tem certeza que deseja excluir este fornecedor?'
          onPrimary={handleAlertConfirm}
          primaryLabel='Excluir'
          onSecondary={handleAlertClose}
          secondaryLabel='Voltar'
        >
          Este fornecedor será apagado permanentemente.
        </Alert>
      </Main>
    </Page>
  )
}

export default SuppliersView
