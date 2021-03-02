import React from 'react'
import { useForm } from 'react-final-form-hooks'

import PropTypes from 'prop-types'

/* MATERIAL */
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import SendIcon from '@material-ui/icons/Send'

/* STYLING */

/* FORMS */
import ICMSRegimeForm from './ICMSRegimeForm'
import IncidenceRegimeForm from './IncidenceRegimeForm'
import useStyles from './styles'

const validate = (values) => {
  const errors = {}

  if (!values.incidenceRegime) {
    errors.incidenceRegime = 'Campo obrigatório'
  }

  if (!values.icmsRegime) {
    errors.icmsRegime = 'Campo obrigatório'
  }

  if (values.icmsRegime && !values.icmsTaxGroup) {
    errors.icmsTaxGroup = 'Campo obrigatório'
  }

  return errors
}

const CompanyTaxesForm = ({ initialValues, onSubmit, loading }) => {
  const classes = useStyles()

  /* FORM */
  const { form, values, invalid, pristine, submitting } = useForm({
    initialValues,
    onSubmit,
    validate
  })

  /**
   * Handle functions
   */

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(values)
  }

  return (
    <form autoComplete='off' onSubmit={handleSubmit}>
      <Card className={classes.root}>
        <CardHeader
          title='Impostos'
          subheader='Adicione as informações fiscais para geração da CF-e'
        />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant='overline' display='block' gutterBottom>
                ICMS
              </Typography>
              <ICMSRegimeForm form={form} values={values} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant='overline' display='block' gutterBottom>
                PIS e COFINS
              </Typography>
              <IncidenceRegimeForm form={form} values={values} />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button
            type='submit'
            color='primary'
            loading={loading}
            variant='contained'
            endIcon={<SendIcon />}
            disabled={submitting || pristine || invalid}
          >
            Enviar
          </Button>
        </CardActions>
      </Card>
    </form>
  )
}

CompanyTaxesForm.propTypes = {
  loading: PropTypes.bool,
  onSubmit: PropTypes.func,
  initialValues: PropTypes.any
}

CompanyTaxesForm.defaultProps = {
  onSubmit: () => {},
  initialValues: {}
}

export default CompanyTaxesForm
