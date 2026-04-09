import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import feeService from '../../services/fee.service'
import { useToast } from '../../components/Toast'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import SearchableSelect from '../../components/common/SearchableSelect'
import { formatCurrency } from '../../utils/formatters'

const gradeOptions = [
  { value: 'Grade 1', label: 'Grade 1' },
  { value: 'Grade 2', label: 'Grade 2' },
  { value: 'Grade 3', label: 'Grade 3' },
  { value: 'Grade 4', label: 'Grade 4' },
  { value: 'Grade 5', label: 'Grade 5' },
  { value: 'Grade 6', label: 'Grade 6' },
  { value: 'Grade 7', label: 'Grade 7' },
  { value: 'Grade 8', label: 'Grade 8' },
]

function FeeStructure() {
  const [feeHeads, setFeeHeads] = useState([])
  const [feeStructures, setFeeStructures] = useState([])
  const [loading, setLoading] = useState(true)
  const [showHeadModal, setShowHeadModal] = useState(false)
  const [showStructureModal, setShowStructureModal] = useState(false)
  const [editingHead, setEditingHead] = useState(null)
  const [editingStructure, setEditingStructure] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, type: null, id: null })
  const [formData, setFormData] = useState({ name: '', description: '', className: '', feeHeadId: '', amount: '', term: 'Annual' })
  
  const toast = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [headsRes, structuresRes] = await Promise.all([
        feeService.getFeeHeads(),
        feeService.getFeeStructures(),
      ])
      if (headsRes.success) setFeeHeads(headsRes.data)
      if (structuresRes.success) setFeeStructures(structuresRes.data)
    } finally {
      setLoading(false)
    }
  }

  const handleHeadSubmit = async (e) => {
    e.preventDefault()
    const response = editingHead
      ? await feeService.updateFeeHead(editingHead.id, formData)
      : await feeService.createFeeHead(formData)
    
    if (response.success) {
      toast.success(editingHead ? 'Fee head updated' : 'Fee head created')
      loadData()
      resetForm()
    } else {
      toast.error(response.error?.message || 'Operation failed')
    }
  }

  const handleStructureSubmit = async (e) => {
    e.preventDefault()
    const response = editingStructure
      ? await feeService.updateFeeStructure(editingStructure.id, formData)
      : await feeService.createFeeStructure(formData)
    
    if (response.success) {
      toast.success(editingStructure ? 'Structure updated' : 'Structure created')
      loadData()
      resetForm()
    } else {
      toast.error(response.error?.message || 'Operation failed')
    }
  }

  const handleDelete = async () => {
    const { type, id } = deleteDialog
    if (type === 'head') {
      const response = await feeService.updateFeeHead(id, { isActive: false })
      if (response.success) toast.success('Fee head deleted')
    }
    setDeleteDialog({ open: false, type: null, id: null })
    loadData()
  }

  const editHead = (head) => {
    setEditingHead(head)
    setFormData({ name: head.name, description: head.description })
    setShowHeadModal(true)
  }

  const editStructure = (structure) => {
    setEditingStructure(structure)
    setFormData({
      className: structure.className,
      feeHeadId: structure.feeHeadId,
      amount: structure.amount,
      term: structure.term,
    })
    setShowStructureModal(true)
  }

  const resetForm = () => {
    setShowHeadModal(false)
    setShowStructureModal(false)
    setEditingHead(null)
    setEditingStructure(null)
    setFormData({ name: '', description: '', className: '', feeHeadId: '', amount: '', term: 'Annual' })
  }

  if (loading) return <LoadingSpinner text="Loading fee structure..." />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Fee Structure</h2>
        <div className="flex gap-3">
          <button onClick={() => { resetForm(); setShowStructureModal(true); }} className="btn-primary flex items-center gap-2">
            <PlusIcon className="w-4 h-4" /> Add Class Fee
          </button>
          <button onClick={() => { resetForm(); setShowHeadModal(true); }} className="btn-secondary flex items-center gap-2">
            <PlusIcon className="w-4 h-4" /> Add Fee Head
          </button>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Fee Heads</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Description</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {feeHeads.map(head => (
                <tr key={head.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900 font-medium">{head.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{head.description}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      head.isActive ? 'bg-[#e8f5e9] text-[#2c7a4d]' : 'bg-[#fee2e2] text-[#c73e2c]'
                    }`}>
                      {head.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => editHead(head)} className="p-1 text-gray-400 hover:text-gray-600">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteDialog({ open: true, type: 'head', id: head.id })} className="p-1 text-gray-400 hover:text-red-600 ml-2">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Class-wise Fee Structure</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Class</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Fee Head</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Term</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {feeStructures.map(structure => (
                <tr key={structure.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900 font-medium">{structure.className}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {feeHeads.find(h => h.id === structure.feeHeadId)?.name || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">{structure.term}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 font-medium text-right">{formatCurrency(structure.amount)}</td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => editStructure(structure)} className="p-1 text-gray-400 hover:text-gray-600">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showHeadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingHead ? 'Edit Fee Head' : 'Add Fee Head'}
            </h3>
            <form onSubmit={handleHeadSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
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

      {showStructureModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingStructure ? 'Edit Fee Structure' : 'Add Class Fee'}
            </h3>
            <form onSubmit={handleStructureSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <SearchableSelect
                  options={gradeOptions}
                  value={formData.className}
                  onChange={(val) => setFormData({ ...formData, className: val })}
                  placeholder="Select class"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fee Head</label>
                <SearchableSelect
                  options={feeHeads.map(h => ({ value: h.id, label: h.name }))}
                  value={formData.feeHeadId}
                  onChange={(val) => setFormData({ ...formData, feeHeadId: val })}
                  placeholder="Select fee head"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Term</label>
                <select
                  value={formData.term}
                  onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                  className="input-field"
                >
                  <option value="Annual">Annual</option>
                  <option value="Term 1">Term 1</option>
                  <option value="Term 2">Term 2</option>
                  <option value="Term 3">Term 3</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="input-field"
                  required
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
        onClose={() => setDeleteDialog({ open: false, type: null, id: null })}
        onConfirm={handleDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this fee head?"
        confirmText="Delete"
      />
    </div>
  )
}

export default FeeStructure
