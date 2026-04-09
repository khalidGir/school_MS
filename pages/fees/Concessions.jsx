import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useToast } from '../../components/Toast'
import feeService from '../../services/fee.service'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import SearchableSelect from '../../components/common/SearchableSelect'

const concessionTypes = [
  { value: 'Merit', label: 'Merit Based' },
  { value: 'Sibling', label: 'Sibling Discount' },
  { value: 'Scholarship', label: 'Scholarship' },
  { value: 'Financial Aid', label: 'Financial Aid' },
  { value: 'Staff Child', label: 'Staff Child' },
]

function Concessions() {
  const [concessions, setConcessions] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingConcession, setEditingConcession] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null })
  const [formData, setFormData] = useState({ studentId: '', type: '', percentage: '', reason: '' })
  const toast = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [concRes, studentRes] = await Promise.all([
        feeService.getConcessions(),
        import('../../services/api').then(m => m.default.students.getAll()),
      ])
      if (concRes.success) setConcessions(concRes.data)
      if (studentRes.success) setStudents(studentRes.data)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = editingConcession
      ? await feeService.updateConcession(editingConcession.id, formData)
      : await feeService.createConcession(formData)
    
    if (response.success) {
      toast.success(editingConcession ? 'Concession updated' : 'Concession created')
      loadData()
      resetForm()
    } else {
      toast.error(response.error?.message || 'Operation failed')
    }
  }

  const handleDelete = async () => {
    await feeService.deleteConcession(deleteDialog.id)
    toast.success('Concession deleted')
    setDeleteDialog({ open: false, id: null })
    loadData()
  }

  const editConcession = (conc) => {
    setEditingConcession(conc)
    setFormData({
      studentId: conc.studentId,
      type: conc.type,
      percentage: conc.percentage,
      reason: conc.reason,
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setShowModal(false)
    setEditingConcession(null)
    setFormData({ studentId: '', type: '', percentage: '', reason: '' })
  }

  const getStudentName = (id) => students.find(s => s.id === id)?.name || 'Unknown'

  if (loading) return <LoadingSpinner text="Loading concessions..." />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Fee Concessions</h2>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-primary flex items-center gap-2">
          <PlusIcon className="w-4 h-4" /> Add Concession
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Student</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Type</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">Percentage</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Reason</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {concessions.map(conc => (
                <tr key={conc.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                    {getStudentName(conc.studentId)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">{conc.type}</td>
                  <td className="py-3 px-4 text-sm text-[#2c7a4d] font-medium text-right">{conc.percentage}%</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{conc.reason}</td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => editConcession(conc)} className="p-1 text-gray-400 hover:text-gray-600">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteDialog({ open: true, id: conc.id })} className="p-1 text-gray-400 hover:text-red-600 ml-2">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {concessions.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-gray-500">No concessions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingConcession ? 'Edit Concession' : 'Add Concession'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                <SearchableSelect
                  options={students.map(s => ({ value: s.id, label: s.name }))}
                  value={formData.studentId}
                  onChange={(val) => setFormData({ ...formData, studentId: val })}
                  placeholder="Select student"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Concession Type</label>
                <SearchableSelect
                  options={concessionTypes}
                  value={formData.type}
                  onChange={(val) => setFormData({ ...formData, type: val })}
                  placeholder="Select type"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Percentage (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.percentage}
                  onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="input-field"
                  rows={2}
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Concession"
        message="Are you sure you want to delete this concession?"
      />
    </div>
  )
}

export default Concessions
