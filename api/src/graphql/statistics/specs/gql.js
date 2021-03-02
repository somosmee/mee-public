export const RETENTION_REPORT = `
  query reports ($input: ReportInput){
    reports(input: $input) {
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
          mobile
        }
        churnedCustomers {
          _id
          mobile
        }
      }
    }
  }
`

export const SALES_STATS_REPORT = `
query reports ($input: ReportInput){
  reports(input: $input) {
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
    }
  }
}
`

export const REPORTS = `
query reports($input: ReportInput) {
  reports(input: $input) {
    hasSales
    startDate
    endDate
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
    }
  }
}
`
