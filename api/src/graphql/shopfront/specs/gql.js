export const GET_SHOPPFRONTS = `
  query($id: ID!){
    shopfronts(id: $id){
      _id
      name
      banner
      merchant
      picture
      products {
        _id
        name
        image
        price
      }
    }
  }
`
export const GET_SHOPPFRONT = `
  query{
    shopfront{
      _id
      name
      banner
      merchant
      picture
      products {
        _id
        name
        image
        price
      }
    }
  }
`
