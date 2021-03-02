import React, { useContext, useState, useEffect } from 'react'

import cep from 'cep-promise'

import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'

import AccountCircle from '@material-ui/icons/AccountCircle'
import Add from '@material-ui/icons/Add'
import Remove from '@material-ui/icons/DeleteOutlined'
import Edit from '@material-ui/icons/EditOutlined'

import Alert from 'src/components/Alert'
import ShippingSelectionStep from 'src/components/DeliverySteps/ShippingSelectionStep'
import UpsertAddressStep from 'src/components/DeliverySteps/UpsertAddressStep'
import UpsertCustomerStep from 'src/components/DeliverySteps/UpsertCustomerStep'
import Dialog from 'src/components/Dialog'
import List from 'src/components/List'
import Main from 'src/components/Main'
import Page from 'src/components/Page'
import Placeholder from 'src/components/Placeholder'

import AppBarContext from 'src/contexts/AppBarContext'

import useCustomer from 'src/hooks/useCustomer'
import usePagination from 'src/hooks/usePagination'
import useSearch from 'src/hooks/useSearch'

import { CreateCustomerContents, FirebaseEvents } from 'src/utils/enums'

import helpscout from 'src/services/helpscout'

import { analytics } from 'src/firebase'

import useStyles from './styles'

const labels = [
  [
    {
      key: ['nationalId'],
      name: 'CPF'
    },
    {
      key: ['firstName'],
      name: 'Nome'
    }
  ],
  {
    key: ['mobile'],
    name: 'Celular'
  },
  {
    key: ['email'],
    name: 'E-mail'
  }
]

