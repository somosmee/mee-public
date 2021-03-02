import mongoose from 'src/mongoose'

const { ObjectId } = mongoose.Types

/**
 * Formas de pagamento - https://developer.ifood.com.br/reference#formas-de-pagamento
 */

export const VOUCHERS = [
  'VOUCHER',
  'VR_SMA',
  'TRE',
  'VVREST',
  'GRNCAR',
  'RSODEX',
  'VALECA',
  'TVER',
  'RSELE',
  'CPRCAR',
  'GRNCPL',
  'VRO',
  'TRO',
  'SRP',
  'ALR',
  'ALA',
  'BENVVR',
  'CPRCAR',
  'NUTCRD',
  'SAP',
  'TAO',
  'VA_OFF',
  'VA_ON',
  'VALECA',
  'VISAVR'
]
export const CREDIT_CARDS = [
  'DNREST',
  'RAM',
  'VSREST',
  'RDREST',
  'RHIP',
  'REC',
  'BANRC',
  'GOODC',
  'DNR',
  'VIS',
  'AM',
  'MC',
  'ELO',
  'VISE',
  'HIPER',
  'IFE',
  'PAY',
  'GER_CT',
  'IFOOD_ONLINE',
  'APL_MC',
  'APL_VIS',
  'CARNET',
  'CHF',
  'CRE',
  'GER_CC',
  'GPY_ELO',
  'GPY_MC',
  'GPY_MXMC',
  'GPY_MXVIS',
  'GPY_VIS',
  'LPCLUB',
  'MOVPAY_AM',
  'MOVPAY_DNR',
  'MOVPAY_ELO',
  'MOVPAY_HIPER',
  'MOVPAY_MC',
  'MOVPAY_VIS',
  'MPAY',
  'MXAM',
  'MXMC',
  'NUGO',
  'PAY',
  'PSE',
  'TOD',
  'VERDEC'
]
export const DEBT_CARDS = [
  'MEREST',
  'VIREST',
  'RED',
  'BANRD',
  'ELOD',
  'GER_CT',
  'GER_DC',
  'MCMA',
  'MXVIS',
  'QRC'
]
export const CASH = ['DIN', 'CHE', 'BON']

export const Payments = Object.freeze({
  CASH: 'cash',
  CREDIT: 'credit',
  DEBT: 'debt',
  VOUCHER: 'voucher',
  PIX: 'pix'
})

export const IfoodOrderStatus = Object.freeze({
  PLACED: 'PLACED',
  INTEGRATED: 'INTEGRATED',
  CONFIRMED: 'CONFIRMED',
  DISPATCHED: 'DISPATCHED',
  DELIVERED: 'DELIVERED',
  REJECTION: 'REJECTION',
  CANCELLATION_REQUESTED: 'CANCELLATION_REQUESTED',
  CANCELLED: 'CANCELLED',
  CANCELLATION_REQUEST_FAILED: 'CANCELLATION_REQUEST_FAILED',
  CONCLUDED: 'CONCLUDED'
})

export const IfoodCancellationReasons = Object.freeze({
  501: {
    code: '501',
    description: 'problemas de sistema'
  },
  502: {
    code: '502',
    description: 'pedido em duplicidade'
  },
  503: {
    code: '503',
    description: 'item indisponível'
  },
  504: {
    code: '504',
    description: 'restaurante sem motoboy'
  },
  505: {
    code: '505',
    description: 'cardápio desatualizado'
  },
  506: {
    code: '506',
    description: 'pedido fora da área de entrega'
  },
  507: {
    code: '507',
    description: 'cliente golpista / trote'
  },
  508: {
    code: '508',
    description: 'fora do horário do delivery'
  },
  509: {
    code: '509',
    description: 'dificuldades internas do restaurante'
  },
  511: {
    code: '511',
    description: 'área de risco'
  },
  512: {
    code: '512',
    description: 'restaurante abrirá mais tarde'
  },
  513: {
    code: '513',
    description: 'restaurante fechou mais cedo'
  },
  803: {
    code: '803',
    description: 'item indisponível'
  },
  805: {
    code: '805',
    description: 'restaurante sem motoboy'
  },
  801: {
    code: '801',
    description: 'outros (obrigatörio informar descrição)'
  },
  804: {
    code: '804',
    description: 'cadastro do cliente incompleto - cliente não atende'
  },
  807: {
    code: '807',
    description: 'pedido fora da área de entrega'
  },
  808: {
    code: '808',
    description: 'cliente golpista / trote'
  },
  809: {
    code: '809',
    description: 'fora do horário do delivery'
  },
  815: {
    code: '815',
    description: 'dificuldades internas do restaurante'
  },
  818: {
    code: '818',
    description: 'taxa de entrega inconsistente'
  },
  820: {
    code: '820',
    description: 'área de risco'
  }
})

export const IfoodDeliveryMode = Object.freeze({
  DELIVERY: 'DELIVERY',
  TAKEOUT: 'TAKEOUT',
  INDOOR: 'INDOOR'
})

