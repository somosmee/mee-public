import React from 'react'

import PropTypes from 'prop-types'

import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import Paper from '@material-ui/core/Paper'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Button from 'src/components/Button'

import IfoodCredentialsForm from 'src/forms/IfoodCredentialsForm'

import useStyles from './styles'

const UpsertIfoodCategoryContent = ({
  ifood,
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
        Adicione o login e senha do Gestor de Pedidos do ifood para sincronizarmos seus pedidos.
      </DialogContentText>
      <IfoodCredentialsForm
        ifood={ifood}
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

UpsertIfoodCategoryContent.propTypes = {
  ifood: PropTypes.shape({
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

UpsertIfoodCategoryContent.defaultProps = {
  loading: false,
  disabled: false,
  onClose: () => {},
  onOpenToggle: () => {},
  onSubmit: () => {}
}

export default UpsertIfoodCategoryContent
