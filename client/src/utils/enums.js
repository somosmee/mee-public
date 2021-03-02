import React from 'react'

import Money from '@material-ui/icons/Money'
import Payment from '@material-ui/icons/Payment'

export const Environments = Object.freeze({
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  STAGING: 'staging',
  TEST: 'test'
})

export const Payments = Object.freeze({
  cash: {
    type: 'cash',
    label: 'Dinheiro',
    icon: <Money />,
    installment: 'À vista'
  },
  credit: {
    type: 'credit',
    label: 'Crédito',
    icon: <Payment />,
    installment: 'À vista'
  },
  debt: {
    type: 'debt',
    label: 'Débito',
    icon: <Payment />,
    installment: 'À vista'
  },
  voucher: {
    type: 'voucher',
    label: 'Voucher',
    icon: <Payment />,
    installment: 'À vista'
  },
  pix: {
    type: 'pix',
    label: 'Pix',
    icon: <Payment />,
    installment: 'À vista'
  }
})

export const PaymentsLoggi = Object.freeze({
  1: {
    type: 1,
    name: 'Crédito',
    icon: <Payment />,
    installment: 'À vista'
  },
  2: {
    type: 2,
    name: 'Débito',
    icon: <Payment />,
    installment: 'À vista'
  },
  4: {
    type: 4,
    name: 'Dinheiro sem troco',
    icon: <Money />,
    installment: 'À vista'
  },
  8: {
    type: 8,
    name: 'Dinheiro com troco',
    icon: <Money />,
    installment: 'À vista'
  },
  16: {
    type: 16,
    name: 'Cheque',
    icon: <Payment />,
    installment: 'À vista'
  },
  32: {
    type: 32,
    name: 'Pagamento com maquininha da loja',
    icon: <Payment />,
    installment: 'À vista'
  },
  64: {
    type: 64,
    name: 'Pagamento já realizado',
    icon: <Payment />,
    installment: 'À vista'
  },
  128: {
    type: 128,
    name: 'Vale-Refeição',
    icon: <Payment />,
    installment: 'À vista'
  },
  256: {
    type: 256,
    name: 'Sodexo',
    icon: <Payment />,
    installment: 'À vista'
  },
  512: {
    type: 512,
    name: 'Alelo',
    icon: <Payment />,
    installment: 'À vista'
  },
  1024: {
    type: 1024,
    name: 'Ticket',
    icon: <Payment />,
    installment: 'À vista'
  }
})

export const Banknotes = [
  {
    type: 2,
    label: 'R$ 2,00'
  },
  {
    type: 5,
    label: 'R$ 5,00'
  },
  {
    type: 10,
    label: 'R$ 10,00'
  },
  {
    type: 20,
    label: 'R$ 20,00'
  },
  {
    type: 50,
    label: 'R$ 50,00'
  },
  {
    type: 100,
    label: 'R$ 100,00'
  },
  {
    type: 200,
    label: 'R$ 200,00'
  }
]

export const Measurements = Object.freeze({
  unit: {
    type: 'unit',
    label: 'Unidade',
    symbol: 'Un'
  },
  kilogram: {
    type: 'kilogram',
    label: 'Quilograma',
    symbol: 'Kg'
  }
})

export const Gender = Object.freeze({
  male: {
    type: 'male',
    name: 'Masculino'
  },
  female: {
    type: 'female',
    name: 'Feminino'
  },
  others: {
    type: 'others',
    name: 'Outros'
  }
})

export const SnackbarVariants = Object.freeze({
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'info'
})

export const OrderStatus = Object.freeze({
  open: {
    type: 'open',
    label: 'Aberto'
  },
  confirmed: {
    type: 'confirmed',
    label: 'Confirmado'
  },
  partially_paid: {
    type: 'partially_paid',
    label: 'Parcialmente pago'
  },
  closed: {
    type: 'closed',
    label: 'Finalizado'
  },
  canceled: {
    type: 'canceled',
    label: 'Cancelado'
  }
})

