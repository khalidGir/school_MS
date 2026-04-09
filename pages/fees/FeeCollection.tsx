import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MagnifyingGlassIcon, PrinterIcon } from '@heroicons/react/24/outline'
import { useToast } from '../../components/Toast'
import { formatCurrency } from '../../utils/formatters'
import SearchableSelect from '../../components/common/SearchableSelect'
import DatePicker from '../../components/common/DatePicker'
import Receipt from '../../components/common/Receipt'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import feeService from '../../services/fee.service'
import api from '../../services/api'

const paymentMethods = [
  { value: 'Cash', label: 'Cash' },
  { value: 'Online', label: 'Online Transfer' },
  { value: 'Check', label: 'Check' },
  { value: 'Card', label: 'Card' },
]

function FeeCollection() {
  const navigate = useNavigate()
  const toast = useToast()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [receipt, setReceipt] = useState(null)
  const [formData, setFormData] = useState({
    amount: '',
    method: 'Cash',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  })

  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = async () => {
    try {
      const response = await api.students.getAll()
      if (response.success) setStudents(response.data)
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.grade.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCollect = (student) => {
    setSelectedStudent(student)
    setFormData({ amount: '', method: 'Cash', date: new Date().toISOString().split('T')[0], notes: '' })
    setShowPaymentModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedStudent || !formData.amount) return

    try {
      const response = await api.payments.recordPayment(selectedStudent.id, parseFloat(formData.amount), {
        method: formData.method,
        notes: formData.notes,
      })

      if (response.success) {
        toast.success('Payment recorded successfully')
        
        const newReceipt = {
          receiptNo: `RCP${Date.now()}`,
          date: formData.date,
          studentName: selectedStudent.name,
          grade: selectedStudent.grade,
          items: [{ description: 'Fee Payment', amount: parseFloat(formData.amount) }],
          total: parseFloat(formData.amount),
          paymentMethod: formData.method,
          notes: formData.notes,
        }
        setReceipt(newReceipt)
        setShowReceipt(true)
        setShowPaymentModal(false)
        loadStudents()
      } else {
        toast.error(response.error?.message || 'Payment failed')
      }
    } catch (err) {
      toast.error('Payment failed')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) return <LoadingSpinner text="Loading..." />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Fee Collection</h2>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search student by name or grade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Student</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Grade</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Status</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">Paid</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">Balance</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <p className="text-sm font-medium text-gray-900">{student.name}</p>
                    <p className="text-xs text-gray-500">{student.parent}</p>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">{student.grade}</td>
                  <td className="py-3 px-4">
                    <span className={`badge-${student.status?.toLowerCase()}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right font-medium">
                    {formatCurrency(student.paid)}
                  </td>
                  <td className="py-3 px-4 text-sm text-right">
                    <span className={student.balance > 0 ? 'text-[#c73e2c] font-medium' : 'text-gray-900'}>
                      {formatCurrency(student.balance)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleCollect(student)}
                      className="btn-primary text-xs px-3 py-1.5"
                    >
                      Collect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showPaymentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Collect Fee</h3>
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Student</p>
              <p className="font-medium text-gray-900">{selectedStudent.name}</p>
              <p className="text-sm text-gray-500">{selectedStudent.grade}</p>
              <p className="mt-2 text-sm text-gray-500">Balance Due</p>
              <p className="text-lg font-semibold text-[#c73e2c]">{formatCurrency(selectedStudent.balance)}</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={selectedStudent.balance}
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="input-field"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                <DatePicker
                  value={formData.date}
                  onChange={(val) => setFormData({ ...formData, date: val })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <SearchableSelect
                  options={paymentMethods}
                  value={formData.method}
                  onChange={(val) => setFormData({ ...formData, method: val })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input-field"
                  rows={2}
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowPaymentModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Record Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showReceipt && receipt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="w-full max-w-lg my-8">
            <Receipt
              receipt={receipt}
              schoolInfo={{ name: 'School Name', address: 'School Address' }}
              onPrint={handlePrint}
            />
            <div className="mt-4 flex justify-center">
              <button onClick={() => setShowReceipt(false)} className="btn-secondary">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FeeCollection
