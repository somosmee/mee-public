import React from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'

import Alert from '@material-ui/lab/Alert'

import TextField from 'src/components/TextField'

import {
  TaxRegimes,
  ICMSCsosn,
  PisCofinsTaxTypes,
  IncidenceRegimes,
  ICMSOrigin,
  ICMSNormalTaxType,
  ICMSSimplesNacionalTaxType
} from 'src/utils/enums'
import numeral from 'src/utils/numeral'
import taxes from 'src/utils/taxes'

import useStyles from './styles'

const validate = (values) => {
  const errors = {}

  if (!values.icmsOrigin) {
    errors.icmsOrigin = 'Origem da mercadoria em branco'
  }

  if (!values.icmsTaxGroup) {
    errors.icmsTaxGroup = 'Grupo tributação ICMS em branco'
  }

  if (!values.icmsCSOSN) {
    errors.icmsCSOSN = 'CSOSN em branco'
  }

  if (!values.incidenceRegime) {
    errors.incidenceRegime = 'Regime de incidência em branco'
  }

  if (!values.pisCofinsTaxGroup) {
    errors.pisCofinsTaxGroup = 'Tipo de tributação PIS/COFINS em branco'
  }

  return errors
}

const UpsertCompanyTaxesForm = ({ initialValues, state, regime, actions, onSubmit }) => {
  const classes = useStyles()

  const { form, handleSubmit, values, invalid, pristine, submitting } = useForm({
    initialValues: { ...initialValues, pisCofinsTaxGroup: '01', icmsOrigin: '0' },
    onSubmit,
    validate
  })

  const icmsOrigin = useField('icmsOrigin', form)
  const icmsTaxGroup = useField('icmsTaxGroup', form)
  const icmsCSOSN = useField('icmsCSOSN', form)
  const incidenceRegime = useField('incidenceRegime', form)
  const pisCofinsTaxGroup = useField('pisCofinsTaxGroup', form)

  let icmsTaxGroupOptions = TaxRegimes.simplesNacional.value

  const isSimplesNacional =
    regime === TaxRegimes.simplesNacional.value ||
    regime === TaxRegimes.simplesNacionalRevenue.value

  if (isSimplesNacional) {
    icmsTaxGroupOptions = ICMSSimplesNacionalTaxType
  } else {
    icmsTaxGroupOptions = ICMSNormalTaxType
  }

  const renderSelect = (item, index) => {
    return (
      <MenuItem key={index} value={item.value}>
        {item.name}
      </MenuItem>
    )
  }

  const total = 100.0
  const canCalculateICMS = state && values.icmsTaxGroup && values.icmsCSOSN
  const canCalculatePISCOFINS = values.incidenceRegime && values.pisCofinsTaxGroup

  return (
    <Grid
      className={classes.root}
      container
      spacing={3}
      component='form'
      autoComplete='off'
      onSubmit={handleSubmit}
    >
      <Grid item xs={12}>
        <Alert severity='warning'>
          No momento só trabalhamos com mercadorias nacionais e vendas interestaduais!
        </Alert>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='overline' display='block' gutterBottom>
          ICMS
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          select
          required
          {...icmsTaxGroup}
          label='Grupo de Tributação'
          fullWidth
          helperText='Selecione o grupo de tributação do ICMS'
        >
          <MenuItem value={null}>Nenhum</MenuItem>
          {Object.values(icmsTaxGroupOptions).map(renderSelect)}
        </TextField>
      </Grid>
      {values.icmsTaxGroup && isSimplesNacional && (
        <Grid item xs={12}>
          <TextField
            select
            required
            {...icmsCSOSN}
            label='CSOSN'
            fullWidth
            helperText='Código de Situação da Operação do Simples Nacional'
          >
            <MenuItem value={null}>Nenhum</MenuItem>
            {Object.values(ICMSCsosn[parseInt(values.icmsTaxGroup)]).map(renderSelect)}
          </TextField>
        </Grid>
      )}
      <Grid item xs={12}>
        <TextField
          select
          required
          disabled
          {...icmsOrigin}
          label='Origem da mercadoria'
          fullWidth
          helperText='Selecione a origem da mercadoria'
        >
          <MenuItem value={''}>Nenhum</MenuItem>
          {Object.values(ICMSOrigin).map(renderSelect)}
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='overline' display='block' gutterBottom>
          PIS/COFINS
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          select
          required
          {...incidenceRegime}
          label='Regime de Incidência'
          fullWidth
          helperText='Selecione o regime de Incidência'
        >
          <MenuItem value={null}>Nenhum</MenuItem>
          {Object.values(IncidenceRegimes).map(renderSelect)}
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <TextField select required {...pisCofinsTaxGroup} label='Tipo de tributação' fullWidth>
          <MenuItem value={null}>Nenhum</MenuItem>
          {Object.values(PisCofinsTaxTypes).map(renderSelect)}
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='overline' display='block' gutterBottom>
          Exemplo
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='subtitle1' display='block' gutterBottom>
          Em uma venda de <b>{numeral(total).format()}</b> você pagará:
        </Typography>
        <Typography variant='subtitle1' display='block' gutterBottom>
          <b>
            {canCalculateICMS
              ? numeral(
                taxes.calculateICMS(state, values.icmsTaxGroup, values.icmsCSOSN, 100.0)
              ).format()
              : numeral(0.0).format()}
          </b>{' '}
          de ICMS
        </Typography>
        <Typography variant='subtitle1' display='block' gutterBottom>
          <b>
            {' '}
            {canCalculatePISCOFINS
              ? numeral(
                taxes.calculatePISCOFINS(values.incidenceRegime, values.pisCofinsTaxGroup, 100.0)
              ).format()
              : numeral(0.0).format()}
          </b>{' '}
          de PIS/COFINS
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {actions && actions(submitting, pristine, invalid)}
      </Grid>
    </Grid>
  )
}

/*

<Grid item xs={6}>
  <TextField
    select
    {...icmsOrigin}
    label='Origem da mercadoria'
    fullWidth
    helperText='Selecione a origem da mercadoria'
  >
    <MenuItem value={''}>Nenhum</MenuItem>
    {Object.values(ICMSOrigin).map(renderSelect)}
  </TextField>
</Grid>
<Grid item xs={6}>
  <TextField
    select
    {...incidenceRegime}
    label='Regime de Incidência'
    fullWidth
    helperText='Selecione o regime de Incidência'
  >
    <MenuItem value={null}>Nenhum</MenuItem>
    {Object.values(IncidenceRegimes).map(renderSelect)}
  </TextField>
</Grid>
 */

UpsertCompanyTaxesForm.propTypes = {
  initialValues: PropTypes.object,
  state: PropTypes.string,
  regime: PropTypes.string,
  actions: PropTypes.func,
  onSubmit: PropTypes.func
}

UpsertCompanyTaxesForm.defaultProps = {
  onSubmit: () => {}
}

export default UpsertCompanyTaxesForm