export const IfoodStatus = Object.freeze({
  placed: 'PLACED',
  integrated: 'INTEGRATED',
  confirmed: 'CONFIRMED'
})

export const Origins = Object.freeze({
  mee: {
    label: 'Mee',
    value: 'mee'
  },
  shopfront: {
    label: 'Vitrine',
    value: 'shopfront'
  },
  ifood: {
    label: 'iFood',
    value: 'ifood'
  }
})

export const ChargeStatus = Object.freeze({
  pending: {
    type: 'pending',
    label: 'Pendente'
  },
  success: {
    type: 'success',
    label: 'Pago'
  },
  failed: {
    type: 'failed',
    label: 'Falhou'
  }
})

export const LabelTypes = Object.freeze({
  number: 'number',
  currency: 'currency',
  date: 'date'
})

export const PurchaseStatus = Object.freeze({
  fetching: {
    type: 'fetching',
    label: 'Buscando'
  },
  success: {
    type: 'success',
    label: 'Sucesso'
  },
  error: {
    type: 'error',
    label: 'Erro'
  }
})

export const PurchaseItemStatus = Object.freeze({
  new: {
    type: 'new',
    label: 'Produto novo'
  },
  draft: {
    type: 'draft',
    label: 'Rascunho'
  },
  addedToInventory: {
    type: 'added_to_inventory',
    label: 'Adicionado ao estoque'
  }
})

export const Plans = Object.freeze({
  one_month: {
    type: 'D9651B4BE6E6B50EE40AFF8B9F01559F',
    name: 'Plano 1 mês - R$ 100,00'
  }
})

export const States = Object.freeze({
  sp: {
    type: 'SP',
    name: 'São Paulo'
  },
  am: {
    type: 'AM',
    name: 'Amazonas'
  }
})

export const CreditCardBrands = Object.freeze({
  visa: {
    type: 'visa',
    name: 'Visa'
  },
  mastercard: {
    type: 'mastercard',
    name: 'MasterCard'
  }
})

// TODO untangle both variables
export const Roles = Object.freeze({
  admin: {
    type: 'admin',
    name: 'administrador'
  },
  employer: {
    type: 'employer',
    name: 'empregador'
  },
  employee: {
    type: 'employee',
    name: 'funcionário'
  },
  accountant: {
    type: 'accountant',
    name: 'contador'
  }
})

export const MemberRoles = Object.freeze({
  businessAdmin: {
    // can do anything to a company
    value: 'businessAdmin',
    label: 'Administrador'
  },
  manager: {
    // cant change company info like CNPJ or digital certificate but can see reports etc
    value: 'manager',
    label: 'Gerente'
  },
  attendant: {
    // can do everything related with orders, products etc but not see reports
    value: 'attendant',
    label: 'Atendente'
  },
  accountant: {
    // can setup NFe only and company gov registration
    value: 'accountant',
    label: 'Contador'
  }
})

