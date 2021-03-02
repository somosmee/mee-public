/**

CRON JOBS

# ┌────────────── second (optional)
# │ ┌──────────── minute
# │ │ ┌────────── hour
# │ │ │ ┌──────── day of month
# │ │ │ │ ┌────── month
# │ │ │ │ │ ┌──── day of week
# │ │ │ │ │ │
# │ │ │ │ │ │
# * * * * * *

   Allowed values
-------------------
field         value
second        0-59
minute        0-59
hour          0-23
day of month  1-31
month         1-12 (or names)
day of week   0-7 (or names, 0 or 7 are sunday)

 */

import cron from 'node-cron'

import {
  syncEvents,
  resyncOrders,
  getIfoodTokens,
  sendReports,
  sendEmails,
  reclassifyUsers,
  createAssociationRules,
  verifyNotConfirmedIfoodOrders,
  adjustBalanceWithPendingStatements
} from 'src/cronjobs/jobs'

import { Company } from 'src/models'

const TIME_ZONE = 'Etc/UTC'
const options = { timezone: TIME_ZONE }

console.log('------ CRON JOBS ------')

/* REFRESH TOKEN */
cron.schedule(
  '0 */59 * * * *',
  async () => {
    console.log(`Running [getToken] every 59m at ${TIME_ZONE} timezone`)
    await getIfoodTokens()
  },
  options
)

/* KEEP MERCHANT OPEN AND GET NEW EVENTS */
cron.schedule(
  '*/20 * * * * *',
  async () => {
    console.log(`Running [syncEvents] every 30s at ${TIME_ZONE} timezone`)
    await syncEvents()
  },
  options
)

/* RESYNC ORDERS */
cron.schedule(
  '*/40 * * * * *',
  async () => {
    console.log(`Running [resyncOrders] every 40s at ${TIME_ZONE} timezone`)
    const openCompanies = await Company.find({ 'ifood.open': true })

    for (const company of openCompanies) {
      await resyncOrders(company)
    }
  },
  options
)

/* STRIPE PAYMENTS */
// cron.schedule(
//   '0 0 15 * *',
//   async () => {
//     console.log(`Running [buildBillingInvoices] every day 15 at ${TIME_ZONE} timezone`)
//     buildPaymentIntents()
//   },
//   options
// )

/* ACTIVE USERS REPORT */
cron.schedule(
  '0 0 6 * * *',
  async () => {
    console.log(`Running [sendReports] every day 3 am at ${TIME_ZONE} timezone`)
    sendReports()
  },
  options
)

/* RECLASSIFY USERS */
cron.schedule(
  '0 0 5 * * *',
  async () => {
    console.log(`Running [reclassifyUsers] every day 2 am at ${TIME_ZONE} timezone`)
    reclassifyUsers()
  },
  options
)

/* EMAILS */
cron.schedule(
  '0 0 11 * * *',
  async () => {
    console.log(`Running [sendEmails] every day 8 am at ${TIME_ZONE} timezone`)
    sendEmails()
  },
  options
)

/* VERIFY NOT CONFIRMED ORDERS */
cron.schedule(
  '* * * * *',
  async () => {
    console.log(`Running [verifyNotConfirmedIfoodOrders] every minute at ${TIME_ZONE} timezone`)

    verifyNotConfirmedIfoodOrders()
  },
  options
)

/* ADJUST BALANCE WITH PENDING STATEMENTS */
cron.schedule(
  '0 0 4 * * *',
  async () => {
    console.log(
      `Running [adjustBalanceWithPendingStatements] every day 1 am at ${TIME_ZONE} timezone`
    )
    adjustBalanceWithPendingStatements()
  },
  options
)

/* CREATE ASSOCIATION RULES */
cron.schedule(
  '0 0 5 * * *',
  async () => {
    console.log(`Running [createAssociationRules] every day 2 am at ${TIME_ZONE} timezone`)
    createAssociationRules()
  },
  options
)
