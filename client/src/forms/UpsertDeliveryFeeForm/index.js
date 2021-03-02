import React, { useRef, useEffect } from 'react'
import { useForm, useField } from 'react-final-form-hooks'
import { useHistory } from 'react-router-dom'

import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import ReportProblemIcon from '@material-ui/icons/ReportProblemOutlined'

import Button from 'src/components/Button'
import PriceFormat from 'src/components/PriceFormat'
import TextField from 'src/components/TextField'

import { Paths } from 'src/utils/enums'
import numeral from 'src/utils/numeral'

import useStyles from './styles'

const validate = (values) => {
  const errors = {}

  if (!values.deliveryFee) {
    errors.deliveryFee = 'Valor é obrigatório'
  }

  return errors
}

const UpsertDeliveryFeeForm = ({
  initialValues,
  deliveryData,
  hasAddress,
  hasDeliveryFeeRules,
  actions,
  onClose,
  onSubmit
}) => {
  const classes = useStyles()
  const history = useHistory()

  const inputValue = useRef()

  useEffect(() => {
    inputValue.current.focus()
  }, [])

  /* FORM */
  const { form, handleSubmit, invalid, pristine, submitting } = useForm({
    initialValues: { deliveryFee: deliveryData.fee || initialValues.deliveryFee },
    onSubmit,
    validate
  })

  /* FORM FIELDS */
  const value = useField('deliveryFee', form)

  const handleRedirectProfile = () => {
    history.push(Paths.profile.path + '#address')
  }

  const handleRedirectSettings = () => {
    history.push(Paths.settings.path + '#price')
  }

  return (
    <Grid
      className={classes.root}
      container
      component='form'
      autoComplete='off'
      onSubmit={handleSubmit}
      spacing={1}
    >
      <Grid item xs={12}>
        <Typography variant='body2' align='center' component='p'>
          Distância: {numeral(deliveryData?.distance).format('0.00')} KM
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          {...value}
          className={classes.value}
          required
          variant='outlined'
          inputRef={inputValue}
          label='Taxa de entrega'
          placeholder='0,00'
          fullWidth
          InputProps={{
            classes: {
              input: classes.valueInput
            },
            inputComponent: PriceFormat
          }}
        />
      </Grid>
      {(!hasAddress || !hasDeliveryFeeRules) && (
        <Grid container item direction='row' justify='center' alignItems='center'>
          <Typography variant='h6' align='center' component='p'>
            Não foi possível calcular taxa de delivery
          </Typography>
          <ReportProblemIcon />
        </Grid>
      )}
      {!hasAddress && (
        <Grid container item justify='center'>
          <Typography variant='body2' align='center' component='p'>
            Você ainda não adicionou o endereço do seu estabelecimento.
          </Typography>
          <Button onClick={handleRedirectProfile} color='primary'>
            Clique aqui para adicionar endereço
          </Button>
        </Grid>
      )}
      {!hasDeliveryFeeRules && (
        <Grid container item justify='center'>
          <Typography variant='body2' align='center' component='p'>
            Você ainda não adicionou as regras para taxa de delivery.
          </Typography>
          <Button onClick={handleRedirectSettings} color='primary'>
            Clique aqui para adicionar regras de taxa de delivery
          </Button>
        </Grid>
      )}
      {actions && actions(submitting, pristine, invalid)}
    </Grid>
  )
}

UpsertDeliveryFeeForm.propTypes = {
  hasAddress: PropTypes.bool,
  deliveryData: PropTypes.object,
  hasDeliveryFeeRules: PropTypes.bool,
  initialValues: PropTypes.object,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  actions: PropTypes.func
}

UpsertDeliveryFeeForm.defaultProps = {
  initialValues: {},
  deliveryData: {},
  onSubmit: () => {}
}

export default UpsertDeliveryFeeForm