export const Paths = Object.freeze({
  home: {
    path: '/',
    label: 'Home'
  },
  myCompanies: {
    path: '/myCompanies',
    label: 'Home'
  },
  googleSignin: {
    path: '/googleSignin',
    label: 'Google Sign in'
  },
  emailSignin: {
    path: '/emailSignin',
    label: 'Email Sign in'
  },
  pin: {
    path: '/pin',
    label: 'Home'
  },
  externalSignin: {
    path: '/externalSignin',
    label: 'Signin externo'
  },
  memberInvite: {
    path: '/memberInvite',
    label: 'Convite'
  },
  invite: {
    path: '/invite',
    label: 'Convite'
  },
  profile: {
    path: '/profile',
    label: 'Meu Negócio'
  },
  reports: {
    path: '/reports',
    label: 'Relatórios'
  },
  paymentMethods: {
    path: '/paymentMethods',
    label: 'Métodos de Pagamento'
  },
  financialStatementCategories: {
    path: '/financialStatementCategories',
    label: 'Categorias'
  },
  financialStatements: {
    path: '/financialStatements',
    label: 'Extrato'
  },
  registerOperations: {
    path: '/registerOperations',
    label: 'Histórico de fechamentos'
  },
  support: {
    path: '/support',
    label: 'Planos'
  },
  billing: {
    path: '/billing',
    label: 'Cobranças'
  },
  vitrines: {
    path: '/vitrines/:shopfrontId',
    label: 'Vitrine'
  },
  shopfront: {
    path: '/shopfront',
    label: 'Vitrine digital'
  },
  sales: {
    path: '/sales',
    label: 'Vender'
  },
  orderPreview: {
    path: '/orders/:orderId/preview',
    label: 'Order preview'
  },
  products: {
    path: '/products',
    label: 'Produtos'
  },
  product: {
    path: '/products/:productId',
    label: 'Produto'
  },
  orders: {
    path: '/orders',
    label: 'Histórico de pedidos'
  },
  customers: {
    path: '/customers',
    label: 'Clientes'
  },
  tags: {
    path: '/tags',
    label: 'Etiquetas'
  },
  purchases: {
    path: '/purchases',
    label: 'Compras'
  },
  purchase: {
    path: '/purchases/:purchaseId',
    label: 'Compra'
  },
  suppliers: {
    path: '/suppliers',
    label: 'Fornecedores'
  },
  subscribe: {
    path: '/subscribe',
    label: 'Inscrever-se'
  },
  waitForEmployer: {
    path: '/wait-for-employer',
    label: 'Aguardar estabelecimento'
  },
  ifoodSetup: {
    path: '/deliveries/ifood/setup',
    label: 'iFood'
  },
  ifood: {
    path: '/deliveries/ifood',
    label: 'iFood'
  },
  loggiSetup: {
    path: '/deliveries/loggi/setup',
    label: 'Loggi'
  },
  loggi: {
    path: '/deliveries/loggi',
    label: 'Loggi'
  },
  accountant: {
    path: '/accountant',
    label: 'Contador'
  },
  taxes: {
    path: '/taxes',
    label: 'Impostos'
  },
  nfe: {
    path: '/nfe',
    label: 'Nota Fiscal'
  },
  settings: {
    path: '/settings',
    label: 'Configurações'
  }
})

export const AddProductShopfrontSteps = Object.freeze({
  internal: 'internal',
  barcode: 'barcode',
  selectProduct: 'selectProduct',
  createProduct: 'createProduct'
})

export const CreateCustomerContents = Object.freeze({
  newCustomer: 'newCustomer',
  manageAddress: 'manageAddress',
  newAddress: 'newAddress',
  review: 'review'
})

export const CreateProductSteps = Object.freeze({
  internal: 'internal',
  barcode: 'barcode',
  addInfo: 'addInfo'
})

export const DeliverySteps = Object.freeze({
  customer: 'customer',
  newCustomer: 'newCustomer',
  shipping: 'shipping',
  newAddress: 'newAddress',
  payment: 'payment',
  deliveryFee: 'deliveryFee',
  review: 'review'
})

export const AddPurchaseSteps = Object.freeze({
  selectGoal: 'selectGoal',
  financialStatement: 'financialStatement',
  supplier: 'supplier',
  newSupplier: 'newSupplier',
  items: 'items',
  selectProduct: 'selectProduct',
  newProduct: 'newProduct',
  newItem: 'newItem',
  addTotal: 'addTotal',
  // create product steps
  internal: 'internal',
  barcode: 'barcode',
  addInfo: 'addInfo'
})

export const CreateOrderLoggiSteps = Object.freeze({
  selectOrder: 'selectOrder',
  selectCustomer: 'selectCustomer',
  newCustomer: 'newCustomer',
  address: 'address',
  newAddress: 'newAddress',
  dimensions: 'dimensions',
  charge: 'charge',
  pickup: 'pickup',
  newPickupAddress: 'newPickupAddress',
  review: 'review'
})

export const Deliveries = Object.freeze({
  ifood: 'ifood'
})

/* TAXES */

export const ICMSTaxRegimes = Object.freeze({
  normal: {
    value: 'normal',
    name: 'Regime Normal'
  },
  simplesNacional: {
    value: 'simplesNacional',
    name: 'Simples Nacional'
  }
})

export const TaxRegimes = Object.freeze({
  simplesNacional: {
    value: '1',
    name: 'Simples Nacional'
  },
  simplesNacionalRevenue: {
    value: '2',
    name: 'Simples Nacional, excesso sublimite de receita bruta'
  },
  normal: {
    value: '3',
    name: 'Regime Normal. (v2.0)'
  }
})

export const ICMSNormalTaxType = Object.freeze({
  // ICMS= 00, 20, 90
  integral: {
    value: '00',
    name: 'Tributada integralmente'
  },
  reductions: {
    value: '20',
    name: 'Com redução de base de cálculo'
  },
  others: {
    value: '90',
    name: 'Outros'
  },
  // ICMS = 40, 41, 60
  insents: {
    value: '40',
    name: 'Isenta'
  },
  noTaxes: {
    value: '41',
    name: 'Não tributada'
  },
  charged: {
    value: '60',
    name: 'ICMS cobrado anteriormente por substituição tributária'
  }
})

/*
  ICMS – SIMPLES NACIONAL
  ('101', 'ICMS 101 - Tributação ICMS pelo Simples Nacional, CSOSN=101'),
  ('102', 'ICMS 102 - Tributação ICMS pelo Simples Nacional, CSOSN=102, 103, 300 ou 400'),
  ('201', 'ICMS 201 - Tributação ICMS pelo Simples Nacional, CSOSN=201'),
  ('202', 'ICMS 202 - Tributação ICMS pelo Simples Nacional, CSOSN=202 ou 203'),
  ('500', 'ICMS 500 - Tributação ICMS pelo Simples Nacional, CSOSN=500'),
  ('900', 'ICMS 900 - Tributação ICMS pelo Simples Nacional, CSOSN=900'),
*/

export const ICMSSimplesNacionalTaxType = Object.freeze({
  1: {
    value: '101',
    name: '101 - Tributação ICMS pelo Simples Nacional, CSOSN=101'
  },
  2: {
    value: '102',
    name: '102 - Tributação ICMS pelo Simples Nacional, CSOSN=102, 103, 300 ou 400'
  },
  3: {
    value: '201',
    name: '201 - Tributação ICMS pelo Simples Nacional, CSOSN=201'
  },
  4: {
    value: '202',
    name: '202 - Tributação ICMS pelo Simples Nacional, CSOSN=202 ou 203'
  },
  5: {
    value: '500',
    name: '500 - Tributação ICMS pelo Simples Nacional, CSOSN=500'
  },
  6: {
    value: '900',
    name: '900 - Tributação ICMS pelo Simples Nacional, CSOSN=900'
  }
})

/*
  ICMS CSOSN - Código de Situação da Operação – SIMPLES NACIONAL
  ('101', 'ICMS 101 - Tributação ICMS pelo Simples Nacional, CSOSN=101'),
  ('102', 'ICMS 102 - Tributação ICMS pelo Simples Nacional, CSOSN=102, 103, 300 ou 400'),
  ('201', 'ICMS 201 - Tributação ICMS pelo Simples Nacional, CSOSN=201'),
  ('202', 'ICMS 202 - Tributação ICMS pelo Simples Nacional, CSOSN=202 ou 203'),
  ('500', 'ICMS 500 - Tributação ICMS pelo Simples Nacional, CSOSN=500'),
  ('900', 'ICMS 900 - Tributação ICMS pelo Simples Nacional, CSOSN=900'),
*/
export const ICMSCsosn = Object.freeze({
  // icmsTaxGroup is the key for those options
  101: {
    one: {
      value: '101',
      name: '101 - Tributada pelo Simples Nacional com permissão de crédito de ICMS'
    }
  },
  102: {
    one: {
      value: '102',
      name: '102 - Tributada pelo Simples Nacional sem permissão de crédito'
    },
    two: {
      value: '103',
      name: '103 - Isenção de ICMS no Simples Nacional na faixa de receita bruta'
    },
    three: {
      value: '300',
      name: '300 - Imune de ICMS'
    },
    four: {
      value: '400',
      name: '400 - Não tributada pelo Simples Nacional'
    }
  },
  201: {
    one: {
      value: '201',
      name:
        '201 - Tributada pelo Simples Nacional com permissão de crédito e cobrança do ICMS por ST'
    }
  },
  202: {
    one: {
      value: '202',
      name:
        '202 - Tributada pelo Simples Nacional sem permissão de crédito e com cobrança do ICMS por ST'
    },
    two: {
      value: '203',
      name:
        '203 - Isenção do ICMS no Simples Nacional para faixa de receita bruta e cobrança de ICMS por ST'
    }
  },
  500: {
    one: {
      value: '500',
      name: '500 - ICMS cobrado anteriormente por ST ou por antecipação'
    }
  },
  900: {
    one: {
      value: '900',
      name: '900 - Outros (operações que não se enquadram nos códigos anteriores)'
    }
  }
})

