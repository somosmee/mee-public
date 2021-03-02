import { TOKEN_KEY, NEW_UPDATES_KEY } from 'src/utils/constants'
import { load } from 'src/utils/localStorage'

const defaults = {
  logged: !!load(TOKEN_KEY),
  signup: false,
  openDrawer: true,
  openDrawerMobile: false,
  drawer: {
    accountant: true,
    billing: true,
    sales: true,
    customers: true,
    integrations: true,
    myStore: true,
    orders: true,
    finance: true,
    inventory: true,
    products: true,
    purchases: true,
    reports: true,
    suppliers: true,
    tags: true,
    __typename: 'Drawer'
  },
  openProductDialog: false,
  openNewUpdates: !!load(NEW_UPDATES_KEY),
  openSignout: false,
  notification: {
    newOrder: false,
    __typename: 'Notification'
  },
  __typename: 'App'
}

export { defaults as default }
