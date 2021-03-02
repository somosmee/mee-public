import app from 'src/graphql/app/defaults'
import cart from 'src/graphql/cart/defaults'
import notification from 'src/graphql/notification/defaults'
import search from 'src/graphql/search/defaults'
import settings from 'src/graphql/settings/defaults'
import shopfrontCart from 'src/graphql/shopfrontCart/defaults'

const defaults = {
  search,
  app,
  settings,
  notification,
  cart,
  shopfrontCart
}

export { defaults as default }
