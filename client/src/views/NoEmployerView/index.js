import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import { FirebaseEvents, Paths } from 'src/utils/enums'

import { analytics } from 'src/firebase'

import useStyles from './styles'

const NoEmployerView = () => {
  const classes = useStyles()

  const history = useHistory()

  useEffect(() => {
    const title = 'Convite - Funcionário'
    document.title = `${title} | Mee`
    analytics.logEvent(FirebaseEvents.SCREEN_VIEW, { screen_name: title })
  }, [])

  const handleBack = () => {
    history.push(Paths.home.path)
  }

  return (
    <main className={classes.root}>
      <div className={classes.center}>
        <div className={classes.message}>
          <Typography variant='h4' paragraph>
            Aguarde até o estabelecimento te adicionar como funcionário!
          </Typography>
        </div>
        <Button className={classes.button} onClick={handleBack}>
          Voltar
        </Button>
      </div>
    </main>
  )
}

export default NoEmployerView
