import React, { lazy } from 'react'
import { BrowserRouter as Router, Switch } from 'react-router-dom'

import CssBaseline from '@material-ui/core/CssBaseline'
import { MuiThemeProvider } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import NewUpdatesDialog from 'src/components/NewUpdatesDialog'

import EmailSigninContainer from 'src/containers/EmailSigninContainer'
import PinContainer from 'src/containers/PinContainer'
import SigninContainer from 'src/containers/SigninContainer'

import NotFoundView from 'src/views/NotFoundView'

import External from 'src/routers/External'
import Private from 'src/routers/Private'
import Public from 'src/routers/Public'
import theme from 'src/routers/theme'

import { Paths } from 'src/utils/enums'
const BillingContainer = lazy(() => import('src/containers/BillingContainer'))
const CustomersContainer = lazy(() => import('src/containers/CustomersContainer'))
const ExternalSigninContainer = lazy(() => import('src/containers/ExternalSigninContainer'))
const MemberInviteContainer = lazy(() => import('src/containers/MemberInviteContainer'))
const IfoodContainer = lazy(() => import('src/containers/IfoodContainer'))
const IfoodSetupContainer = lazy(() => import('src/containers/IfoodSetupContainer'))
const LoggiContainer = lazy(() => import('src/containers/LoggiContainer'))
const LoggiSetupContainer = lazy(() => import('src/containers/LoggiSetupContainer'))
const NoEmployerContainer = lazy(() => import('src/containers/NoEmployerContainer'))
const OrderPreviewContainer = lazy(() => import('src/containers/OrderPreviewContainer'))
const OrdersHistoryContainer = lazy(() => import('src/containers/OrdersHistoryContainer'))
const ProductContainer = lazy(() => import('src/containers/ProductContainer'))
const ProductsContainer = lazy(() => import('src/containers/ProductsContainer'))
const ProfileContainer = lazy(() => import('src/containers/ProfileContainer'))
const MyCompaniesContainer = lazy(() => import('src/containers/MyCompaniesContainer'))
const PurchaseContainer = lazy(() => import('src/containers/PurchaseContainer'))
const PurchasesContainer = lazy(() => import('src/containers/PurchasesContainer'))
const ReportsContainer = lazy(() => import('src/containers/ReportsContainer'))
const SalesContainer = lazy(() => import('src/containers/SalesContainer'))
const SettingsContainer = lazy(() => import('src/containers/SettingsContainer'))
const ShopfrontPublicContainer = lazy(() => import('src/containers/ShopfrontPublicContainer'))
const ShopfrontContainer = lazy(() => import('src/containers/ShopfrontContainer'))
const SuppliersContainer = lazy(() => import('src/containers/SuppliersContainer'))
const SupportContainer = lazy(() => import('src/containers/SupportContainer'))
const NFeContainer = lazy(() => import('src/containers/NFeContainer'))
const FinancialStatementsContainer = lazy(() =>
  import('src/containers/FinancialStatementsContainer')
)
const PaymentMethodsContainer = lazy(() => import('src/containers/PaymentMethodsContainer'))
const FinancialStatementCategoriesContainer = lazy(() =>
  import('src/containers/FinancialStatementCategoriesContainer')
)
const RegisterOperationsContainer = lazy(() => import('src/containers/RegisterOperationsContainer'))

const AppRouter = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: light)')

  return (
    <MuiThemeProvider theme={theme(prefersDarkMode)}>
      <CssBaseline />
      <Router>
        <Switch>
          <Public exact path={Paths.home.path} component={EmailSigninContainer} />
          <Public exact path={Paths.googleSignin.path} component={SigninContainer} />
          <Public exact path={Paths.emailSignin.path} component={EmailSigninContainer} />
          <Public exact path={Paths.pin.path} component={PinContainer} />
          <Private noNavigation path={Paths.myCompanies.path} component={MyCompaniesContainer} />
          <Private path={Paths.profile.path} component={ProfileContainer} />
          <Private path={Paths.support.path} component={SupportContainer} />
          <Private path={Paths.shopfront.path} component={ShopfrontContainer} />
          <Private path={Paths.reports.path} component={ReportsContainer} />
          <Private path={Paths.financialStatements.path} component={FinancialStatementsContainer} />
          <Private path={Paths.paymentMethods.path} component={PaymentMethodsContainer} />
          <Private path={Paths.registerOperations.path} component={RegisterOperationsContainer} />
          <Private
            path={Paths.financialStatementCategories.path}
            component={FinancialStatementCategoriesContainer}
          />
          <Private path={Paths.billing.path} component={BillingContainer} />
          <Private path={Paths.sales.path} component={SalesContainer} />
          <Private path={Paths.waitForEmployer.path} component={NoEmployerContainer} />
          <Private exact path={Paths.products.path} component={ProductsContainer} />
          <Private path={Paths.product.path} component={ProductContainer} />
          <Private exact path={Paths.orders.path} component={OrdersHistoryContainer} />
          <Private path={Paths.customers.path} component={CustomersContainer} />
          <Private path={Paths.ifoodSetup.path} component={IfoodSetupContainer} />
          <Private path={Paths.ifood.path} component={IfoodContainer} />
          <Private path={Paths.loggiSetup.path} component={LoggiSetupContainer} />
          <Private path={Paths.loggi.path} component={LoggiContainer} />
          <Private exact path={Paths.purchases.path} component={PurchasesContainer} />
          <Private path={Paths.purchase.path} component={PurchaseContainer} />
          <Private path={Paths.suppliers.path} component={SuppliersContainer} />
          <Private path={Paths.nfe.path} component={NFeContainer} />
          <Private path={Paths.settings.path} component={SettingsContainer} />
          <External path={Paths.memberInvite.path} component={MemberInviteContainer} />
          <External path={Paths.externalSignin.path} component={ExternalSigninContainer} />
          <External
            path={Paths.vitrines.path}
            component={ShopfrontPublicContainer}
            snackbar={false}
          />
          <External path={Paths.orderPreview.path} component={OrderPreviewContainer} />
          <NotFoundView default />
        </Switch>
      </Router>
      <NewUpdatesDialog />
    </MuiThemeProvider>
  )
}

export default AppRouter
