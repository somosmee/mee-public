import {
  createSetupSession,
  createSupportCheckoutSession,
  retryBillPayment
} from 'src/graphql/billing/resolvers'
import {
  updateMyCompany,
  createMember,
  deleteMember,
  acceptInvite,
  signinCompany,
  createCompany
} from 'src/graphql/company/resolvers'
import {
  createCustomer,
  updateCustomer,
  deleteCustomer,
  createCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress
} from 'src/graphql/customer/resolvers'
import {
  createFinancialFund,
  deleteFinancialFund,
  updateFinancialFund,
  adjustFinancialFund
} from 'src/graphql/financialFund/resolvers'
import { deleteFinancialStatementCategory } from 'src/graphql/financialStatement/category.resolvers'
import {
  createFinancialStatement,
  deleteFinancialStatement
} from 'src/graphql/financialStatement/resolvers'
import {
  toggleOpenStatus,
  updateIfoodCredentials,
  confirmIfoodOrder,
  dispatchIfoodOrder,
  cancellationIfoodOrder,
  createIfoodCategory,
  updateIfoodCategory,
  deleteIfoodCategory,
  addIfoodItem,
  unlinkIfoodItem,
  updateIfoodItemAvailability,
  createIfoodModifier,
  updateIfoodModifier,
  deleteIfoodModifier
} from 'src/graphql/ifood/resolvers'
import {
  increaseInventory,
  decreaseInventory,
  inventoryAdjustment
} from 'src/graphql/inventory/resolvers'
import { createOrderLoggi, updateCredentialsLoggi } from 'src/graphql/loggi/resolvers'
import { simulateConcludeIfoodOrders } from 'src/graphql/order/admin.resolvers'
import {
  addItems,
  addPayment,
  createOrder,
  createOrderShopfront,
  addItemOrder,
  deleteItemOrder,
  cancelOrder,
  confirmOrder,
  closeOrder,
  updateOrder,
  generateInvoice,
  sendInvoiceEmail,
  updateOrderInvoice,
  downloadInvoices
} from 'src/graphql/order/mutations'
import {
  createProduct,
  updateProduct,
  importProducts,
  deleteProduct,
  updateAllCompletionIndexes
} from 'src/graphql/product/mutations'
import {
  addPurchase,
  createPurchaseItem,
  updatePurchaseItem,
  importPurchaseItems,
  addManualPurchase
} from 'src/graphql/purchase/resolvers'
import {
  createRegisterOperation,
  deleteRegisterOperation
} from 'src/graphql/registerOperation/resolvers'
import { addProductShopfront, deleteProductShopfront } from 'src/graphql/shopfront/mutations'
import { sendReports, reclassifyUsers } from 'src/graphql/statistics/admin.resolvers'
import { createSupplier, updateSupplier, deleteSupplier } from 'src/graphql/supplier/resolvers'
import {
  generateToken,
  resyncStripeData,
  syncronyzeIndexes,
  reprocessIfoodMarketAnalysis
} from 'src/graphql/user/admin.resolvers'
import {
  signin,
  sendPin,
  updateMe,
  signinGoogleEmployer,
  signinGoogleEmployee,
  createPriceRule,
  updatePriceRule,
  deletePriceRule
} from 'src/graphql/user/resolvers'

const Mutation = {
  sendPin,
  signin,
  updateMe,
  signinGoogleEmployer,
  signinGoogleEmployee,
  createPriceRule,
  updatePriceRule,
  deletePriceRule,

  generateToken,
  resyncStripeData,
  reprocessIfoodMarketAnalysis,

  createProduct,
  updateProduct,
  importProducts,
  deleteProduct,
  sendInvoiceEmail,
  generateInvoice,
  updateAllCompletionIndexes,

  addItems,
  addPayment,
  createOrder,
  confirmOrder,
  createOrderShopfront,
  addItemOrder,
  deleteItemOrder,
  cancelOrder,
  closeOrder,
  updateOrder,
  updateOrderInvoice,
  downloadInvoices,

  createCustomer,
  updateCustomer,
  deleteCustomer,
  createCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress,

  increaseInventory,
  decreaseInventory,
  inventoryAdjustment,

  createSupplier,
  updateSupplier,
  deleteSupplier,

  addPurchase,
  createPurchaseItem,
  updatePurchaseItem,
  importPurchaseItems,
  addManualPurchase,

  createSetupSession,
  retryBillPayment,
  createSupportCheckoutSession,

  toggleOpenStatus,
  updateIfoodCredentials,
  confirmIfoodOrder,
  dispatchIfoodOrder,
  cancellationIfoodOrder,
  createIfoodCategory,
  updateIfoodCategory,
  deleteIfoodCategory,
  addIfoodItem,
  unlinkIfoodItem,
  updateIfoodItemAvailability,
  createIfoodModifier,
  updateIfoodModifier,
  deleteIfoodModifier,

  createOrderLoggi,
  updateCredentialsLoggi,

  addProductShopfront,
  deleteProductShopfront,

  createFinancialStatement,
  deleteFinancialStatement,

  deleteFinancialStatementCategory,

  createFinancialFund,
  updateFinancialFund,
  deleteFinancialFund,
  adjustFinancialFund,

  // Company
  updateMyCompany,
  createMember,
  deleteMember,
  acceptInvite,
  signinCompany,
  createCompany,

  createRegisterOperation,
  deleteRegisterOperation,

  /* ADMIN */
  simulateConcludeIfoodOrders,
  sendReports,
  reclassifyUsers,
  syncronyzeIndexes
}

export { Mutation as default }
