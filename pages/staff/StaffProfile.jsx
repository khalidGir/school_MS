import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline'
import { formatCurrency } from '../../utils/formatters'
import staffService from '../../services/staff.service'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import StatCard from '../../components/common/StatCard'
import { UserIcon, CurrencyDollarIcon, CalendarIcon, BookOpenIcon } from '@heroicons/react/24/outline'

function StaffProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [staff, setStaff] = useState(null)
  const [leaves, setLeaves] = useState([])
  const [payroll, setPayroll] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('info')

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    try {
      const [staffRes, leavesRes, payrollRes] = await Promise.all([
        staffService.getById(id),
        staffService.getLeaves(id),
        staffService.getPayroll(id),
      ])
      if (staffRes.success) setStaff(staffRes.data)
      if (leavesRes.success) setLeaves(leavesRes.data)
      if (payrollRes.success) setPayroll(payrollRes.data[0])
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner text="Loading profile..." />
  if (!staff) return <div className="text-center py-8 text-gray-500">Staff member not found</div>

  const tabs = [
    { id: 'info', label: 'Information' },
    { id: 'leave', label: 'Leave History' },
    { id: 'payroll', label: 'Payroll' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/staff')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-xl font-semibold text-gray-900">Staff Profile</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{staff.name}</h3>
            <p className="text-sm text-gray-500">{staff.role}</p>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-2 ${
              staff.status === 'Active' ? 'bg-[#e8f5e9] text-[#2c7a4d]' : 'bg-[#fee2e2] text-[#c73e2c]'
            }`}>
              {staff.status}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500">Employee ID</p>
              <p className="text-sm font-medium text-gray-900">{staff.employeeId}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Department</p>
              <p className="text-sm font-medium text-gray-900">{staff.department}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium text-gray-900">{staff.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Phone</p>
              <p className="text-sm font-medium text-gray-900">{staff.phone}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <StatCard
              label="Basic Salary"
              value={formatCurrency(staff.salary)}
              icon={CurrencyDollarIcon}
              bgColor="bg-[#e8f5e9]"
              color="text-[#2c7a4d]"
            />
            <StatCard
              label="Qualification"
              value={staff.qualification}
              icon={BookOpenIcon}
              bgColor="bg-[#e6f0fa]"
              color="text-primary"
            />
            <StatCard
              label="Joining Date"
              value={new Date(staff.joiningDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              icon={CalendarIcon}
              bgColor="bg-[#fef4e6]"
              color="text-[#b45309]"
            />
          </div>

          <div className="card">
            <div className="flex border-b border-gray-200 mb-4">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'info' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Full Name</p>
                    <p className="text-sm font-medium text-gray-900">{staff.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Employee ID</p>
                    <p className="text-sm font-medium text-gray-900">{staff.employeeId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Role</p>
                    <p className="text-sm font-medium text-gray-900">{staff.role}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Department</p>
                    <p className="text-sm font-medium text-gray-900">{staff.department}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Qualification</p>
                    <p className="text-sm font-medium text-gray-900">{staff.qualification}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Joining Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(staff.joiningDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'leave' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Type</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">From</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">To</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Reason</th>
                      <th className="text-center py-3 px-4 text-xs font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {leaves.map(leave => (
                      <tr key={leave.id}>
                        <td className="py-3 px-4 text-sm text-gray-900">{leave.type}</td>
                        <td className="py-3 px-4 text-sm text-gray-500">{leave.startDate}</td>
                        <td className="py-3 px-4 text-sm text-gray-500">{leave.endDate}</td>
                        <td className="py-3 px-4 text-sm text-gray-500">{leave.reason}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            leave.status === 'Approved' ? 'bg-[#e8f5e9] text-[#2c7a4d]' :
                            leave.status === 'Pending' ? 'bg-[#fef4e6] text-[#b45309]' :
                            'bg-[#fee2e2] text-[#c73e2c]'
                          }`}>
                            {leave.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {leaves.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-4 text-center text-sm text-gray-500">No leave records</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'payroll' && payroll && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Basic Salary</p>
                    <p className="text-2xl font-semibold text-gray-900">{formatCurrency(payroll.basicSalary)}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Net Salary</p>
                    <p className="text-2xl font-semibold text-[#2c7a4d]">{formatCurrency(payroll.netSalary)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Allowances</p>
                    <p className="text-sm font-medium text-[#2c7a4d]">{formatCurrency(payroll.allowances)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Deductions</p>
                    <p className="text-sm font-medium text-[#c73e2c]">{formatCurrency(payroll.deductions)}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">Current Month</p>
                  <p className="text-sm font-medium text-gray-900">{payroll.month}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaffProfile
