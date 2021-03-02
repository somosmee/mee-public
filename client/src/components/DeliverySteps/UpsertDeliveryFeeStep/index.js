import React, { useEffect } from 'react'

import PropTypes from 'prop-types'

import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Paper from '@material-ui/core/Paper'

import Button from 'src/components/Button'
import Loading from 'src/components/Loading'

import UpsertDeliveryFeeForm from 'src/forms/UpsertDeliveryFeeForm'

import useCompany from 'src/hooks/useCompany'
import useOrder from 'src/hooks/useOrder'

import useStyles from './styles'

const UpsertDeliveryFeeStep = ({ address, initialValues, onClose, onSubmit }) => {
  const classes = useStyles()

  const {
    getMyCompany: [getMyCompany, { loading, data }]
  } = useCompany()
  const company = data?.myCompany

  useEffect(() => {
    getMyCompany()
  }, [])

  const {
    getDeliveryDetails: [getDeliveryDetails, getDeliveryDetailResult]
  } = useOrder()

  const hasAddress = !!company?.address
  const hasDeliveryFeeRules = !!company?.settings?.delivery?.length

  useEffect(() => {
    if (hasDeliveryFeeRules && hasAddress) {
      const { _id, ...input } = address
      getDeliveryDetails({ address: input })
    }
  }, [hasDeliveryFeeRules, hasAddress, getDeliveryDetails, address])

  return (
    <DialogContent className={classes.root}>
      {getDeliveryDetailResult.loading || loading ? (
        <Loading drawer={false} message='Calculando taxa de delivery' />
      ) : (
        <UpsertDeliveryFeeForm
          initialValues={initialValues}
          deliveryData={getDeliveryDetailResult?.data?.getDeliveryDetails}
          hasAddress={hasAddress}
          hasDeliveryFeeRules={hasDeliveryFeeRules}
          onClose={onClose}
          onSubmit={onSubmit}
          actions={(submitting, pristine, invalid) => (
            <Paper className={classes.paper} elevation={10}>
              <DialogActions>
                <Button
                  type='submit'
                  variant='contained'
                  color='primary'
                  loading={submitting}
                  disabled={pristine || invalid}
                >
                  Continuar
                </Button>
              </DialogActions>
            </Paper>
          )}
        />
      )}
    </DialogContent>
  )
}

UpsertDeliveryFeeStep.propTypes = {
  address: PropTypes.object,
  initialValues: PropTypes.object,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func
}

UpsertDeliveryFeeStep.defaultProps = {
  onClose: () => {},
  onSubmit: () => {}
}

export default UpsertDeliveryFeeStep
