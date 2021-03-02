import { useCallback } from 'react'

import { useLazyQuery } from '@apollo/react-hooks'

import { REPORTS, SALES_STATS } from 'src/graphql/reports/queries'

const useFinancialFund = () => {
  const [getReportsQuery, getReportsResult] = useLazyQuery(REPORTS, {
    fetchPolicy: 'network-only'
  })

  const [getSalesStatsQuery, getSalesStatsResult] = useLazyQuery(SALES_STATS, {
    fetchPolicy: 'network-only'
  })

  const getReports = useCallback((input) => {
    getReportsQuery({ variables: { input } })
  }, [])

  const getSalesStats = useCallback((input) => {
    getSalesStatsQuery({ variables: { input } })
  }, [])

  return {
    getReports: [getReports, getReportsResult],
    getSalesStats: [getSalesStats, getSalesStatsResult]
  }
}

export default useFinancialFund
