import React, { useState } from 'react'

import PropTypes from 'prop-types'

import DialogContent from '@material-ui/core/DialogContent'
import Step from '@material-ui/core/Step'
import StepContent from '@material-ui/core/StepContent'
import StepLabel from '@material-ui/core/StepLabel'
import Stepper from '@material-ui/core/Stepper'

import Button from 'src/components/Button'

import SetupContactForm from 'src/forms/SetupContactForm'
import SetupInfoForm from 'src/forms/SetupInfoForm'

import useStyles from './styles'

const AddCompanyContent = ({ onSubmit }) => {
  const classes = useStyles()

  const [firstStepData, setFirstStepData] = useState(null)
  const [activeStep, setActiveStep] = useState(0)

  const handleBack = () => {
    setActiveStep(activeStep - 1)
  }

  const handleFirstStepSubmit = (data) => {
    setFirstStepData(data)
    setActiveStep(activeStep + 1)
  }

  const handleSecondStepSubmit = (data) => {
    setActiveStep(activeStep + 1)
    onSubmit({ ...firstStepData, ...data })
  }

  return (
    <DialogContent className={classes.root}>
      <Stepper activeStep={activeStep} orientation='vertical'>
        <Step>
          <StepLabel>Informações básicas</StepLabel>
          <StepContent>
            <SetupInfoForm
              initialValues={firstStepData}
              onSubmit={handleFirstStepSubmit}
              actions={(submitting) => (
                <>
                  <Button disabled={activeStep === 0} onClick={handleBack}>
                    Voltar
                  </Button>
                  <Button type='submit' variant='contained' color='primary' disabled={submitting}>
                    Continuar
                  </Button>
                </>
              )}
            />
          </StepContent>
        </Step>
        <Step>
          <StepLabel>Contato</StepLabel>
          <StepContent>
            <SetupContactForm
              onSubmit={handleSecondStepSubmit}
              actions={(submitting) => (
                <>
                  <Button disabled={activeStep === 0} onClick={handleBack}>
                    Voltar
                  </Button>
                  <Button type='submit' variant='contained' color='primary' disabled={submitting}>
                    Criar empresa
                  </Button>
                </>
              )}
            />
          </StepContent>
        </Step>
      </Stepper>
    </DialogContent>
  )
}

AddCompanyContent.propTypes = {
  onSubmit: PropTypes.func
}

AddCompanyContent.defaultProps = {
  onSubmit: () => {}
}

export default AddCompanyContent
