import { Customer } from 'src/models'

import { retentionStats, salesStats, salesReport, cashFlowReport } from 'src/utils/statistics.js'

export default {
  salesReport: async (
    { startDate, endDate, groupBy, groupByLabel },
    args,
    { company, utcOffset },
    info
  ) => {
    const data = await salesReport(company, startDate, endDate, groupBy, groupByLabel, utcOffset)

    return data
  },
  cashFlowReport: async (
    { startDate, endDate, groupBy, groupByLabel },
    args,
    { company, utcOffset },
    info
  ) => {
    const data = await cashFlowReport(company, startDate, endDate, groupBy, groupByLabel, utcOffset)
    return data
  },
  retentionReport: async ({ startDate, endDate }, args, { company }, info) => {
    const data = await retentionStats(company, startDate, endDate, true)

    data.loyalCustomers = await Customer.find({ _id: { $in: data.loyalCustomers } })
    data.churnedCustomers = await Customer.find({ _id: { $in: data.churnedCustomers } })

    return data
  },
  salesStatisticsReport: async (
    { startDate, endDate, groupBy },
    { input },
    { company, utcOffset },
    info
  ) => {
    const { data } = await salesStats(company, startDate, endDate, groupBy, utcOffset, true)

    return data
  }
}
