import { useState, useEffect } from 'react'
import { DocumentArrowDownIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { useToast } from '../../components/Toast'
import attendanceService from '../../services/attendance.service'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import DataTable from '../../components/DataTable'

const AttendanceReport = () => {
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [reportData, setReportData] = useState(null)
  const [format, setFormat] = useState('summary')
  const [filters, setFilters] = useState({
    class: 'all',
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    fetchReport()
  }, [format, filters.class])

  const fetchReport = async () => {
    setLoading(true)
    try {
      const response = await attendanceService.getReport({
        format,
        class: filters.class !== 'all' ? filters.class : undefined,
        startDate: filters.startDate,
        endDate: filters.endDate
      })
      if (response.success) {
        setReportData(response.data)
      }
    } catch (error) {
      toast.error('Failed to load report')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const response = await attendanceService.exportReport(filters)
      if (response.success) {
        const blob = new Blob([response.data.csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = response.data.filename
        a.click()
        URL.revokeObjectURL(url)
        toast.success('Report exported successfully')
      }
    } catch (error) {
      toast.error('Failed to export report')
    }
  }

  const columns = format === 'summary' ? [
    { key: 'class', label: 'Class', sortable: true },
    { key: 'present', label: 'Present', sortable: true },
    { key: 'absent', label: 'Absent', sortable: true },
    { key: 'late', label: 'Late', sortable: true },
    { key: 'total', label: 'Total', sortable: true },
    { 
      key: 'percentage', 
      label: 'Attendance %', 
      sortable: true,
      render: (val) => (
        <Badge variant={val >= 90 ? 'success' : val >= 75 ? 'warning' : 'danger'}>
          {val}%
        </Badge>
      )
    }
  ] : [
    { key: 'rollNumber', label: 'Roll No', sortable: true },
    { key: 'name', label: 'Student Name', sortable: true },
    { key: 'totalDays', label: 'Total Days' },
    { key: 'present', label: 'Present', sortable: true },
    { key: 'absent', label: 'Absent', sortable: true },
    { key: 'late', label: 'Late', sortable: true },
    { 
      key: 'percentage', 
      label: 'Attendance %', 
      sortable: true,
      render: (val) => (
        <Badge variant={val >= 90 ? 'success' : val >= 75 ? 'warning' : 'danger'}>
          {val}%
        </Badge>
      )
    }
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Attendance Reports</h1>
          <p className="text-sm text-gray-500 mt-0.5">View and export attendance data</p>
        </div>
        <Button variant="secondary" onClick={handleExport}>
          <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setFormat('summary')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              format === 'summary' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Summary
          </button>
          <button
            onClick={() => setFormat('detailed')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              format === 'detailed' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Detailed
          </button>
        </div>

        <select
          value={filters.class}
          onChange={(e) => setFilters(prev => ({ ...prev, class: e.target.value }))}
          className="input-field w-auto"
        >
          <option value="all">All Classes</option>
          {attendanceService.getClasses().map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-gray-400" />
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
            className="input-field w-40"
            placeholder="Start Date"
          />
          <span className="text-gray-400">to</span>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
            className="input-field w-40"
            placeholder="End Date"
          />
        </div>
      </div>

      {loading ? (
        <Card>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton h-12 w-full rounded" />
            ))}
          </div>
        </Card>
      ) : reportData ? (
        <>
          {format === 'summary' && reportData.summary && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Card>
                <p className="text-sm text-gray-500">Total Students</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{reportData.summary.totalStudents}</p>
              </Card>
              <Card>
                <p className="text-sm text-gray-500">Average Attendance</p>
                <p className="text-2xl font-semibold text-[#2c7a4d] mt-1">{reportData.summary.averageAttendance}%</p>
              </Card>
              <Card>
                <p className="text-sm text-gray-500">Highest Attendance</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{reportData.summary.highestClass}</p>
              </Card>
            </div>
          )}

          <DataTable
            columns={columns}
            data={format === 'summary' ? reportData.byClass : reportData.students}
            loading={false}
            pagination={format === 'detailed'}
            pageSize={15}
            emptyMessage="No attendance data found"
          />
        </>
      ) : null}
    </div>
  )
}

export default AttendanceReport
