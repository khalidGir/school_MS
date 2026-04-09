import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpenIcon, UserGroupIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import libraryService from '../../services/library.service'
import StatCard from '../../components/common/StatCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'

function LibraryDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await libraryService.getDashboardStats()
      if (response.success) setStats(response.data)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner text="Loading library dashboard..." />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Library Dashboard</h2>
        <Link to="/library/books" className="btn-primary">Manage Books</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Books"
          value={stats?.totalBooks || 0}
          icon={BookOpenIcon}
          bgColor="bg-primary/10"
          color="text-primary"
        />
        <StatCard
          label="Available Books"
          value={stats?.availableBooks || 0}
          icon={BookOpenIcon}
          bgColor="bg-[#e8f5e9]"
          color="text-[#2c7a4d]"
        />
        <StatCard
          label="Total Members"
          value={stats?.totalMembers || 0}
          icon={UserGroupIcon}
          bgColor="bg-[#e6f0fa]"
          color="text-primary"
        />
        <StatCard
          label="Issued Books"
          value={stats?.issuedBooks || 0}
          icon={ClockIcon}
          bgColor="bg-[#fef4e6]"
          color="text-[#b45309]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Library Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Total Books</span>
              <span className="text-lg font-semibold text-gray-900">{stats?.totalBooks}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Books Issued</span>
              <span className="text-lg font-semibold text-[#b45309]">{stats?.issuedBooks}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Today's Returns</span>
              <span className="text-lg font-semibold text-[#2c7a4d]">{stats?.todayReturns}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Alerts</h3>
            {stats?.overdueBooks > 0 && (
              <span className="px-2 py-1 bg-[#fee2e2] text-[#c73e2c] text-xs font-medium rounded-full">
                {stats.overdueBooks} Overdue
              </span>
            )}
          </div>
          <div className="space-y-3">
            {stats?.overdueBooks > 0 ? (
              <div className="flex items-start gap-3 p-3 bg-[#fee2e2] rounded-lg">
                <ExclamationTriangleIcon className="w-5 h-5 text-[#c73e2c] flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-[#c73e2c]">Overdue Books</p>
                  <p className="text-sm text-gray-600">{stats.overdueBooks} books are overdue for return</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No alerts at this time</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/library/books" className="card hover:shadow-md transition-shadow">
          <BookOpenIcon className="w-8 h-8 text-primary mb-2" />
          <h4 className="font-medium text-gray-900">Book Catalog</h4>
          <p className="text-sm text-gray-500">View and manage books</p>
        </Link>
        <Link to="/library/issue-return" className="card hover:shadow-md transition-shadow">
          <ClockIcon className="w-8 h-8 text-primary mb-2" />
          <h4 className="font-medium text-gray-900">Issue / Return</h4>
          <p className="text-sm text-gray-500">Issue and return books</p>
        </Link>
        <Link to="/library/members" className="card hover:shadow-md transition-shadow">
          <UserGroupIcon className="w-8 h-8 text-primary mb-2" />
          <h4 className="font-medium text-gray-900">Members</h4>
          <p className="text-sm text-gray-500">Manage library members</p>
        </Link>
      </div>
    </div>
  )
}

export default LibraryDashboard
