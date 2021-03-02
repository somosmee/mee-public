import { myCompany, myCompanies } from 'src/graphql/company/resolvers'
import { customer, customers, searchCustomers } from 'src/graphql/customer/resolvers'
import { financialFunds } from 'src/graphql/financialFund/resolvers'
import { financialStatements } from 'src/graphql/financialStatement/resolvers'
import { ifoodPriceAnalysis, getIfoodCategories } from 'src/graphql/ifood/queries'
import { inventoryMovements } from 'src/graphql/inventory/resolvers'
import { allShopsLoggi, allPackagesLoggi } from 'src/graphql/loggi/resolvers'
import {
  order,
  orderPreview,
  orders,
  getSuggestions,
  searchOrders,
  getDeliveryDetails
} from 'src/graphql/order/queries'
import { product, productGTIN, products, searchProducts } from 'src/graphql/product/queries'
import { purchase, purchases } from 'src/graphql/purchase/resolvers'
import { registerOperations } from 'src/graphql/registerOperation/resolvers'
import { shopfront, shopfronts } from 'src/graphql/shopfront/queries'
import { kpi } from 'src/graphql/statistics/admin.resolvers'
import { reports } from 'src/graphql/statistics/resolvers'
import { supplier, suppliers, searchSuppliers } from 'src/graphql/supplier/resolvers'
import { me } from 'src/graphql/user/resolvers'

const Query = {
  me,

  myCompany,
  myCompanies,

  financialStatements,

  product,
  productGTIN,
  products,
  searchProducts,

  order,
  orders,
  orderPreview,
  searchOrders,
  getSuggestions,
  getDeliveryDetails,

  customer,
  customers,
  searchCustomers,

  supplier,
  suppliers,
  searchSuppliers,

  purchase,
  purchases,

  inventoryMovements,

  getIfoodCategories,
  ifoodPriceAnalysis,

  kpi,

  reports,

  allShopsLoggi,
  allPackagesLoggi,

  shopfront,
  shopfronts,

  financialFunds,

  registerOperations
}

export { Query as default }
