import { useState, useEffect, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ArrowDownTrayIcon, InboxIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { useApp } from '../context/AppContext'
import { formatCurrency, formatNumber, sortByStatus } from '../utils/formatters'

function ChartSkeleton() {
  return (
    <div className="h-[400px] flex items-center justify-center">
      <div className="space-y-4 w-full px-8">
        <div className="skeleton h-4 w-32 mx-auto"></div>
        <div className="flex justify-between items-end h-64 gap-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="skeleton w-full" style={{ height: `${Math.random() * 60 + 40}%` }}></div>
              <div className="skeleton h-3 w-8"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SummaryCardSkeleton() {
  return (
    <div className="bg-white rounded-lg p-5 card-shadow border border-gray-200/50">
      <div className="skeleton h-4 w-24 mb-2"></div>
      <div className="skeleton h-8 w-16"></div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200/50 p-16">
      <div className="flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <InboxIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No payment data available</h3>
        <p className="text-sm text-gray-500">Payment data will appear here once students are added</p>
      </div>
    </div>
  )
}

const downloadCSV = (content, filename) => {
  const blob = new Blob([content], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function Reports() {
  const { api, students } = useApp()
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState([])
  const [summary, setSummary] = useState(null)
  const [gradeFilter, setGradeFilter] = useState('all')

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true)
      try {
        const response = await api.reports.getSummary(gradeFilter !== 'all' ? gradeFilter : null)
        if (response.success) {
          // Transform byGrade to chart data
          const chart = Object.entries(response.data.byGrade).map(([grade, data]) => ({
            grade,
            paid: data.paid,
            partial: data.partial,
            unpaid: data.unpaid,
          }))
          setChartData(chart)
          setSummary(response.data.summary)
        }
      } catch (error) {
        console.error('Failed to fetch report:', error)
      }
      setLoading(false)
    }

    fetchReportData()
  }, [students, gradeFilter, api])

  const handleExportUnpaidList = async () => {
    try {
      const response = await api.reports.exportUnpaid()
      if (response.success) {
        downloadCSV(response.data.csv, response.data.filename)
      }
    } catch (error) {
      console.error('Failed to export unpaid list:', error)
    }
  }

  const handleExportSummary = async () => {
    try {
      const response = await api.reports.exportSummary()
      if (response.success) {
        downloadCSV(response.data.csv, response.data.filename)
      }
    } catch (error) {
      console.error('Failed to export summary:', error)
    }
  }

  const isEmpty = !loading && chartData.length === 0

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Payment Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of payment status by grade level</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-4 h-4 text-gray-400" />
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="all">All Grades</option>
              {chartData.map(d => (
                <option key={d.grade} value={d.grade}>{d.grade}</option>
              ))}
            </select>
          </div>
          <div className="hidden md:flex gap-3">
            <button
              onClick={handleExportUnpaidList}
              className="btn-secondary"
            >
              <ArrowDownTrayIcon className="w-4 h-4 mr-2 inline" />
              Export Unpaid List
            </button>
            <button
              onClick={handleExportSummary}
              className="btn-secondary"
            >
              <ArrowDownTrayIcon className="w-4 h-4 mr-2 inline" />
              Export Summary
            </button>
          </div>
        </div>
      </div>

      {isEmpty ? (
        <EmptyState />
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200/50 p-6">
            <h3 className="text-base font-medium text-gray-900 mb-6">Payment Status by Grade</h3>
            {loading ? (
              <ChartSkeleton />
            ) : (
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="grade" tick={{ fontSize: 12 }} stroke="#6b7280" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '12px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="paid" name="Paid" fill="#2c7a4d" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="partial" name="Partial" fill="#e6b422" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="unpaid" name="Unpaid" fill="#c73e2c" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {loading ? (
              <>
                <SummaryCardSkeleton />
                <SummaryCardSkeleton />
                <SummaryCardSkeleton />
              </>
            ) : (
              <>
                <div className="card">
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Students</p>
                  <p className="text-[28px] font-semibold leading-9 text-gray-900">{summary?.total || 0}</p>
                </div>
                <div className="card">
                  <p className="text-sm font-medium text-gray-500 mb-1">Paid</p>
                  <p className="text-[28px] font-semibold leading-9 text-[#2c7a4d]">{summary?.paid || 0}</p>
                </div>
                <div className="card">
                  <p className="text-sm font-medium text-gray-500 mb-1">Unpaid</p>
                  <p className="text-[28px] font-semibold leading-9 text-[#c73e2c]">{summary?.unpaid || 0}</p>
                </div>
              </>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-base font-medium text-gray-900">Detailed Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f9fafb] border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Grade</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Paid</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Partial</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Unpaid</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Total</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Unpaid %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center">
                        <div className="skeleton h-4 w-32 mx-auto"></div>
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((row) => {
                      const rowTotal = row.paid + row.partial + row.unpaid
                      const unpaidPercent = ((row.unpaid / rowTotal) * 100).toFixed(1)
                      return (
                        <tr key={row.grade} className="hover:bg-[#f9fafb]">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.grade}</td>
                          <td className="px-4 py-3 text-sm text-right text-[#2c7a4d]">{row.paid}</td>
                          <td className="px-4 py-3 text-sm text-right text-[#b45309]">{row.partial}</td>
                          <td className="px-4 py-3 text-sm text-right text-[#c73e2c]">{row.unpaid}</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-900">{rowTotal}</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-500">{unpaidPercent}%</td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
                {!loading && (
                  <tfoot className="bg-gray-50 border-t border-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">Total</td>
                      <td className="px-4 py-3 text-sm font-medium text-right text-[#2c7a4d]">{totals.paid}</td>
                      <td className="px-4 py-3 text-sm font-medium text-right text-[#b45309]">{totals.partial}</td>
                      <td className="px-4 py-3 text-sm font-medium text-right text-[#c73e2c]">{totals.unpaid}</td>
                      <td className="px-4 py-3 text-sm font-medium text-right text-gray-900">{totals.total}</td>
                      <td className="px-4 py-3 text-sm font-medium text-right text-gray-500">
                        {((totals.unpaid / totals.total) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>

          <div className="flex md:hidden gap-3">
            <button
              onClick={handleExportUnpaidList}
              className="flex-1 btn-secondary"
            >
              <ArrowDownTrayIcon className="w-4 h-4 mr-2 inline" />
              Export Unpaid
            </button>
            <button
              onClick={handleExportSummary}
              className="flex-1 btn-secondary"
            >
              <ArrowDownTrayIcon className="w-4 h-4 mr-2 inline" />
              Export Summary
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Reports