export const OrderStatus = Object.freeze({
  OPEN: 'open',
  CONFIRMED: 'confirmed',
  PARTIALLY_PAID: 'partially_paid',
  CLOSED: 'closed',
  CANCELED: 'canceled'
})

export const UserBillStatus = Object.freeze({
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed'
})

export const Measurements = Object.freeze({
  UNIT: 'unit',
  KILOGRAM: 'kilogram'
})

export const Origins = Object.freeze({
  MEE: 'mee',
  SHOPFRONT: 'shopfront',
  IFOOD: 'ifood'
})

export const Reasons = Object.freeze({
  ACQUISITION: 'acquisition',
  SALE: 'sale',
  WITHDRAWAL: 'withdrawal',
  RETURN: 'return',
  EXPIRED: 'expired',
  DAMAGED: 'damaged',
  MANUAL_ADJUSTMENT: 'manual_adjustment'
})

export const PurchaseInvoiceStatus = Object.freeze({
  FETCHING: 'fetching',
  SUCCESS: 'success',
  ERROR: 'error'
})

export const SalesInvoiceStatus = Object.freeze({
  PENDING: 'pending',
  SUCCESS: 'success',
  ERROR: 'error'
})

export const PurchaseStatus = Object.freeze({
  FETCHING: 'fetching',
  SUCCESS: 'success',
  ERROR: 'error'
})

export const PurchaseItemStatus = Object.freeze({
  NEW: 'new',
  DRAFT: 'draft',
  ADDED_TO_INVENTORY: 'added_to_inventory'
})

export const Roles = Object.freeze({
  ADMIN: 'admin', // can use admin mutation tools and basically anything to any user
  BUSINESS_ADMIN: 'businessAdmin', // can do anything to a company
  MANAGER: 'manager', // cant change company info like CNPJ or digital certificate but can see reports etc
  ATTENDANT: 'attendant', // can do everything related with orders, products etc but not see reports
  ACCOUNTANT: 'accountant' // can setup NFe only and company gov registration
})

/* TAX */
export const ICMSTaxRegimes = Object.freeze({
  NORMAL: 'normal',
  SIMPLES_NACIONAL: 'simplesNacional'
})

export const ICMSTaxGroup = Object.freeze({
  // ICMS= 00, 20, 90
  INTEGRAL: '00',
  REDUCTIONS: '20',
  OTHERS: '90',
  // ICMS = 40, 41, 60
  INSENTS: '40',
  NO_TAXES: '41',
  CHARGED: '60',
  // CSOSN=102, 300, 400, 500
  SN_TRIB: '101',
  NO_CREDIT: '102',
  SB_201: '201',
  SB_202: '202',
  CHARGED_SN: '500',
  // CSOSN=900
  OTHERS_SN: '900'
})

export const IncidenceRegimes = Object.freeze({
  CUMULATIVE: 'cumulative',
  NON_CUMULATIVE: 'nonCumulative'
})

export const ICMSOrigins = Object.freeze({
  NATIONAL0: '0',
  FOREIGN1: '1',
  FOREIGN2: '2',
  NATIONAL3: '3',
  NATIONAL4: '4',
  NATIONAL5: '5',
  FOREIGN6: '6',
  FOREIGN7: '7',
  NATIONAL8: '8'
})

export const PISPercentageFees = Object.freeze({
  cumulative: 0.0065,
  nonCumulative: 0.0165
})

export const COFINSPercentageFees = Object.freeze({
  cumulative: 0.03,
  nonCumulative: 0.076
})

export const Operations = Object.freeze({
  INCREASE: 'increase',
  DECREASE: 'decrease'
})

export const Integrations = Object.freeze({
  IFOOD: 'ifood'
})

export const Conditions = Object.freeze({
  LESS_THAN: 'less_than',
  GREATER_THAN: 'greater_than'
})

export const OperationTypes = Object.freeze({
  PERCENTAGE: 'percentage',
  ABSOLUTE: 'absolute'
})

export const IfoodAvailability = Object.freeze({
  AVAILABLE: 'AVAILABLE',
  UNAVAILABLE: 'UNAVAILABLE',
  DELETED: 'DELETED'
})

export const IfoodAnalysisStatus = Object.freeze({
  UNSTARTED: 'unstarted',
  GET_DATA_STARTED: 'get_data_started',
  GET_DATA_FINISHED: 'get_data_finished',
  ENTITY_LINKING_STARTED: 'entity_linking_started',
  ENTITY_LINKING_FINISHED: 'entity_linking_finished'
})

export const StripeSubscriptionStatus = Object.freeze({
  INCOMPLETE: 'incomplete',
  INCOMPLETE_EXPIRED: 'incomplete_expired',
  TRIALING: 'trialing',
  ACTIVE: 'active',
  PAST_DUE: 'past_due',
  CANCELED: 'canceled',
  UNPAID: 'unpaid'
})

export const StripePaymentStatus = Object.freeze({
  REQUIRES_PAYMENT_METHOD: 'requires_payment_method',
  REQUIRES_CONFIRMATION: 'requires_confirmation',
  REQUIRES_ACTION: 'requires_action',
  PROCESSING: 'processing',
  SUCCEEDED: 'succeeded'
})

