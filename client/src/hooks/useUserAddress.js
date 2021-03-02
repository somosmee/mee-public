import React, { useState } from 'react'

import cep from 'cep-promise'

import CardActions from '@material-ui/core/CardActions'

import Button from 'src/components/Button'
import Spacer from 'src/components/Spacer'

import UpsertAddressForm from 'src/forms/UpsertAddressForm'

import useCompany from 'src/hooks/useCompany'

import addressUtils from 'src/utils/address'

const useUserAddress = (initialValues) => {
  const [address, setAddress] = useState(initialValues)

  const {
    updateMyCompany: [updateMyCompany]
  } = useCompany()

  const handlePostalCode = async (value) => {
    try {
      const { state, city, street, neighborhood } = await cep(value)
      setAddress({ postalCode: value, state, city, street, district: neighborhood })
    } catch (error) {
      setAddress({ postalCode: value })
    }
  }

  const handleSubmit = async ({ noNumber, ...input }) => {
    if (noNumber) input.number = 'S/N'

    const geoData = await addressUtils.geocodeAddress(input)
    await updateMyCompany({ address: { ...input, ...geoData } })
    setAddress(null)
  }

  const addressProps = {
    initialValues: address ?? initialValues,
    onPostalCode: handlePostalCode,
    onSubmit: handleSubmit,
    // eslint-disable-next-line
    actions: (submitting, pristine, invalid) => (
      <CardActions>
        <Spacer />
        <Button
          type='submit'
          variant='contained'
          color='primary'
          loading={submitting}
          disabled={pristine || invalid}
        >
          {initialValues ? 'Atualizar' : 'Salvar'}
        </Button>
      </CardActions>
    )
  }

  return {
    addressProps,
    UpsertAddressForm
  }
}

export default useUserAddress
