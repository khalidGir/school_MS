import { useState, useEffect } from 'react'
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useToast } from '../../components/Toast'
import libraryService from '../../services/library.service'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import SearchableSelect from '../../components/common/SearchableSelect'

const memberTypes = [
  { value: 'Student', label: 'Student' },
  { value: 'Staff', label: 'Staff' },
]

function MemberManagement() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ name: '', type: 'Student', grade: '', department: '' })
  const toast = useToast()

  useEffect(() => {
    loadMembers()
  }, [])

  const loadMembers = async () => {
    try {
      const res = await libraryService.getMembers()
      if (res.success) setMembers(res.data)
    } finally {
      setLoading(false)
    }
  }

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.memberId.toLowerCase().includes(searchTerm)
    const matchesType = !typeFilter || m.type === typeFilter
    return matchesSearch && matchesType
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = formData.type === 'Student' ? { name: formData.name, type: formData.type, grade: formData.grade } : { name: formData.name, type: formData.type, department: formData.department }
    const response = await libraryService.createMember(data)
    if (response.success) {
      toast.success('Member added successfully')
      loadMembers()
      setShowModal(false)
      setFormData({ name: '', type: 'Student', grade: '', department: '' })
    } else {
      toast.error(response.error?.message || 'Failed to add member')
    }
  }

  if (loading) return <LoadingSpinner text="Loading members..." />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Library Members</h2>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <PlusIcon className="w-4 h-4" /> Add Member
        </button>
      </div>

      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by name or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field pl-10" />
          </div>
          <SearchableSelect options={memberTypes} value={typeFilter} onChange={setTypeFilter} placeholder="All Types" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Member ID</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Name</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Type</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Details</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-500">Books Issued</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMembers.map(member => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-500">{member.memberId}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 font-medium">{member.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{member.type}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{member.grade || member.department}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${member.booksIssued > 0 ? 'bg-[#fef4e6] text-[#b45309]' : 'bg-gray-100 text-gray-600'}`}>
                      {member.booksIssued}
                    </span>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Library Member</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                <SearchableSelect options={memberTypes} value={formData.type} onChange={(val) => setFormData({ ...formData, type: val })} />
              </div>
              {formData.type === 'Student' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grade *</label>
                  <input type="text" value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: e.target.value })} className="input-field" placeholder="e.g., Grade 5" required />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                  <input type="text" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="input-field" required />
                </div>
              )}
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default MemberManagement
