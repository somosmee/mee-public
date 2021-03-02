import * as Sentry from '@sentry/node'

import Environments from 'src/utils/environments'

Sentry.init({
  release: `api@${process.env.npm_package_version}`,
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  beforeSend: (event) =>
    process.env.NODE_ENV === Environments.PRODUCTION ||
    process.env.NODE_ENV === Environments.STAGING
      ? event
      : null,
  debug: process.env.NODE_ENV === Environments.DEVELOPMENT
})
