import React, { useEffect } from 'react'

import { useMutation } from '@apollo/react-hooks'
import client from 'src/apollo'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import { UPDATE_APP } from 'src/graphql/app/queries'

import useApp from 'src/hooks/useApp'

import { FirebaseEvents } from 'src/utils/enums'

import { analytics } from 'src/firebase'

import useStyles from './styles'

const SignoutDialog = () => {
  const classes = useStyles()

  const { app } = useApp()
  const [updateApp] = useMutation(UPDATE_APP)

  useEffect(() => {
    const unsubscribe = client.onResetStore(() => localStorage.clear())
    return () => unsubscribe()
  }, [])

  const handleClick = () => {
    client.resetStore()
    analytics.logEvent(FirebaseEvents.LOGOUT)
  }

  const handleClose = async () => {
    await updateApp({ variables: { input: { openSignout: false } } })
  }

  return (
    <Dialog
      className={classes.root}
      open={app.openSignout}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>Sair do Mee</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          Você está prestes a sair. Tem certeza?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color='secondary' onClick={handleClose}>
          Voltar
        </Button>
        <Button color='primary' onClick={handleClick}>
          Sair
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SignoutDialog
