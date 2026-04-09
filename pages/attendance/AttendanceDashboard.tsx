import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  UserGroupIcon, CheckCircleIcon, ClockIcon, ExclamationTriangleIcon,
  CalendarIcon, ArrowTrendingUpIcon, DocumentChartBarIcon
} from '@heroicons/react/24/outline'
import { useToast } from '../../components/Toast'
import attendanceService from '../../services/attendance.service'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import AttendanceChart from './AttendanceChart'

const AttendanceDashboard = () => {
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const response = await attendanceService.getDashboard()
      if (response.success) {
        setData(response.data)
      }
    } catch (error) {
      toast.error('Failed to load attendance data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <div className="skeleton h-20 w-full" />
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const { today, weekly, byClass } = data || { today: {}, weekly: [], byClass: {} }
  const attendanceRate = today.total > 0 ? Math.round((today.present / today.total) * 100) : 0

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Attendance Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/attendance/mark" className="btn-primary">
            Mark Attendance
          </Link>
          <Link to="/attendance/reports" className="btn-secondary">
            View Reports
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Students</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{today.total}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <UserGroupIcon className="w-5 h-5 text-primary" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Present</p>
              <p className="text-2xl font-semibold text-[#2c7a4d] mt-1">{today.present}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#e8f5e9] flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-[#2c7a4d]" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Late</p>
              <p className="text-2xl font-semibold text-[#b45309] mt-1">{today.late}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#fef4e6] flex items-center justify-center">
              <ClockIcon className="w-5 h-5 text-[#b45309]" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Absent</p>
              <p className="text-2xl font-semibold text-[#c73e2c] mt-1">{today.absent}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#fee2e2] flex items-center justify-center">
              <ExclamationTriangleIcon className="w-5 h-5 text-[#c73e2c]" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Attendance Rate</h3>
            <Badge variant={attendanceRate >= 90 ? 'success' : attendanceRate >= 75 ? 'warning' : 'danger'}>
              {attendanceRate}%
            </Badge>
          </div>
          <div className="flex items-center justify-center py-8">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  strokeWidth="16"
                  fill="none"
                  className="stroke-gray-200"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  strokeWidth="16"
                  fill="none"
                  strokeLinecap="round"
                  className={attendanceRate >= 90 ? 'stroke-[#2c7a4d]' : attendanceRate >= 75 ? 'stroke-[#b45309]' : 'stroke-[#c73e2c]'}
                  strokeDasharray={`${(attendanceRate / 100) * 502.65} 502.65`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-gray-900">{attendanceRate}%</span>
                <span className="text-sm text-gray-500">Attendance</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="font-medium text-gray-900 mb-4">Weekly Trend</h3>
          <AttendanceChart data={weekly} />
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-900">Class-wise Attendance</h3>
          <Link to="/attendance/reports" className="text-sm text-primary hover:text-primary-light">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-xs font-medium text-gray-500">Class</th>
                <th className="text-center py-3 text-xs font-medium text-gray-500">Present</th>
                <th className="text-center py-3 text-xs font-medium text-gray-500">Absent</th>
                <th className="text-center py-3 text-xs font-medium text-gray-500">Late</th>
                <th className="text-right py-3 text-xs font-medium text-gray-500">Rate</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(byClass).slice(0, 8).map(([key, stats]) => {
                const rate = Math.round((stats.present / stats.total) * 100)
                return (
                  <tr key={key} className="border-b border-gray-100">
                    <td className="py-3 text-sm font-medium text-gray-900">{key}</td>
                    <td className="py-3 text-sm text-center text-[#2c7a4d]">{stats.present}</td>
                    <td className="py-3 text-sm text-center text-[#c73e2c]">{stats.absent}</td>
                    <td className="py-3 text-sm text-center text-[#b45309]">{stats.late}</td>
                    <td className="py-3 text-right">
                      <Badge variant={rate >= 90 ? 'success' : rate >= 75 ? 'warning' : 'danger'}>
                        {rate}%
                      </Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default AttendanceDashboard
