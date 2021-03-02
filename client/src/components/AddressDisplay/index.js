import React from 'react'

import PropTypes from 'prop-types'

import Typography from '@material-ui/core/Typography'

const AddressDisplay = ({ address, align, dense, primaryVariant }) => {
  return (
    <>
      <Typography variant={primaryVariant} align={align || 'left'}>
        {`${address?.street}` + `${address?.number ? `, ${address?.number}` : ''}`}
      </Typography>
      {!dense && (
        <Typography viariant='body2' color='textSecondary' align={align || 'left'}>
          {`${address?.complement ? `${address?.complement}, ` : ''}` +
            `${address?.district}` +
            ` - ${address?.city}, ${address?.state} - CEP ${address?.postalCode}`}
        </Typography>
      )}
    </>
  )
}

AddressDisplay.propTypes = {
  address: PropTypes.object,
  align: PropTypes.string,
  dense: PropTypes.bool,
  primaryVariant: PropTypes.string
}

AddressDisplay.defaultProps = {
  address: {},
  align: 'left',
  dense: false,
  primaryVariant: null
}

export default AddressDisplay
