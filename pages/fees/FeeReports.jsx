import { useState, useEffect } from 'react'
import { DocumentArrowDownIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { formatCurrency } from '../../utils/formatters'
import feeService from '../../services/fee.service'
import DatePicker from '../../components/common/DatePicker'
import LoadingSpinner from '../../components/common/LoadingSpinner'

function FeeReports() {
  const [defaulters, setDefaulters] = useState([])
  const [collectionReport, setCollectionReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  })
  const [gradeFilter, setGradeFilter] = useState('all')

  useEffect(() => {
    loadData()
  }, [dateRange])

  const loadData = async () => {
    try {
      const [defaultersRes, collectionRes] = await Promise.all([
        feeService.getDefaulters(),
        feeService.getCollectionReport(dateRange.startDate, dateRange.endDate),
      ])
      if (defaultersRes.success) setDefaulters(defaultersRes.data)
      if (collectionRes.success) setCollectionReport(collectionRes.data)
    } finally {
      setLoading(false)
    }
  }

  const exportReport = (type) => {
    const csvContent = type === 'defaulters'
      ? [
          ['Student', 'Grade', 'Amount Due', 'Days Overdue'].join(','),
          ...defaulters.map(d => [d.studentName, d.grade, d.amountDue, d.daysOverdue].join(','))
        ].join('\n')
      : [
          ['Date', 'Student', 'Amount', 'Method'].join(','),
          ...(collectionReport?.collections || []).map(c => [c.date, c.studentName, c.amount, c.method].join(','))
        ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${type}-report.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <LoadingSpinner text="Loading reports..." />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Fee Reports</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Collection Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Total Collected</span>
              <span className="text-lg font-semibold text-[#2c7a4d]">
                {formatCurrency(collectionReport?.total || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Transactions</span>
              <span className="text-lg font-semibold text-gray-900">
                {collectionReport?.collections?.length || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Date Range</h3>
          <div className="grid grid-cols-2 gap-4">
            <DatePicker
              value={dateRange.startDate}
              onChange={(val) => setDateRange({ ...dateRange, startDate: val })}
              placeholder="Start date"
            />
            <DatePicker
              value={dateRange.endDate}
              onChange={(val) => setDateRange({ ...dateRange, endDate: val })}
              placeholder="End date"
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Defaulter List</h3>
          <button onClick={() => exportReport('defaulters')} className="btn-secondary flex items-center gap-2">
            <DocumentArrowDownIcon className="w-4 h-4" /> Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Student</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Grade</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">Amount Due</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">Days Overdue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {defaulters.map(defaulter => (
                <tr key={defaulter.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900 font-medium">{defaulter.studentName}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{defaulter.grade}</td>
                  <td className="py-3 px-4 text-sm text-[#c73e2c] font-medium text-right">
                    {formatCurrency(defaulter.amountDue)}
                  </td>
                  <td className="py-3 px-4 text-sm text-[#c73e2c] font-medium text-right">{defaulter.daysOverdue} days</td>
                </tr>
              ))}
              {defaulters.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-sm text-gray-500">No defaulters found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Collections</h3>
          <button onClick={() => exportReport('collections')} className="btn-secondary flex items-center gap-2">
            <DocumentArrowDownIcon className="w-4 h-4" /> Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Date</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Student</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">Amount</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {collectionReport?.collections?.map((collection, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-500">{collection.date}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 font-medium">{collection.studentName}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 font-medium text-right">
                    {formatCurrency(collection.amount)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">{collection.method}</td>
                </tr>
              ))}
              {(!collectionReport?.collections || collectionReport.collections.length === 0) && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-sm text-gray-500">No collections found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default FeeReports