export const DeliveryMethods = Object.freeze({
  INDOOR: 'indoor',
  DELIVERY: 'delivery',
  TAKEOUT: 'takeout'
})

export const Topics = Object.freeze({
  ORDER: 'order',
  PRODUCTION_REQUEST: 'productionRequest'
})

export const DefaultExpenseCategories = Object.freeze([
  {
    _id: new ObjectId('600074a4981c03d9baa2db6d'),
    name: 'Despesas Gerais',
    color: '#F57C00'
  },
  {
    _id: new ObjectId('6000751d981c03d9baa2db6f'),
    name: 'Compras Estoque',
    color: '#9C27B0'
  },
  {
    _id: new ObjectId('60007533981c03d9baa2db70'),
    name: 'Impostos',
    color: '#F44336'
  },
  {
    _id: new ObjectId('60007579981c03d9baa2db71'),
    name: 'Taxas meio de pagamento',
    color: '#FF5722'
  },
  {
    _id: new ObjectId('60007599981c03d9baa2db72'),
    name: 'Ajuste',
    color: '#607D8B'
  }
])

export const DefaultIncomeCategories = Object.freeze([
  {
    _id: new ObjectId('600075bf981c03d9baa2db73'),
    name: 'Vendas',
    color: '#4CAF50'
  },
  {
    _id: new ObjectId('600075d6981c03d9baa2db74'),
    name: 'Receitas Gerais',
    color: '#2196F3'
  },
  {
    _id: new ObjectId('600075e7981c03d9baa2db75'),
    name: 'Ajuste',
    color: '#607D8B'
  }
])

export const ExpenseCategories = Object.freeze({
  GENERAL_EXPENSE: DefaultExpenseCategories[0]._id,
  INVENTORY_PURCHASE: DefaultExpenseCategories[1]._id,
  TAXES: DefaultExpenseCategories[2]._id,
  PAYMENT_METHOD_FEE: DefaultExpenseCategories[3]._id,
  ADJUSTMENT: DefaultExpenseCategories[4]._id
})

export const IncomeCategories = Object.freeze({
  SALE: DefaultIncomeCategories[0]._id,
  GENERAL_INCOME: DefaultIncomeCategories[1]._id,
  ADJUSTMENT: DefaultIncomeCategories[2]._id
})

export const FinancialOperations = Object.freeze({
  INCOME: 'income',
  EXPENSE: 'expense'
})

export const MemberInviteStatus = Object.freeze({
  PENDING: 'pending',
  SUCCESS: 'success'
})

export const FinancialFundCategories = Object.freeze({
  REGISTER: 'register',
  BANK_ACCOUNT: 'bank_account'
})

export const DefaultPaymentMethods = Object.freeze([
  {
    _id: new ObjectId('6001d2e0981c03d9baa2db77'),
    name: 'Dinheiro',
    fee: 0.0,
    operationType: OperationTypes.PERCENTAGE,
    method: Payments.CASH
  },
  {
    _id: new ObjectId('6001d2f1981c03d9baa2db78'),
    name: 'Crédito',
    fee: 0.0,
    operationType: OperationTypes.PERCENTAGE,
    method: Payments.CREDIT
  },
  {
    _id: new ObjectId('6001d2fc981c03d9baa2db79'),
    name: 'Débito',
    fee: 0.0,
    operationType: OperationTypes.PERCENTAGE,
    method: Payments.DEBT
  },
  {
    _id: new ObjectId('6001d309981c03d9baa2db7a'),
    name: 'Voucher',
    fee: 0.0,
    operationType: OperationTypes.PERCENTAGE,
    method: Payments.VOUCHER
  },
  {
    _id: new ObjectId('6001d314981c03d9baa2db7b'),
    name: 'PIX',
    fee: 0.0,
    operationType: OperationTypes.PERCENTAGE,
    method: Payments.PIX
  }
])

export const DefaultPurchasePaymentMethods = Object.freeze([
  {
    _id: new ObjectId('600afc58f705d47058f4d801'),
    name: 'Dinheiro',
    fee: 0.0,
    operationType: OperationTypes.PERCENTAGE,
    method: Payments.CASH
  },
  {
    _id: new ObjectId('600afc60f705d47058f4d802'),
    name: 'Crédito',
    fee: 0.0,
    operationType: OperationTypes.PERCENTAGE,
    method: Payments.CREDIT
  },
  {
    _id: new ObjectId('600afc68f705d47058f4d803'),
    name: 'Débito',
    fee: 0.0,
    operationType: OperationTypes.PERCENTAGE,
    method: Payments.DEBT
  },
  {
    _id: new ObjectId('600afc6ff705d47058f4d804'),
    name: 'Voucher',
    fee: 0.0,
    operationType: OperationTypes.PERCENTAGE,
    method: Payments.VOUCHER
  },
  {
    _id: new ObjectId('600afc77f705d47058f4d805'),
    name: 'PIX',
    fee: 0.0,
    operationType: OperationTypes.PERCENTAGE,
    method: Payments.PIX
  }
])

export const RegisterOperationTypes = Object.freeze({
  OPEN: 'open',
  CLOSE: 'close'
})
