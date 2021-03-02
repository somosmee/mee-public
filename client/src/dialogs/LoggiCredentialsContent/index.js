import React from 'react'

import PropTypes from 'prop-types'

import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import Link from '@material-ui/core/Link'
import Paper from '@material-ui/core/Paper'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Button from 'src/components/Button'

import LoggiCredentialsForm from 'src/forms/LoggiCredentialsForm'

import useStyles from './styles'

const UpsertLoggiCategoryContent = ({
  loggi,
  loading,
  disabled,
  onClose,
  onOpenToggle,
  onSubmit
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const upSmall = useMediaQuery(theme.breakpoints.up('sm'))

  return (
    <DialogContent className={classes.root}>
      <DialogContentText>
        Adicione o login e senha da sua conta empresarial Loggi.{' '}
        <Link
          href='https://medium.com/@somosmee/plano-de-indica%C3%A7%C3%A3o-como-ganhar-dinheiro-sem-sair-de-casa-8286c6ee795c'
          target='_blank'
          rel='noreferrer'
        >
          Saiba mais aqui!
        </Link>
      </DialogContentText>
      <LoggiCredentialsForm
        loggi={loggi}
        onOpenToggle={onOpenToggle}
        disabled={disabled}
        actions={(submitting, pristine, invalid) => (
          <Paper className={classes.paper}>
            <DialogActions>
              <Button
                type='submit'
                variant='contained'
                color='primary'
                loading={loading}
                fullWidth={!upSmall}
                disabled={disabled || submitting || pristine || invalid}
              >
                Salvar
              </Button>
            </DialogActions>
          </Paper>
        )}
        onSubmit={onSubmit}
      />
    </DialogContent>
  )
}

UpsertLoggiCategoryContent.propTypes = {
  loggi: PropTypes.shape({
    open: PropTypes.bool.isRequired,
    merchant: PropTypes.string,
    username: PropTypes.string,
    password: PropTypes.string
  }),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  onClose: PropTypes.func,
  onOpenToggle: PropTypes.func,
  onSubmit: PropTypes.func
}

UpsertLoggiCategoryContent.defaultProps = {
  loading: false,
  disabled: false,
  onClose: () => {},
  onOpenToggle: () => {},
  onSubmit: () => {}
}

export default UpsertLoggiCategoryContent
