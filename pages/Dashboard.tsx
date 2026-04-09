import { useState, useMemo } from 'react'
import {
  UsersIcon, CheckCircleIcon, ClockIcon, ExclamationTriangleIcon,
  ArrowUpTrayIcon, XMarkIcon, EnvelopeIcon, CurrencyDollarIcon,
  EyeIcon, InboxIcon, MagnifyingGlassIcon, FunnelIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, MinusIcon
} from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '../components/Toast'
import { useApp } from '../context/AppContext'
import {
  formatCurrency,
  sortByStatus,
  filterBySearch,
  filterByStatus,
  filterByGrade,
  getUniqueGrades,
  debounce
} from '../utils/formatters'

const metricsConfig = [
  { label: 'Total Students', key: 'total', icon: UsersIcon, bgColor: 'bg-primary/10', color: 'text-primary' },
  { label: 'Paid', key: 'paid', icon: CheckCircleIcon, bgColor: 'bg-[#e8f5e9]', color: 'text-[#2c7a4d]' },
  { label: 'Partial', key: 'partial', icon: ClockIcon, bgColor: 'bg-[#fef4e6]', color: 'text-[#b45309]' },
  { label: 'Unpaid', key: 'unpaid', icon: ExclamationTriangleIcon, bgColor: 'bg-[#fee2e2]', color: 'text-[#c73e2c]' },
]

const StatusBadge = ({ status }) => {
  const config = {
    Paid: { class: 'badge-paid', Icon: CheckCircleIcon },
    Partial: { class: 'badge-partial', Icon: ClockIcon },
    Unpaid: { class: 'badge-unpaid', Icon: ExclamationTriangleIcon },
  }
  const { class: badgeClass, Icon } = config[status] || config.Unpaid
  return (
    <span className={badgeClass}>
      <Icon className="w-3.5 h-3.5" />
      {status}
    </span>
  )
}

const TrendIndicator = ({ value }) => {
  if (!value) return <MinusIcon className="w-4 h-4 text-gray-400" />
  const isPositive = value.startsWith('+')
  const Icon = isPositive ? ArrowTrendingUpIcon : ArrowTrendingDownIcon
  const colorClass = isPositive ? 'text-[#2c7a4d]' : 'text-[#c73e2c]'
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${colorClass}`}>
      <Icon className="w-4 h-4" />
      {value}
    </span>
  )
}

const MetricCard = ({ label, value, icon: Icon, bgColor, color, trend }) => (
  <div className="card">
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <div className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center`}>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
    </div>
    <div className="flex items-end justify-between">
      <p className="text-[28px] font-semibold leading-9 text-gray-900">{value}</p>
      <TrendIndicator value={trend} />
    </div>
  </div>
)

const MetricCardSkeleton = () => (
  <div className="card">
    <div className="flex items-center justify-between mb-3">
      <div className="skeleton h-4 w-24"></div>
      <div className="skeleton w-8 h-8 rounded-full"></div>
    </div>
    <div className="skeleton h-8 w-16"></div>
  </div>
)

const TableRowSkeleton = () => (
  <tr className="border-b border-gray-200">
    <td className="px-4 py-3"><div className="skeleton h-4 w-28"></div></td>
    <td className="px-4 py-3"><div className="skeleton h-4 w-16"></div></td>
    <td className="px-4 py-3"><div className="skeleton h-4 w-32"></div></td>
    <td className="px-4 py-3"><div className="skeleton h-6 w-16 rounded-full"></div></td>
    <td className="px-4 py-3 text-right"><div className="skeleton h-4 w-16 ml-auto"></div></td>
    <td className="px-4 py-3 text-right"><div className="skeleton h-4 w-16 ml-auto"></div></td>
    <td className="px-4 py-3 text-center"><div className="skeleton h-8 w-8 mx-auto rounded"></div></td>
  </tr>
)

const EmptyState = ({ onUpload }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200/50 overflow-hidden">
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <InboxIcon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
      <p className="text-sm text-gray-500 mb-6 text-center">Upload a CSV file to get started<br />or adjust your search filters</p>
      <button
        onClick={onUpload}
        className="btn-primary"
      >
        <ArrowUpTrayIcon className="w-4 h-4 mr-2 inline" />
        Upload CSV
      </button>
    </div>
  </div>
)

const PaymentModal = ({ student, onClose, onConfirm }) => {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const paymentAmount = parseFloat(amount)
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }
    setLoading(true)
    await onConfirm(student.id, paymentAmount)
    setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6 slide-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Record Payment</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Student</p>
          <p className="font-medium text-gray-900">{student.name}</p>
          <p className="text-sm text-gray-500 mt-2">Current Balance</p>
          <p className="text-lg font-semibold text-[#c73e2c]">{formatCurrency(student.balance)}</p>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Payment Amount
          </label>
          <div className="relative mb-6">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              max={student.balance}
              className="input-field pl-7"
              autoFocus
            />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={loading || !amount} className="btn-primary flex-1">
              {loading ? 'Processing...' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const ReminderModal = ({ student, onClose, onSend }) => {
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const handleSend = async () => {
    setLoading(true)
    await onSend(student.id)
    setLoading(false)
    toast.success(`Reminder sent to ${student.parent}`)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6 slide-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Send Reminder</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Sending to</p>
          <p className="font-medium text-gray-900">{student.parent}</p>
          <p className="text-sm text-gray-500">{student.parentEmail}</p>
          <p className="text-sm text-gray-500 mt-3">Outstanding Balance</p>
          <p className="text-lg font-semibold text-[#c73e2c]">{formatCurrency(student.balance)}</p>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          A payment reminder email will be sent to the parent/guardian with payment instructions.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button onClick={handleSend} disabled={loading} className="btn-primary flex-1">
            {loading ? 'Sending...' : 'Send Reminder'}
          </button>
        </div>
      </div>
    </div>
  )
}

const StudentDetailPanel = ({ student, onClose }) => {
  if (!student) return null

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/30 z-40 lg:hidden"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 w-full max-w-[480px] bg-white shadow-xl z-50 flex flex-col slide-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Student Details</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
            aria-label="Close panel"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Student Name</h3>
              <p className="text-base font-medium text-gray-900">{student.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Grade</h3>
                <p className="text-base text-gray-900">{student.grade}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                <div className="mt-1"><StatusBadge status={student.status} /></div>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Payment Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Amount Paid</p>
                  <p className="text-2xl font-semibold text-gray-900">{formatCurrency(student.paid)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Balance Due</p>
                  <p className="text-2xl font-semibold text-[#c73e2c]">{formatCurrency(student.balance)}</p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Parent Contact</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-900">{student.parent}</p>
                <p className="text-sm text-gray-500">{student.parentEmail}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const Dashboard = () => {
  const { students, loading, fetchStudents, recordPayment, sendReminder, getMetrics } = useApp()
  const toast = useToast()
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [gradeFilter, setGradeFilter] = useState('all')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showActions, setShowActions] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(null)
  const [showReminderModal, setShowReminderModal] = useState(null)

  const metrics = useMemo(() => getMetrics(), [students, getMetrics])

  const filteredData = useMemo(() => {
    let result = students
    result = filterBySearch(result, searchTerm)
    result = filterByStatus(result, statusFilter)
    result = filterByGrade(result, gradeFilter)
    return sortByStatus(result)
  }, [students, searchTerm, statusFilter, gradeFilter])

  const uniqueGrades = useMemo(() => getUniqueGrades(students), [students])

  const handleSendReminder = async (studentId) => {
    try {
      const response = await sendReminder(studentId)
      if (response.success) {
        toast.success(`Reminder sent to ${response.data.recipient}`)
      } else {
        toast.error(response.error?.message || 'Failed to send reminder')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to send reminder')
    }
  }

  const handleRecordPayment = async (studentId, amount) => {
    try {
      const response = await recordPayment(studentId, amount)
      if (response.success) {
        toast.success('Payment recorded successfully')
      } else {
        toast.error(response.error?.message || 'Failed to record payment')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to record payment')
    }
  }

  const handleViewDetails = (student) => {
    setSelectedStudent(student)
    setShowActions(null)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-5">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 flex-1">
          {loading ? (
            <>
              {[1,2,3,4].map(i => <MetricCardSkeleton key={i} />)}
            </>
          ) : (
            metricsConfig.map(({ label, key, icon, bgColor, color }) => (
              <MetricCard
                key={key}
                label={label}
                value={metrics[key]}
                icon={icon}
                bgColor={bgColor}
                color={color}
                trend={key === 'total' ? '+3' : key === 'paid' ? '+5' : key === 'partial' ? '-2' : '0'}
              />
            ))
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-base font-medium text-gray-900">Recent Payments</h3>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm w-48 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <FunnelIcon className="w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="all">All Status</option>
                  <option value="Paid">Paid</option>
                  <option value="Partial">Partial</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
                
                <select
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="all">All Grades</option>
                  {uniqueGrades.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>

              <Link to="/upload" className="btn-primary ml-auto">
                <ArrowUpTrayIcon className="w-4 h-4 mr-2 inline" />
                Upload
              </Link>
            </div>
          </div>
        </div>

        {filteredData.length === 0 && !loading ? (
          <EmptyState onUpload={() => navigate('/upload')} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f9fafb] border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Student Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Grade</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Parent Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Amount Paid</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Balance</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <>
                    {[1,2,3,4,5].map(i => <TableRowSkeleton key={i} />)}
                  </>
                ) : (
                  filteredData.map((student) => (
                    <tr 
                      key={student.id} 
                      className="hover:bg-[#f9fafb] transition-colors cursor-pointer"
                      onClick={() => handleViewDetails(student)}
                    >
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{student.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{student.grade}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{student.parent}</td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <StatusBadge status={student.status} />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">{formatCurrency(student.paid)}</td>
                      <td className="px-4 py-3 text-sm text-right">
                        <span className={student.balance > 0 ? 'text-[#c73e2c] font-medium' : 'text-gray-900'}>
                          {formatCurrency(student.balance)}
                        </span>
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="relative flex justify-center">
                          <button
                            onClick={() => setShowActions(showActions === student.id ? null : student.id)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                            aria-label="Actions menu"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>
                          {showActions === student.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                              <div className="py-1">
                                <button
                                  onClick={() => handleViewDetails(student)}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <EyeIcon className="w-4 h-4" />
                                  View Details
                                </button>
                                <button
                                  onClick={() => { setShowReminderModal(student); setShowActions(null); }}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <EnvelopeIcon className="w-4 h-4" />
                                  Send Reminder
                                </button>
                                <button
                                  onClick={() => { setShowPaymentModal(student); setShowActions(null); }}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <CurrencyDollarIcon className="w-4 h-4" />
                                  Record Payment
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {!loading && filteredData.length > 0 && (
                <tfoot className="bg-gray-50 border-t border-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900" colSpan={4}>
                      Total ({filteredData.length} students)
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                      {formatCurrency(filteredData.reduce((acc, s) => acc + s.paid, 0))}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-[#c73e2c] text-right">
                      {formatCurrency(filteredData.reduce((acc, s) => acc + s.balance, 0))}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}
      </div>

      {selectedStudent && (
        <StudentDetailPanel 
          student={selectedStudent} 
          onClose={() => setSelectedStudent(null)} 
        />
      )}

      {showPaymentModal && (
        <PaymentModal
          student={showPaymentModal}
          onClose={() => setShowPaymentModal(null)}
          onConfirm={handleRecordPayment}
        />
      )}

      {showReminderModal && (
        <ReminderModal
          student={showReminderModal}
          onClose={() => setShowReminderModal(null)}
          onSend={handleSendReminder}
        />
      )}
    </div>
  )
}

export default Dashboard
