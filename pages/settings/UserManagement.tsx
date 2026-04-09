import { useState } from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useToast } from '../../components/Toast'
import ConfirmDialog from '../../components/common/ConfirmDialog'

const mockUsers = [
  { id: 1, name: 'John Smith', email: 'john@school.edu', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@school.edu', role: 'Accountant', status: 'Active' },
  { id: 3, name: 'Mike Wilson', email: 'mike@school.edu', role: 'Teacher', status: 'Active' },
]

const roles = ['Admin', 'Accountant', 'Teacher', 'Receptionist', 'Librarian']

function UserManagement() {
  const [users, setUsers] = useState(mockUsers)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null })
  const [formData, setFormData] = useState({ name: '', email: '', role: '' })
  const toast = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u))
      toast.success('User updated')
    } else {
      setUsers([...users, { id: Date.now(), ...formData, status: 'Active' }])
      toast.success('User added')
    }
    resetForm()
  }

  const handleDelete = () => {
    setUsers(users.filter(u => u.id !== deleteDialog.id))
    toast.success('User deleted')
    setDeleteDialog({ open: false, id: null })
  }

  const editUser = (user) => {
    setEditingUser(user)
    setFormData({ name: user.name, email: user.email, role: user.role })
    setShowModal(true)
  }

  const resetForm = () => {
    setShowModal(false)
    setEditingUser(null)
    setFormData({ name: '', email: '', role: '' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-primary flex items-center gap-2">
          <PlusIcon className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Name</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Email</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Role</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-500">Status</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900 font-medium">{user.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{user.email}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{user.role}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-[#e8f5e9] text-[#2c7a4d]">{user.status}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => editUser(user)} className="p-1 text-gray-400 hover:text-gray-600"><PencilIcon className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteDialog({ open: true, id: user.id })} className="p-1 text-gray-400 hover:text-red-600 ml-2"><TrashIcon className="w-4 h-4" /></button>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{editingUser ? 'Edit User' : 'Add User'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="input-field">
                  <option value="">Select role</option>
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog isOpen={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })} onConfirm={handleDelete} title="Delete User" message="Are you sure you want to delete this user?" />
    </div>
  )
}

export default UserManagement
