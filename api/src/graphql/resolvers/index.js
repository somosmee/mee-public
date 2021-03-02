import Company from 'src/graphql/resolvers/Company'
import FinancialFund from 'src/graphql/resolvers/FinancialFund'
import Inventory from 'src/graphql/resolvers/Inventory'
import Mutation from 'src/graphql/resolvers/Mutation'
import Node from 'src/graphql/resolvers/Node'
import Order from 'src/graphql/resolvers/Order'
import PaymentMethodType from 'src/graphql/resolvers/PaymentMethodType'
import Product from 'src/graphql/resolvers/Product'
import ProductionRequest from 'src/graphql/resolvers/ProductionRequest'
import Purchase from 'src/graphql/resolvers/Purchase'
import PurchasePaymentMethod from 'src/graphql/resolvers/PurchasePaymentMethod'
import Query from 'src/graphql/resolvers/Query'
import RegisterOperation from 'src/graphql/resolvers/RegisterOperation'
import Reports from 'src/graphql/resolvers/Reports'
import Subscription from 'src/graphql/resolvers/Subscription'
import Supplier from 'src/graphql/resolvers/Supplier'
import TeamMember from 'src/graphql/resolvers/TeamMember'
import User from 'src/graphql/resolvers/User'
import UserBill from 'src/graphql/resolvers/UserBill'

const resolvers = {
  Query,
  Mutation,
  Subscription,
  Node,
  FinancialFund,
  Product,
  Reports,
  Order,
  Supplier,
  Inventory,
  Purchase,
  UserBill,
  TeamMember,
  Company,
  User,
  RegisterOperation,
  ProductionRequest,
  PaymentMethodType,
  PurchasePaymentMethod
}

export { resolvers as default }
