import React, { useContext, useEffect, useState } from 'react'

import { useMutation } from '@apollo/react-hooks'

import CardActions from '@material-ui/core/CardActions'
import Container from '@material-ui/core/Container'
import Step from '@material-ui/core/Step'
import StepContent from '@material-ui/core/StepContent'
import StepLabel from '@material-ui/core/StepLabel'
import Stepper from '@material-ui/core/Stepper'
import Typography from '@material-ui/core/Typography'

import Button from 'src/components/Button'
import Main from 'src/components/Main'
import Page from 'src/components/Page'
import Upload from 'src/components/Upload'

import { OPEN_NOTIFICATION } from 'src/graphql/notification/queries'

import AppBarContext from 'src/contexts/AppBarContext'

import CertificateForm from 'src/forms/CertificateForm'
import UpsertCompanyInfoForm from 'src/forms/UpsertCompanyInfoForm'
import UpsertCompanyTaxesForm from 'src/forms/UpsertCompanyTaxesForm'

import useCompany from 'src/hooks/useCompany'
import useUserAddress from 'src/hooks/useUserAddress'

import addressUtils from 'src/utils/address'
import { FirebaseEvents } from 'src/utils/enums'

import helpscout from 'src/services/helpscout'

import { analytics } from 'src/firebase'

import useStyles from './styles'