export const ICMSOrigin = Object.freeze({
  national0: {
    value: '0',
    name: '0 - Nacional exceto items 3,4,5 e 8',
    description: 'Nacional - exceto as indicadas nos códigos 3, 4, 5 e 8'
  },
  foreign: {
    value: '1',
    name: '1 - Estrangeira importação direta exceto item 6',
    description: 'Estrangeira - Importação direta, exceto a indicada no código 6'
  },
  foreign2: {
    value: '2',
    name: '2 - Estrangeira mercado interno exceto item 7',
    description: 'Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7'
  },
  national3: {
    value: '3',
    name: '3 - Nacional importação entre 40% e 70%',
    description: 'Nacional - com conteúdo de importação entre 40% e 70%'
  },
  national4: {
    value: '4',
    name: '4 - Nacional',
    description:
      'Nacional cuja produção tenha sido feita em conformidade com os processos produtivos básicos de que tratam as legislações citadas nos Ajustes;'
  },
  national5: {
    value: '5',
    name: '5 - Nacional importação menor ou igual a 40%',
    description: 'Nacional - com conteúdo de importação inferior ou igual a 40%'
  },
  foreign6: {
    value: '6',
    name: '6 - Estrangeira importação direta sem similar nacional',
    description:
      'Estrangeira - Importação direta, sem similar nacional, constante em lista da CAMEX;'
  },
  foreign7: {
    value: '7',
    name: '7 - Estrangeira adquirida no mercado interno sem similar nacional',
    description:
      'Estrangeira - Adquirida no mercado interno, sem similar nacional, constante em lista da CAMEX;'
  },
  national8: {
    value: '8',
    name: '8 - Nacional importação superior a 70%',
    description: 'Nacional - com conteúdo de importação superior a 70%'
  }
})

export const IncidenceRegimes = Object.freeze({
  cumulative: {
    value: 'cumulative',
    name: 'Cumulativo'
  },
  nonCumulative: {
    value: 'nonCumulative',
    name: 'Não Cumulativo'
  }
})

/**
  PIS_TIPOS_TRIBUTACAO = (
     ('01', 'PIS 01 - Operação Tributável - Base de cálculo = valor da operação alíquota normal (cumulativo/não cumulativo)'),
     ('02', 'PIS 02 - Operação Tributável - Base de cálculo = valor da operação (alíquota diferenciada)'),
     ('03', 'PIS 03 - Operacao Tributavel - Base de cálculo = quantidade vendida x alíquota por unidade de produto)'),
     ('04', 'PIS 04 - Operacao Tributavel - Tributacao Monofasica - (Aliquota Zero)'),
     ('06', 'PIS 06 - Operacao Tributavel - Aliquota Zero'),
     ('07', 'PIS 07 - Operacao Isenta da Contribuicao'),
     ('08', 'PIS 08 - Operacao sem Indidencia da Contribuicao'),
     ('09', 'PIS 09 - Operacao com Suspensao da Contribuicao'),
     ('49', 'PIS 49 - Outras Operações de Saída'),
     ('50', 'PIS 50 - Operação com Direito a Crédito - Vinculada Exclusivamente a Receita Tributada no Mercado Interno'),
     ('51', 'PIS 51 - Operação com Direito a Crédito - Vinculada Exclusivamente a Receita Não Tributada no Mercado Interno'),
     ('52', 'PIS 52 - Operação com Direito a Crédito – Vinculada Exclusivamente a Receita de Exportação'),
     ('53', 'PIS 53 - Operação com Direito a Crédito - Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno'),
     ('54', 'PIS 54 - Operação com Direito a Crédito - Vinculada a Receitas Tributadas no Mercado Interno e de Exportação'),
     ('55', 'PIS 55 - Operação com Direito a Crédito - Vinculada a Receitas Não Tributadas no Mercado Interno e de Exportação'),
     ('56', 'PIS 56 - Operação com Direito a Crédito - Vinculada a Receitas Tributadas e Não Tributadas no Mercado Interno, e de Exportação'),
     ('60', 'PIS 60 - Crédito Presumido - Operação de Aquisição Vinculada Exclusivamente a Receita Tributada no Mercado Interno'),
     ('61', 'PIS 61 - Crédito Presumido - Operação de Aquisição Vinculada Exclusivamente a Receita Não Tributada no Mercado Interno'),
     ('62', 'PIS 62 - Crédito Presumido - Operação de Aquisição Vinculada Exclusivamente a Receita de Exportação'),
     ('63', 'PIS 63 - Crédito Presumido - Operação de Aquisição Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno'),
     ('64', 'PIS 64 - Crédito Presumido - Operação de Aquisição Vinculada a Receitas Tributadas no Mercado Interno e de Exportação'),
     ('65', 'PIS 65 - Crédito Presumido - Operação de Aquisição Vinculada a Receitas Não Tributadas no Mercado Interno e de Exportação'),
     ('66', 'PIS 66 - Crédito Presumido - Operação de Aquisição Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno, e de Exportação'),
     ('67', 'PIS 67 - Crédito Presumido - Outras Operações'),
     ('70', 'PIS 70 - Operação de Aquisição sem Direito a Crédito'),
     ('71', 'PIS 71 - Operação de Aquisição com Isenção'),
     ('72', 'PIS 72 - Operação de Aquisição com Suspensão'),
     ('73', 'PIS 73 - Operação de Aquisição a Alíquota Zero'),
     ('74', 'PIS 74 - Operação de Aquisição; sem Incidência da Contribuição'),
     ('75', 'PIS 75 - Operação de Aquisição por Substituição Tributária'),
     ('98', 'PIS 98 - Outras Operações de Entrada'),
     ('99', 'PIS 99 - Outras operacoes'),
 )
 */

export const PisCofinsTaxTypes = Object.freeze({
  '01': {
    value: '01',
    name:
      '01 - Operação Tributável - Base de cálculo = valor da operação alíquota normal (cumulativo/não cumulativo)'
  },
  '07': {
    value: '07',
    name: '07 - Operacao Isenta da Contribuicao'
  }
})

export const SubscriptionStatus = Object.freeze({
  INCOMPLETE: 'incomplete',
  INCOMPLETE_EXPIRED: 'incomplete_expired',
  TRIALING: 'trialing',
  ACTIVE: 'active',
  PAST_DUE: 'past_due',
  CANCELED: 'canceled',
  UNPAID: 'unpaid'
})

export const Reasons = Object.freeze({
  acquisition: {
    type: 'acquisition',
    name: 'Compra'
  },
  sale: {
    type: 'sale',
    name: 'Venda'
  },
  return: {
    type: 'return',
    name: 'Devolução'
  },
  expired: {
    type: 'expired',
    name: 'Vencido'
  },
  damaged: {
    type: 'damaged',
    name: 'Danificado'
  },
  manual_adjustment: {
    type: 'manual_adjustment',
    name: 'Ajuste manual'
  }
})

