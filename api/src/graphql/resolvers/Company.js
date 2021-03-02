import { User, FinancialFund } from 'src/models'

const Company = {
  createdBy(parent) {
    return User.findById(parent.createdBy)
  },
  financialFunds: async (parent, args, { company }, info) => {
    let funds = []
    if (company) {
      funds = FinancialFund.find({ company: company._id })
    }

    return funds
  }
}

export { Company as default }
