import { updateApp } from 'src/graphql/app/resolvers'
import {
  initCart,
  resetCart,
  addItemToCart,
  removeItemFromCart,
  addNoteItem,
  increaseQuantity,
  decreaseQuantity,
  addCustomerToCart,
  setQuantity
} from 'src/graphql/cart/resolvers'
import {
  openNotification,
  closeNotification,
  clearNotification
} from 'src/graphql/notification/resolvers'
import { updateSearch } from 'src/graphql/search/resolvers'
import { setSettings } from 'src/graphql/settings/resolvers'
import {
  resetSFCart,
  addItemCart,
  removeItemCart,
  increaseItemCart,
  decreaseItemCart,
  addPaymentCart,
  addFederalTaxNumberCart,
  deleteFederalTaxNumberCart,
  updateQuantityItemCart,
  updateDeliveryCart
} from 'src/graphql/shopfrontCart/resolvers'

const Mutation = {
  updateApp,
  updateSearch,
  setSettings,
  openNotification,
  closeNotification,
  clearNotification,
  initCart,
  resetCart,
  addItemToCart,
  removeItemFromCart,
  addNoteItem,
  increaseQuantity,
  setQuantity,
  decreaseQuantity,
  addCustomerToCart,
  // Shopfront Cart
  resetSFCart,
  addItemCart,
  removeItemCart,
  increaseItemCart,
  decreaseItemCart,
  addPaymentCart,
  addFederalTaxNumberCart,
  deleteFederalTaxNumberCart,
  updateQuantityItemCart,
  updateDeliveryCart
}

export { Mutation as default }
