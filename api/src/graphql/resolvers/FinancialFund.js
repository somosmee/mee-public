import moment from 'moment'

import { FinancialStatement } from 'src/models'

export default {
  hasOpenedRegister: async (parent, args, { company }, info) => {
    const startDate = moment()
      .startOf('day')
      .toISOString()
    const endDate = moment()
      .endOf('day')
      .toISOString()

    const fund = await FinancialStatement.findOne({
      company: company._id,
      financialFund: parent._id,
      createdAt: { $gte: startDate, $lte: endDate }
    })

    return !!fund
  }
}
