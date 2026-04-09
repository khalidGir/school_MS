import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CurrencyDollarIcon, ClockIcon, UserGroupIcon, ChartBarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline'
import { formatCurrency } from '../../utils/formatters'
import feeService from '../../services/fee.service'
import StatCard from '../../components/common/StatCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'

function FeeDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await feeService.getDashboardStats()
      if (response.success) setStats(response.data)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner text="Loading fee dashboard..." />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Fee Management Dashboard</h2>
        <Link to="/fees/collect" className="btn-primary">
          Collect Fee
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Collected"
          value={formatCurrency(stats?.totalCollected || 0)}
          icon={CurrencyDollarIcon}
          bgColor="bg-[#e8f5e9]"
          color="text-[#2c7a4d]"
          trend="+12%"
          trendLabel="vs last month"
        />
        <StatCard
          label="Pending Amount"
          value={formatCurrency(stats?.pendingAmount || 0)}
          icon={ClockIcon}
          bgColor="bg-[#fef4e6]"
          color="text-[#b45309]"
        />
        <StatCard
          label="Defaulters"
          value={stats?.defaulters || 0}
          icon={UserGroupIcon}
          bgColor="bg-[#fee2e2]"
          color="text-[#c73e2c]"
        />
        <StatCard
          label="Concessions"
          value={formatCurrency(stats?.concessionAmount || 0)}
          icon={PercentIcon}
          bgColor="bg-[#e6f0fa]"
          color="text-primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/fees/collect" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <CurrencyDollarIcon className="w-8 h-8 text-primary mb-2" />
              <p className="font-medium text-gray-900">Collect Fee</p>
              <p className="text-sm text-gray-500">Record payment</p>
            </Link>
            <Link to="/fees/structure" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <ArrowTrendingUpIcon className="w-8 h-8 text-primary mb-2" />
              <p className="font-medium text-gray-900">Fee Structure</p>
              <p className="text-sm text-gray-500">Manage fees</p>
            </Link>
            <Link to="/fees/concessions" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <PercentIcon className="w-8 h-8 text-primary mb-2" />
              <p className="font-medium text-gray-900">Concessions</p>
              <p className="text-sm text-gray-500">Manage discounts</p>
            </Link>
            <Link to="/fees/reports" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <UserGroupIcon className="w-8 h-8 text-primary mb-2" />
              <p className="font-medium text-gray-900">Reports</p>
              <p className="text-sm text-gray-500">View analytics</p>
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Today's Summary</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-[#e8f5e9] rounded-lg">
              <span className="text-sm text-gray-600">Collection Today</span>
              <span className="text-lg font-semibold text-[#2c7a4d]">
                {formatCurrency(stats?.todayCollection || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#fef4e6] rounded-lg">
              <span className="text-sm text-gray-600">Monthly Trend</span>
              <span className="text-lg font-semibold text-[#b45309]">
                {stats?.monthlyTrend || '0%'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeeDashboard
