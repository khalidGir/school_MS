import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useToast } from '../../components/Toast'
import staffService from '../../services/staff.service'
import SearchableSelect from '../../components/common/SearchableSelect'
import DatePicker from '../../components/common/DatePicker'

function AddStaff() {
  const navigate = useNavigate()
  const toast = useToast()
  const [roles, setRoles] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    qualification: '',
    joiningDate: new Date().toISOString().split('T')[0],
    salary: '',
    address: '',
  })

  useEffect(() => {
    loadOptions()
  }, [])

  const loadOptions = async () => {
    const [rolesRes, deptsRes] = await Promise.all([
      staffService.getRoles(),
      staffService.getDepartments(),
    ])
    if (rolesRes.success) setRoles(rolesRes.data)
    if (deptsRes.success) setDepartments(deptsRes.data)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await staffService.create(formData)
      if (response.success) {
        toast.success('Staff member added successfully')
        navigate('/staff')
      } else {
        toast.error(response.error?.message || 'Failed to add staff')
      }
    } catch (err) {
      toast.error('Failed to add staff member')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/staff')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-xl font-semibold text-gray-900">Add New Staff Member</h2>
      </div>

      <form onSubmit={handleSubmit} className="card max-w-2xl">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
              <SearchableSelect
                options={roles.map(r => ({ value: r, label: r }))}
                value={formData.role}
                onChange={(val) => handleChange('role', val)}
                placeholder="Select role"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
              <SearchableSelect
                options={departments.map(d => ({ value: d, label: d }))}
                value={formData.department}
                onChange={(val) => handleChange('department', val)}
                placeholder="Select department"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Qualification *</label>
              <input
                type="text"
                value={formData.qualification}
                onChange={(e) => handleChange('qualification', e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date *</label>
              <DatePicker
                value={formData.joiningDate}
                onChange={(val) => handleChange('joiningDate', val)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary *</label>
              <input
                type="number"
                value={formData.salary}
                onChange={(e) => handleChange('salary', e.target.value)}
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="input-field"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={() => navigate('/staff')} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Adding...' : 'Add Staff Member'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddStaff
