import * as Sentry from '@sentry/browser'

import { Environments } from 'src/utils/enums'

Sentry.init({
  release: `client@${process.env.npm_package_version}`,
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.REACT_APP_MEE_ENV,
  beforeSend: (event) => (process.env.NODE_ENV === Environments.PRODUCTION ? event : null),
  debug: process.env.NODE_ENV === Environments.DEVELOPMENT
})

export { Sentry as default }