const NfeView = () => {
  const classes = useStyles()

  const [, setAppBar] = useContext(AppBarContext)

  /**
   * REACT STATE
   */
  const {
    getMyCompany: [getMyCompany, { data }],
    updateMyCompany: [updateMyCompany, { loading }]
  } = useCompany()
  const company = data?.myCompany

  const [activeConfigStep, setActiveConfigStep] = useState(0)
  const { UpsertAddressForm, addressProps } = useUserAddress(company?.address)
  const [certificate, setCertificate] = useState(null)

  /**
   * GRAPHQL
   */

  const [openNotification] = useMutation(OPEN_NOTIFICATION)

  useEffect(() => {
    const title = 'Nota Fiscal'
    setAppBar({ prominent: false, overhead: false, color: 'white', title: title.toLowerCase() })
    document.title = `${title} | Mee`
    analytics.logEvent(FirebaseEvents.SCREEN_VIEW, { screen_name: title })
  }, [setAppBar])

  useEffect(() => {
    helpscout.showBeacon()
  }, [])

  useEffect(() => {
    getMyCompany()
  }, [])

  /**
   * CONTROLLERS
   */

  const handleBack = () => {
    setActiveConfigStep((prevActiveConfigStep) => prevActiveConfigStep - 1)
  }

  const handleUpdateAddress = async ({ noNumber, ...input }) => {
    if (noNumber) input.number = 'S/N'

    const geoData = await addressUtils.geocodeAddress(input)
    await updateMyCompany({ address: { ...input, ...geoData } })

    setActiveConfigStep((prevActiveConfigStep) => prevActiveConfigStep + 1)
  }

  const handleCertificateChange = (certificate) => {
    setCertificate(certificate)
  }

  const handleUpdateCompanyInfo = async (data) => {
    try {
      await updateMyCompany({
        nationalId: data.nationalId,
        stateId: data.stateId,
        name: data.name,
        tax: {
          regime: data.regime
        }
      })
      setActiveConfigStep((prevActiveConfigStep) => prevActiveConfigStep + 1)
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const handleUpdateCompanyTaxes = async (data) => {
    try {
      await updateMyCompany({
        tax: {
          icmsOrigin: data.icmsOrigin,
          icmsTaxGroup: data.icmsTaxGroup,
          icmsCSOSN: data.icmsCSOSN,
          incidenceRegime: data.incidenceRegime,
          pisCofinsTaxGroup: data.pisCofinsTaxGroup
        }
      })
      setActiveConfigStep((prevActiveConfigStep) => prevActiveConfigStep + 1)
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const handleUploadCertificate = async ({ password }) => {
    try {
      await updateMyCompany({ certificate: { file: certificate, password } })
      openNotification({ variables: { input: { variant: 'success', message: 'Dados salvos' } } })
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const tax = company?.tax

  return (
    <Page className={classes.root}>
      <Main>
        <Container maxWidth='sm'>
          <Typography variant='h5' paragraph>
            Configurar emissão NFC-e
          </Typography>
          <Typography variant='subtitle1' color='textSecondary' paragraph>
            Recomendamos que você revise as informações salvas abaixo com seu contador
          </Typography>
          <Stepper activeStep={activeConfigStep} orientation='vertical'>
            <Step>
              <StepLabel>Informe o endereço do seu estabelecimento</StepLabel>
              <StepContent>
                <UpsertAddressForm
                  {...addressProps}
                  onSubmit={handleUpdateAddress}
                  actions={(submitting, pristine, invalid) => (
                    <CardActions>
                      <Button
                        type='submit'
                        variant='contained'
                        color='primary'
                        loading={submitting}
                      >
                        Salvar endereço
                      </Button>
                    </CardActions>
                  )}
                />
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Informe os dados da sua empresa</StepLabel>
              <StepContent>
                <UpsertCompanyInfoForm
                  initialValues={{
                    nationalId: company?.nationalId,
                    stateId: company?.stateId,
                    name: company?.name,
                    regime: company?.tax?.regime
                  }}
                  onSubmit={handleUpdateCompanyInfo}
                  actions={(submitting, pristine, invalid) => (
                    <CardActions>
                      <Button variant='outlined' color='primary' onClick={handleBack}>
                        Voltar
                      </Button>
                      <Button
                        type='submit'
                        variant='contained'
                        color='primary'
                        disabled={submitting || invalid}
                        loading={loading}
                      >
                        Salvar
                      </Button>
                    </CardActions>
                  )}
                />
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Informe seus registros tributários</StepLabel>
              <StepContent>
                <UpsertCompanyTaxesForm
                  initialValues={{
                    icmsOrigin: tax?.icmsOrigin,
                    icmsTaxGroup: tax?.icmsTaxGroup,
                    icmsCSOSN: tax?.icmsCSOSN,
                    incidenceRegime: tax?.incidenceRegime,
                    pisCofinsTaxGroup: tax?.pisCofinsTaxGroup
                  }}
                  state={company?.address?.state}
                  regime={company?.tax?.regime}
                  onSubmit={handleUpdateCompanyTaxes}
                  actions={(submitting, pristine, invalid) => (
                    <CardActions>
                      <Button variant='outlined' color='primary' onClick={handleBack}>
                        Voltar
                      </Button>
                      <Button
                        type='submit'
                        variant='contained'
                        color='primary'
                        disabled={submitting || invalid}
                        loading={loading}
                      >
                        Salvar
                      </Button>
                    </CardActions>
                  )}
                />
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Faça upload do seu certificado digital</StepLabel>
              <StepContent>
                <Upload
                  className={classes.file}
                  variant='square'
                  avatar={false}
                  accept='application/x-pkcs12'
                  onChange={handleCertificateChange}
                />
                <CertificateForm
                  onSubmit={handleUploadCertificate}
                  actions={(submitting, pristine, invalid) => (
                    <CardActions>
                      <Button variant='outlined' color='primary' onClick={handleBack}>
                        Voltar
                      </Button>
                      <Button
                        type='submit'
                        variant='contained'
                        color='primary'
                        loading={loading}
                        disabled={!certificate || submitting || pristine || invalid}
                      >
                        Finalizar
                      </Button>
                    </CardActions>
                  )}
                />
              </StepContent>
            </Step>
          </Stepper>
        </Container>
      </Main>
    </Page>
  )
}

NfeView.propTypes = {}

NfeView.defaultProps = {}

export default NfeView
