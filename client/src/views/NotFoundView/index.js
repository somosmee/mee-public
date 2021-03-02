import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import Button from '@material-ui/core/Button'

import NotFound from 'src/components/NotFound'

import { FirebaseEvents } from 'src/utils/enums'

import { analytics } from 'src/firebase'

import useStyles from './styles'

const NotFoundView = () => {
  const classes = useStyles()
  const history = useHistory()

  useEffect(() => {
    const title = 'Not Found'
    document.title = `${title} | Mee`
    analytics.logEvent(FirebaseEvents.SCREEN_VIEW, { screen_name: title })
  }, [])

  const handleBack = () => {
    history.goBack()
  }

  return (
    <main className={classes.root}>
      <div className={classes.center}>
        <NotFound />
        <Button className={classes.button} onClick={handleBack}>
          Voltar
        </Button>
      </div>
    </main>
  )
}

export default NotFoundView
