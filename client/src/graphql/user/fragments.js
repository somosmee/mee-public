import gql from 'graphql-tag'

export const TAX_ATTRIBUTES = gql`
  fragment taxAttributes on UserTax {
    regime
    icmsRegime
    icmsTaxGroup
    incidenceRegime
  }
`
