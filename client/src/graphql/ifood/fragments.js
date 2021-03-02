import gql from 'graphql-tag'

export const IFOOD_ITEM_ATTRIBUTES = gql`
  fragment ifoodItemAttributes on IfoodItem {
    id
    externalCode
    name
    description
    price
    available
    position
    modifiers {
      id
      externalCode
      name
      minimum
      maximum
      available
      position
      options {
        id
        externalCode
        name
        description
        price
        available
        position
      }
    }
  }
`

export const IFOOD_CATEGORY_ATTRIBUTES = gql`
  fragment ifoodCategoryAttributes on IfoodCategory {
    id
    externalCode
    name
    description
    available
    position
    items {
      ...ifoodItemAttributes
    }
  }
  ${IFOOD_ITEM_ATTRIBUTES}
`
