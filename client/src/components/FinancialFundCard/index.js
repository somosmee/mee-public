import React, { useState } from 'react'

import PropTypes from 'prop-types'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'

import AccountBalance from '@material-ui/icons/AccountBalance'
import AccountBalanceWallet from '@material-ui/icons/AccountBalanceWallet'
import Delete from '@material-ui/icons/DeleteOutlined'
import Edit from '@material-ui/icons/EditOutlined'
import ImportExport from '@material-ui/icons/ImportExportOutlined'
import MoreVertIcon from '@material-ui/icons/MoreVert'

import Dialog from 'src/components/Dialog'

import useFinancialFund from 'src/hooks/useFinancialFund'

import UpsertFinancialFundContent from 'src/dialogs/UpsertFinancialFundContent'

import { FinancialFundCategories } from 'src/utils/enums'

import useStyles from './styles'

const FinancialFundCard = ({ fund, onEdit }) => {
  const classes = useStyles()

  const {
    createFinancialFund: [createFinancialFund],
    updateFinancialFund: [updateFinancialFund],
    deleteFinancialFund: [deleteFinancialFund],
    adjustFinancialFund: [adjustFinancialFund]
  } = useFinancialFund()

  const [anchorEl, setAnchorEl] = useState(null)
  const [openFundDialog, setOpenFundDialog] = useState(false)
  const [isAdjust, setIsAdjust] = useState(false)

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleOpenEdit = (event) => {
    setAnchorEl(null)
    setOpenFundDialog(true)
  }

  const handleDelete = async (event) => {
    setAnchorEl(null)
    await deleteFinancialFund({ id: fund.id })
  }

  const handleAdjust = (event) => {
    setAnchorEl(null)
    setIsAdjust(true)
    setOpenFundDialog(true)
  }

  const handleClose = () => {
    setOpenFundDialog(false)
    setIsAdjust(false)
  }

  const handleSubmit = async (input) => {
    if (isAdjust) {
      await adjustFinancialFund({
        id: input.id,
        balance: input.balance,
        shouldCreateFinancialStatement: input.shouldCreateFinancialStatement
      })
    } else if (input.id) {
      await updateFinancialFund({ id: input.id, name: input.name })
    } else {
      await createFinancialFund(input)
    }

    handleClose()
  }

  const renderAdjustMessage = () => {
    const shouldCloseRegister =
      fund.category === FinancialFundCategories.REGISTER && fund.hasOpenedRegister

    if (fund.category !== FinancialFundCategories.REGISTER) {
      return 'Ajustar saldo'
    } else {
      if (shouldCloseRegister) {
        return 'Fechar caixa'
      } else {
        return 'Abrir caixa'
      }
    }
  }

  return (
    <>
      <Card className={classes.card}>
        <CardContent>
          <Grid container>
            <Grid item container xs={3} justify='center' direction='column' alignItems='left'>
              {fund.category === FinancialFundCategories.REGISTER ? (
                <AccountBalanceWallet />
              ) : (
                <AccountBalance />
              )}
            </Grid>
            <Grid item xs={8}>
              <Typography variant='h6' component='h2'>
                {fund.name}
              </Typography>
              <Typography color='textSecondary' variant='subtitle' gutterBottom>
                {`R$ ${fund.balance.toFixed(2)}`}
              </Typography>
            </Grid>
            <Grid item xs={1} direction='row' justify='flex-start' alignItems='flex-start'>
              <IconButton
                onClick={handleMenuClick}
                className={classes.moreButton}
                aria-label='settings'
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id='menu'
                anchorEl={anchorEl}
                keepMounted
                open={!!anchorEl}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleOpenEdit}>
                  <Edit className={classes.icon} />
                  Editar
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                  <Delete className={classes.icon} />
                  Deletar
                </MenuItem>
                <MenuItem onClick={handleAdjust}>
                  <ImportExport className={classes.icon} />
                  {renderAdjustMessage()}
                </MenuItem>
              </Menu>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Dialog
        open={openFundDialog}
        activeContent={'financialFund'}
        onClose={handleClose}
        onExited={() => {}}
      >
        <UpsertFinancialFundContent
          id={'financialFund'}
          title={
            fund.category === 'register'
              ? `${fund ? 'Atualizar' : 'Adicionar'} caixa`
              : `${fund ? 'Atualizar' : 'Adicionar'} conta bancária`
          }
          isAdjust={isAdjust}
          initialValues={fund}
          operation={fund.category}
          onSubmit={handleSubmit}
        />
      </Dialog>
    </>
  )
}

FinancialFundCard.propTypes = {
  fund: PropTypes.object,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onAdjust: PropTypes.func
}

FinancialFundCard.defaultProps = {
  onEdit: () => {},
  onDelete: () => {},
  onAdjust: () => {}
}

export default FinancialFundCard