export const InventoryAction = Object.freeze({
  input: {
    type: 'input',
    name: 'Entraram'
  },
  output: {
    type: 'output',
    name: 'Sairam'
  }
})

export const IfoodBenefitTargets = Object.freeze({
  CART: {
    value: 'CART',
    label: 'Valor total do pedido'
  },
  DELIVERY_FEE: {
    value: 'DELIVERY_FEE',
    label: 'Taxa de entrega'
  }
})

export const InvoiceStatus = Object.freeze({
  PENDING: 'pending',
  SUCCESS: 'success',
  ERROR: 'error'
})

export const FirebaseEvents = Object.freeze({
  ONBOARDING_ADD_PRODUCT_STEP: 'onboarding_add_product_step',
  ONBOARDING_ADD_ORDER_STEP: 'onboarding_add_order_step',
  ONBOARDING_CLOSE_ORDER_STEP: 'onboarding_close_order_step',
  SEND_PIN: 'send_pin',
  SET_LOGGI_CREDENTIALS: 'set_loggi_credentials',
  RETRY_PAYMENT: 'retry_payment',
  BEGIN_SETUP_PAYMENT_METHOD: 'begin_setup_payment_method',
  BEGIN_CHECKOUT: 'begin_checkout',
  PURCHASE: 'purchase',
  LOGIN: 'login',
  SIGNUP: 'sign_up',
  CREATE_PURCHASE: 'create_purchase',
  SEND_ACCOUNTANT_INVITE: 'send_accountant_invite',
  SET_TAXES: 'set_taxes',
  CREATE_ORDER: 'create_order',
  CREATE_LOGGI_ORDER: 'create_order',
  IFOOD_CONFIRM_ORDER: 'ifood_confirm_order',
  IFOOD_MENU_CATEGORY_UPDATE: 'ifood_menu_category_update',
  IFOOD_MENU_CATEGORY_CREATE: 'ifood_menu_category_create',
  IFOOD_MENU_CATEGORY_DELETE: 'ifood_menu_category_delete',
  IFOOD_MENU_ITEM_ADD: 'ifood_menu_item_add',
  IFOOD_MENU_ITEM_DELETE: 'ifood_menu_item_delete',
  IFOOD_MENU_ITEM_AVAILABILITY_CHANGE: 'ifood_menu_item_availability_change',
  IFOOD_DISPATCH_ORDER: 'ifood_dispatch_order',
  SET_IFOOD_CREDENTIALS: 'set_ifood_credentials',
  SET_SYNC_IFOOD: 'set_sync_ifood',
  CREATE_SUPPLIER: 'create_supplier',
  CREATE_CUSTOMER: 'create_customer',
  UPDATE_CUSTOMER: 'update_customer',
  DELETE_CUSTOMER: 'delete_customer',
  CREATE_CUSTOMER_ADDRESS: 'create_customer_address',
  UPDATE_CUSTOMER_ADDRESS: 'update_customer_address',
  DELETE_CUSTOMER_ADDRESS: 'delete_customer_address',
  CREATE_PRODUCT: 'create_product',
  UPDATE_PRODUCT: 'update_product',
  DELETE_PRODUCT: 'delete_product',
  CREATE_PRODUCT_SHOW_MORE: 'create_product_show_more',
  ADD_PRODUCT_BUNDLE: 'add_product_bundle',
  DELETE_PRODUCT_BUNDLE: 'delete_product_bundle',
  INVENTORY_ADJUSTMENT: 'inventory_adjustment',
  IMPORT_PRODUCTS_CLICK: 'import_products_click',
  IMPORT_PRODUCTS: 'import_products',
  IMPORT_PRODUCTS_FAIL: 'import_products_fail',
  SET_PROFILE: 'set_profile',
  SET_ADDRESS: 'set_address',
  SET_DELIVERY_FEE: 'set_delivery_fee',
  LOGOUT: 'logout',
  SCREEN_VIEW: 'screen_view',
  PRICE_RULE_CREATE: 'price_rule_create',
  PRICE_RULE_UPDATE: 'price_rule_update',
  PRICE_RULE_DELETE: 'price_rule_delete',
  UPDATE_LOCAL_SETTINGS: 'update_local_settings',
  DELETE_FINANCIAL_STATEMENT: 'delete_financial_statement',
  CREATE_BANK_ACCOUNT: 'create_bank_account',
  CREATE_REGISTER: 'create_REGISTER',
  DELETE_FINANCIAL_FUND: 'delete_financial_fund',
  ADJUST_FINANCIAL_FUND: 'adjust_financial_fund',
  CREATE_INCOME: 'create_income',
  CREATE_EXPENSE: 'create_expense',
  CREATE_MANUAL_PURCHASE_CLICK: 'create_manual_purchase_click',
  CREATE_AUTOMATIC_PURCHASE_CLICK: 'create_automatic_purchase_click',
  DELETE_FINANCIAL_STATEMENT_CATEGORY: 'delete_financial_statement_category',
  CREATE_OPEN_REGISTER_OPERATION: 'create_open_register_operation',
  CREATE_CLOSE_REGISTER_OPERATION: 'create_close_register_operation',
  DELETE_REGISTER_OPERATION: 'delete_register_operation'
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

export const Integrations = Object.freeze({
  ifood: {
    label: 'iFood',
    value: 'ifood'
  }
})

export const OperationTypes = Object.freeze({
  percentage: {
    label: '%',
    value: 'percentage'
  },
  absolute: {
    label: 'R$',
    value: 'absolute'
  }
})

export const ExpenseCategories = Object.freeze({
  general: {
    label: 'Despesas gerais',
    value: 'general_expense'
  }
})

export const IncomeCategories = Object.freeze({
  general: {
    label: 'Outras receitas',
    value: 'general_income'
  }
})

export const SalesTypes = Object.freeze({
  checkout: 'checkout',
  orders: 'orders'
})

export const DeliveryTypes = Object.freeze({
  indoor: {
    type: 'indoor',
    label: 'Na mesa'
  },
  delivery: {
    type: 'delivery',
    label: 'Para entrega (delivery)'
  },
  takeout: {
    type: 'takeout',
    label: 'Para retirada'
  }
})

export const Conditions = Object.freeze({
  LESS_THAN: 'less_than',
  GREATER_THAN: 'greater_than'
})

export const FinancialOperations = Object.freeze({
  EXPENSE: 'expense',
  INCOME: 'income'
})

export const FinancialFundCategories = Object.freeze({
  BANK_ACCOUNT: 'bank_account',
  REGISTER: 'register'
})

export const CompanyRoles = Object.freeze({
  ADMIN: 'admin', // can use admin mutation tools and basically anything to any user
  BUSINESS_ADMIN: 'businessAdmin', // can do anything to a company
  MANAGER: 'manager', // cant change company info like CNPJ or digital certificate but can see reports etc
  ATTENDANT: 'attendant', // can do everything related with orders, products etc but not see reports
  ACCOUNTANT: 'accountant' // can setup NFe only and company gov registration
})

export const RegisterOperationTypes = Object.freeze({
  OPEN: 'open',
  CLOSE: 'close'
})

export const PaymentMethodTypes = Object.freeze({
  PURCHASE: 'purchase',
  SALE: 'sale'
})

export const Colors = [
  '#FF5252',
  '#FF80AB',
  '#EA80FC',
  '#B388FF',
  '#8C9EFF',
  '#448AFF',
  '#00B0FF',
  '#00E5FF',
  '#1DE9B6',
  '#69F0AE',
  '#B2FF59',
  '#EEFF41',
  '#F57F17',
  '#FFD740',
  '#FFAB40',
  '#FF6E40',
  '#5D4037',
  '#616161'
]

export const InvoiceIndicatorColors = Object.freeze({
  error: '#F44336',
  pending: '#FDD835',
  success: '#4CAF50'
})
