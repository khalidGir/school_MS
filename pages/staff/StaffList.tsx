import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { useToast } from '../../components/Toast'
import staffService from '../../services/staff.service'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import SearchableSelect from '../../components/common/SearchableSelect'

function StaffList() {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [roles, setRoles] = useState([])
  const [departments, setDepartments] = useState([])
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null })
  const toast = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [staffRes, rolesRes, deptsRes] = await Promise.all([
        staffService.getAll(),
        staffService.getRoles(),
        staffService.getDepartments(),
      ])
      if (staffRes.success) setStaff(staffRes.data)
      if (rolesRes.success) setRoles(rolesRes.data)
      if (deptsRes.success) setDepartments(deptsRes.data)
    } finally {
      setLoading(false)
    }
  }

  const filteredStaff = staff.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = !roleFilter || s.role === roleFilter
    const matchesDept = !departmentFilter || s.department === departmentFilter
    return matchesSearch && matchesRole && matchesDept
  })

  const handleDelete = async () => {
    await staffService.delete(deleteDialog.id)
    toast.success('Staff member deleted')
    setDeleteDialog({ open: false, id: null })
    loadData()
  }

  if (loading) return <LoadingSpinner text="Loading staff..." />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Staff Management</h2>
        <Link to="/staff/add" className="btn-primary flex items-center gap-2">
          <PlusIcon className="w-4 h-4" /> Add Staff
        </Link>
      </div>

      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or employee ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-3">
            <SearchableSelect
              options={roles.map(r => ({ value: r, label: r }))}
              value={roleFilter}
              onChange={setRoleFilter}
              placeholder="All Roles"
            />
            <SearchableSelect
              options={departments.map(d => ({ value: d, label: d }))}
              value={departmentFilter}
              onChange={setDepartmentFilter}
              placeholder="All Departments"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Employee</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Employee ID</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Role</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Department</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Contact</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-500">Status</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStaff.map(member => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <Link to={`/staff/${member.id}`} className="text-sm font-medium text-gray-900 hover:text-primary">
                      {member.name}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">{member.employeeId}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{member.role}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{member.department}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    <p>{member.email}</p>
                    <p className="text-xs">{member.phone}</p>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      member.status === 'Active' ? 'bg-[#e8f5e9] text-[#2c7a4d]' : 'bg-[#fee2e2] text-[#c73e2c]'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link to={`/staff/${member.id}`} className="text-sm text-primary hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Staff Member"
        message="Are you sure you want to delete this staff member?"
      />
    </div>
  )
}

export default StaffList
