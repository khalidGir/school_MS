import { useState, useEffect } from 'react'
import { PlusIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useToast } from '../../components/Toast'
import staffService from '../../services/staff.service'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import SearchableSelect from '../../components/common/SearchableSelect'
import DatePicker from '../../components/common/DatePicker'

const leaveTypes = [
  { value: 'Sick Leave', label: 'Sick Leave' },
  { value: 'Casual Leave', label: 'Casual Leave' },
  { value: 'Annual Leave', label: 'Annual Leave' },
  { value: 'Emergency Leave', label: 'Emergency Leave' },
]

function LeaveManagement() {
  const [leaves, setLeaves] = useState([])
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showApproveDialog, setShowApproveDialog] = useState({ open: false, id: null, status: null })
  const [formData, setFormData] = useState({
    staffId: '',
    type: '',
    startDate: '',
    endDate: '',
    reason: '',
  })
  const toast = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [leavesRes, staffRes] = await Promise.all([
        staffService.getLeaves(),
        staffService.getAll(),
      ])
      if (leavesRes.success) setLeaves(leavesRes.data)
      if (staffRes.success) setStaff(staffRes.data)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await staffService.applyLeave(formData)
    if (response.success) {
      toast.success('Leave application submitted')
      loadData()
      setShowModal(false)
      setFormData({ staffId: '', type: '', startDate: '', endDate: '', reason: '' })
    } else {
      toast.error(response.error?.message || 'Failed to apply')
    }
  }

  const handleUpdateStatus = async () => {
    const { id, status } = showApproveDialog
    const response = await staffService.updateLeaveStatus(id, status)
    if (response.success) {
      toast.success(`Leave ${status.toLowerCase()}`)
      loadData()
    }
    setShowApproveDialog({ open: false, id: null, status: null })
  }

  const getStaffName = (id) => staff.find(s => s.id === id)?.name || 'Unknown'

  if (loading) return <LoadingSpinner text="Loading leaves..." />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Leave Management</h2>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <PlusIcon className="w-4 h-4" /> Apply Leave
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Staff</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Type</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">From</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">To</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Reason</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Applied On</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-500">Status</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leaves.map(leave => (
                <tr key={leave.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900 font-medium">{getStaffName(leave.staffId)}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{leave.type}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{leave.startDate}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{leave.endDate}</td>
                  <td className="py-3 px-4 text-sm text-gray-500 max-w-[200px] truncate">{leave.reason}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{leave.appliedDate}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      leave.status === 'Approved' ? 'bg-[#e8f5e9] text-[#2c7a4d]' :
                      leave.status === 'Pending' ? 'bg-[#fef4e6] text-[#b45309]' :
                      'bg-[#fee2e2] text-[#c73e2c]'
                    }`}>
                      {leave.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {leave.status === 'Pending' && (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setShowApproveDialog({ open: true, id: leave.id, status: 'Approved' })}
                          className="p-1 text-[#2c7a4d] hover:bg-[#e8f5e9] rounded"
                          title="Approve"
                        >
                          <CheckIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowApproveDialog({ open: true, id: leave.id, status: 'Rejected' })}
                          className="p-1 text-[#c73e2c] hover:bg-[#fee2e2] rounded"
                          title="Reject"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply for Leave</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Staff Member</label>
                <SearchableSelect
                  options={staff.map(s => ({ value: s.id, label: s.name }))}
                  value={formData.staffId}
                  onChange={(val) => setFormData({ ...formData, staffId: val })}
                  placeholder="Select staff"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                <SearchableSelect
                  options={leaveTypes}
                  value={formData.type}
                  onChange={(val) => setFormData({ ...formData, type: val })}
                  placeholder="Select type"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <DatePicker
                    value={formData.startDate}
                    onChange={(val) => setFormData({ ...formData, startDate: val })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <DatePicker
                    value={formData.endDate}
                    onChange={(val) => setFormData({ ...formData, endDate: val })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="input-field"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={showApproveDialog.open}
        onClose={() => setShowApproveDialog({ open: false, id: null, status: null })}
        onConfirm={handleUpdateStatus}
        title={showApproveDialog.status === 'Approved' ? 'Approve Leave' : 'Reject Leave'}
        message={`Are you sure you want to ${showApproveDialog.status?.toLowerCase()} this leave request?`}
        confirmText={showApproveDialog.status}
      />
    </div>
  )
}

export default LeaveManagement
