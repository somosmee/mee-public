import gql from 'graphql-tag'

export const REPORTS = gql`
  query reports($input: ReportInput) {
    reports(input: $input) {
      hasSales
      previousStartDate
      previousEndDate
      interval
      salesReport {
        title
        subtitle
        header
        data {
          label
          values
        }
      }
      cashFlowReport {
        title
        subtitle
        header
        data {
          label
          values
        }
      }
      retentionReport {
        previousCount
        currentCount
        previous {
          beginAt
          endAt
        }
        current {
          beginAt
          endAt
        }
        retentionRate
        churnRate
        percentageDiff
        loyalCustomers {
          _id
          name
          mobile
          email
        }
        churnedCustomers {
          _id
          name
          mobile
          email
        }
      }
      salesStatisticsReport {
        total
        totalRevenue
        subtotalRevenue
        averageTicket
        totalPercentageDiff
        totalRevenuePercentageDiff
        subtotalRevenuePercentageDiff
        averageTicketPercentageDiff
        topSellingProducts {
          product
          name
          total
          revenue
          subtotalRevenuePercentage
        }
        totalFees {
          name
          total
        }
      }
    }
  }
`

export const SALES_STATS = gql`
  query reports($input: ReportInput) {
    reports(input: $input) {
      hasSales
      previousStartDate
      previousEndDate
      interval
      salesStatisticsReport {
        total
        totalRevenue
        subtotalRevenue
        averageTicket
        totalPercentageDiff
        totalRevenuePercentageDiff
        subtotalRevenuePercentageDiff
        averageTicketPercentageDiff
        topSellingProducts {
          product
          name
          total
          revenue
          subtotalRevenuePercentage
        }
        totalFees {
          name
          total
        }
        paymentMethods {
          cash
          credit
          debt
          voucher
          pix
        }
      }
    }
  }
`
