import React, { useEffect } from 'react'
import { GoogleLogin } from 'react-google-login'
import { useLocation } from 'react-router-dom'

import { useMutation } from '@apollo/react-hooks'
import PropTypes from 'prop-types'

import Typography from '@material-ui/core/Typography'
import { isWidthUp } from '@material-ui/core/withWidth'

import Google from 'src/icons/google-icon'

import Button from 'src/components/Button'

import { SIGN_IN_GOOGLE_EMPLOYER } from 'src/graphql/user/queries'

import { FirebaseEvents } from 'src/utils/enums'
import { getSearch } from 'src/utils/url'
import useWidth from 'src/utils/useWidth'

import { analytics } from 'src/firebase'

import useStyles from './styles'

const ExternalSigninView = () => {
  const classes = useStyles()
  const width = useWidth()

  const location = useLocation()
  const [signinGoogleEmployer, { loading }] = useMutation(SIGN_IN_GOOGLE_EMPLOYER)

  useEffect(() => {
    const title = 'Login Externo'
    document.title = `${title} | Mee`
    analytics.logEvent(FirebaseEvents.SCREEN_VIEW, { screen_name: title })
  }, [])

  const handleSuccessEmployer = async ({ tokenId }) => {
    const { loginUUID } = getSearch(location)

    try {
      await signinGoogleEmployer({ variables: { googleIdToken: tokenId, loginUUID } })
    } catch (error) {
      console.log('[handleSuccessEmployer] ERROR:', error)
    }
  }

  const handleFailure = (response) => {}

  return (
    <main className={classes.root}>
      {isWidthUp('sm', width) && <div className={classes.overlay} />}
      <div className={classes.box}>
        <Typography variant='h4'>Bem-vindo(a) ao Mee</Typography>
        <Typography variant='h6' color='textSecondary' paragraph>
          A solução mais simples para o seu ponto de venda.
        </Typography>
        <Typography variant='h6' color='textPrimary' paragraph>
          Entrar como dono de um estabelecimento
        </Typography>
        <GoogleLogin
          className={classes.button}
          scope={'profile email'}
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          onSuccess={handleSuccessEmployer}
          onFailure={handleFailure}
          render={(renderProps) => (
            <Button
              className={classes.button}
              variant='contained'
              color='primary'
              onClick={renderProps.onClick}
              loading={loading}
              fullWidth
            >
              <Google className={classes.icon} />
              Entrar com Google
            </Button>
          )}
        />
        <div />
        <div />
        <div />
        <Typography variant='caption'>
          Ao continuar, você concorda com os Termos de Serviço e com a Política de Privacidade do
          Mee
        </Typography>
      </div>
    </main>
  )
}

ExternalSigninView.propTypes = {
  location: PropTypes.object
}

export default ExternalSigninView
