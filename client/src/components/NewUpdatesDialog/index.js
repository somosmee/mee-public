import React, { useState, useEffect } from 'react'

import { useMutation } from '@apollo/react-hooks'
import * as serviceWorker from 'src/serviceWorker'

import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import Dialog from 'src/components/Dialog'
import Emoji from 'src/components/Emoji'

import { UPDATE_APP } from 'src/graphql/app/queries'

import useApp from 'src/hooks/useApp'

import { NEW_UPDATES_KEY } from 'src/utils/constants'
import { save } from 'src/utils/localStorage'

import useStyles from './styles'
const NewUpdatesDialog = () => {
  const classes = useStyles()

  const { app } = useApp()
  const [waitingWorker, setWaitingWorker] = useState(null)

  const [updateApp] = useMutation(UPDATE_APP)

  const onUpdate = async (registration) => {
    if (registration.waiting) {
      setWaitingWorker(registration.waiting)
      save(NEW_UPDATES_KEY, true)
      await updateApp({ variables: { input: { openNewUpdates: true } } })
    }
  }

  useEffect(() => {
    serviceWorker.register({ onUpdate })
  }, [])

  const handleClick = async (event) => {
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' }) // eslint-disable-line
    save(NEW_UPDATES_KEY, false)
    await updateApp({ variables: { input: { openNewUpdates: false } } })
    window.location.reload(true)
  }

  return (
    <Dialog className={classes.root} open={app.openNewUpdates} maxWidth='xs'>
      <DialogTitle>
        Uma nova versão está disponível&nbsp;
        <Emoji symbol='🎉' label='lança confetes' />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Nossos engenheiros trabalham constantemente para entregar a melhor experiência para você.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color='primary' onClick={handleClick}>
          Atualizar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default NewUpdatesDialog