const CustomersView = () => {
  const classes = useStyles()

  const [pagination, setPagination] = usePagination()
  const [, setAppBar] = useContext(AppBarContext)
  const [search, results] = useSearch({ entity: 'customer' })
  const {
    getCustomers: [getCustomers, getCustomerstResult],
    createCustomer: [createCustomer],
    updateCustomer: [updateCustomer],
    deleteCustomer: [deleteCustomer, deleteCustomerResult],
    createCustomerAddress: [createCustomerAddress],
    updateCustomerAddress: [updateCustomerAddress],
    deleteCustomerAddress: [deleteCustomerAddress, deleteCustomerAddressResult]
  } = useCustomer()

  const [address, setAddress] = useState(null)
  const [activeContent, setActiveContent] = useState(CreateCustomerContents.newCustomer)
  const [term, setTerm] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const [openDeleteCustomerAddressAlert, setOpenDeleteCustomerAddressAlert] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [selectedCustomerAddressId, setSelectedCustomerAddressId] = useState(null)

  useEffect(() => {
    const title = 'Clientes'
    setAppBar({ prominent: false, overhead: false, color: 'white', title: title.toLowerCase() })
    document.title = `${title} | Mee`
    analytics.logEvent(FirebaseEvents.SCREEN_VIEW, { screen_name: title })
  }, [setAppBar])

  useEffect(() => {
    getCustomers({ pagination })
  }, [pagination.page, pagination.offset])

  useEffect(() => {
    search(term)
  }, [term, search])

  useEffect(() => {
    helpscout.hideBeacon()
  }, [])

  const resetState = () => {
    setAddress(null)
    setSelectedCustomer(null)
  }

  const resetAddressState = () => {
    setAddress(null)
  }

  const handleAlertClose = () => {
    setOpenAlert(false)
  }

  const handleDeleteCustomerAlertClose = () => {
    setOpenDeleteCustomerAddressAlert(false)
  }

  const handleDialogClose = () => {
    setOpenDialog(false)
  }

  const handleCreateCustomer = () => {
    setActiveContent(CreateCustomerContents.newCustomer)
    setOpenDialog(true)
  }

  const handleClick = (customer) => {}

  const handleAction = (action, customer) => () => {
    setSelectedCustomer(customer)

    switch (action) {
      case 'edit':
        setActiveContent(CreateCustomerContents.newCustomer)
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
      await deleteCustomer({ customer: selectedCustomer._id })
      setOpenAlert(false)
    } catch (error) {}
  }

  const handleUpsertCustomerSubmit = async (customer) => {
    const { _id, addresses, deletedAt, ...input } = customer

    try {
      if (selectedCustomer) {
        await updateCustomer({ customer: selectedCustomer._id, ...input })
      } else {
        await createCustomer(input)
      }
      setOpenDialog(false)
    } catch (error) {}
  }

  const handlePageChange = (currentPage) => {
    setPagination({ page: currentPage })
  }

  const handleRowsPerPageChange = (rows) => {
    setPagination({ offset: rows })
  }

  const handleSearchChange = (term) => {
    setTerm(term)
  }

  const handleBack = () => {
    switch (activeContent) {
      case CreateCustomerContents.newCustomer:
        setOpenDialog(false)
        break
      case CreateCustomerContents.manageAddress:
        setActiveContent(CreateCustomerContents.newCustomer)
        break
      case CreateCustomerContents.newAddress:
        setActiveContent(CreateCustomerContents.manageAddress)
        setAddress(null)
        break
      default:
        break
    }
  }

  const handlePostalCode = async (value) => {
    try {
      const { state, city, street, neighborhood } = await cep(value)
      setAddress({ postalCode: value, state, city, street, district: neighborhood })
    } catch (error) {
      setAddress({ postalCode: value })
    }
  }

  const handleCustomerAddressSubmit = async ({ _id, ...address }) => {
    try {
      let customer

      if (_id) {
        customer = await updateCustomerAddress({
          customer: selectedCustomer._id,
          address: _id,
          ...address
        })
      } else {
        customer = await createCustomerAddress({ customer: selectedCustomer._id, ...address })
      }
      setAddress(null)
      setSelectedCustomer(customer)
      setActiveContent(CreateCustomerContents.manageAddress)
    } catch (error) {}
  }

  const handleDeleteCustomerAddressSubmit = async () => {
    try {
      const customer = await deleteCustomerAddress({
        customer: selectedCustomer._id,
        address: selectedCustomerAddressId
      })
      setOpenDeleteCustomerAddressAlert(false)
      setSelectedCustomer(customer)
    } catch (error) {}
  }

  const handleCustomerAddressAdd = () => {
    setActiveContent(CreateCustomerContents.newAddress)
  }

  const handleCustomerAddressEdit = (address) => {
    setAddress(address)
    setActiveContent(CreateCustomerContents.newAddress)
  }

  const handleCustomerAddressDelete = async (id) => {
    await setSelectedCustomerAddressId(id)
    setOpenDeleteCustomerAddressAlert(true)
  }

  const handleManageAddress = () => {
    setActiveContent(CreateCustomerContents.manageAddress)
  }

  const hasCustomers = getCustomerstResult?.data?.customers?.pagination?.totalItems !== 0
  const actions = [
    {
      startIcon: <Add />,
      label: 'Adicionar Cliente',
      variant: 'outlined',
      color: 'primary',
      onClick: handleCreateCustomer
    }
  ]
  const fab = { id: 'create-customer', actions: { onClick: handleCreateCustomer } }
  const placeholder = !hasCustomers && (
    <Placeholder
      icon={<AccountCircle />}
      message={'Ainda não há clientes'}
      symbol={'👋'}
      actions={actions}
    />
  )

  return (
    <Page className={classes.root}>
      <Main fab={fab} placeholder={placeholder}>
        <List
          id='customers'
          loading={getCustomerstResult.loading}
          avatar
          labels={labels}
          items={getCustomerstResult?.data?.customers.customers}
          pagination={getCustomerstResult?.data?.customers.pagination}
          search={{
            loading: results.loading,
            placeholder: 'Pesquisar cliente',
            items: results.data,
            value: term,
            onChange: handleSearchChange
          }}
          getItemTitle={(item) => item.firstName}
          getItemAdornmentTitle={(item) => item.mobile}
          getItemSubtitle={(item) => item.nationalId}
          getItemDescription={(item) => item.email}
          getItemDisabled={(item) => !!item.deletedAt}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onClick={handleClick}
          renderActions={(item, index, disabled) => (
            <>
              <Tooltip title='Editar'>
                <IconButton
                  id='edit'
                  aria-label='Editar'
                  onClick={handleAction('edit', item, index)}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title='Excluir'>
                <IconButton
                  id='delete'
                  aria-label='Excluir'
                  disabled={disabled}
                  onClick={handleAction('delete', item, index)}
                >
                  <Remove />
                </IconButton>
              </Tooltip>
            </>
          )}
        />
        <Alert
          open={openAlert}
          title='Excluir cliente?'
          onPrimary={handleAlertConfirm}
          primaryLabel='Excluir'
          onSecondary={handleAlertClose}
          secondaryLabel='Voltar'
          loading={deleteCustomerResult.loading}
          onClose={handleAlertClose}
          onExited={resetState}
        >
          Este cliente será apagado permanentemente.
        </Alert>
        <Alert
          open={openDeleteCustomerAddressAlert}
          title='Excluir endereço?'
          onPrimary={handleDeleteCustomerAddressSubmit}
          primaryLabel='Excluir'
          onSecondary={handleDeleteCustomerAlertClose}
          secondaryLabel='Voltar'
          loading={deleteCustomerAddressResult.loading}
          onClose={handleDeleteCustomerAlertClose}
          onExited={resetAddressState}
        >
          Este endereço será apagado permanentemente.
        </Alert>
        <Dialog
          open={openDialog}
          activeContent={activeContent}
          onBack={handleBack}
          onClose={handleDialogClose}
          onExited={resetState}
        >
          <UpsertCustomerStep
            id={CreateCustomerContents.newCustomer}
            title={selectedCustomer ? 'Edite um cliente' : 'Adicione um cliente'}
            initialValues={selectedCustomer}
            onManageAddress={handleManageAddress}
            onSubmit={handleUpsertCustomerSubmit}
          />
          <ShippingSelectionStep
            id={CreateCustomerContents.manageAddress}
            byPassAddress
            title='Gerencie os endereços'
            addresses={selectedCustomer?.addresses}
            onAddNew={handleCustomerAddressAdd}
            onEdit={handleCustomerAddressEdit}
            onDelete={handleCustomerAddressDelete}
          />
          <UpsertAddressStep
            id={CreateCustomerContents.newAddress}
            title={address?._id ? 'Edite um endereço' : 'Adicione um endereço'}
            initialValues={address}
            onPostalCode={handlePostalCode}
            onSubmit={handleCustomerAddressSubmit}
          />
        </Dialog>
      </Main>
    </Page>
  )
}

CustomersView.propTypes = {}

CustomersView.defaultProps = {}

export default CustomersView
