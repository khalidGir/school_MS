import { useState, useEffect } from 'react'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { useToast } from '../../components/Toast'
import libraryService from '../../services/library.service'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import SearchableSelect from '../../components/common/SearchableSelect'
import ConfirmDialog from '../../components/common/ConfirmDialog'

function IssueReturn() {
  const [books, setBooks] = useState([])
  const [members, setMembers] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('issue')
  const [formData, setFormData] = useState({ bookId: '', memberId: '' })
  const [returnDialog, setReturnDialog] = useState({ open: false, transactionId: null })
  const toast = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [booksRes, membersRes, transRes] = await Promise.all([
        libraryService.getBooks(),
        libraryService.getMembers(),
        libraryService.getTransactions(),
      ])
      if (booksRes.success) setBooks(booksRes.data)
      if (membersRes.success) setMembers(membersRes.data)
      if (transRes.success) setTransactions(transRes.data)
    } finally {
      setLoading(false)
    }
  }

  const handleIssue = async (e) => {
    e.preventDefault()
    const response = await libraryService.issueBook(formData)
    if (response.success) {
      toast.success('Book issued successfully')
      setFormData({ bookId: '', memberId: '' })
      loadData()
    } else {
      toast.error(response.error?.message || 'Failed to issue book')
    }
  }

  const handleReturn = async () => {
    const response = await libraryService.returnBook(returnDialog.transactionId)
    if (response.success) {
      toast.success('Book returned successfully')
      loadData()
    }
    setReturnDialog({ open: false, transactionId: null })
  }

  const getBookTitle = (id) => books.find(b => b.id === id)?.title || 'Unknown'
  const getMemberName = (id) => members.find(m => m.id === id)?.name || 'Unknown'

  if (loading) return <LoadingSpinner text="Loading..." />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Issue / Return Books</h2>
      </div>

      <div className="flex border-b border-gray-200">
        <button onClick={() => setActiveTab('issue')} className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'issue' ? 'border-primary text-primary' : 'border-transparent text-gray-500'}`}>
          Issue Book
        </button>
        <button onClick={() => setActiveTab('return')} className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'return' ? 'border-primary text-primary' : 'border-transparent text-gray-500'}`}>
          Return Book
        </button>
        <button onClick={() => setActiveTab('transactions')} className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'transactions' ? 'border-primary text-primary' : 'border-transparent text-gray-500'}`}>
          All Transactions
        </button>
      </div>

      {activeTab === 'issue' && (
        <div className="card max-w-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Issue a Book</h3>
          <form onSubmit={handleIssue} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Book</label>
              <SearchableSelect
                options={books.filter(b => b.available > 0).map(b => ({ value: b.id, label: `${b.title} (${b.available} available)` }))}
                value={formData.bookId}
                onChange={(val) => setFormData({ ...formData, bookId: val })}
                placeholder="Select a book"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Member</label>
              <SearchableSelect
                options={members.map(m => ({ value: m.id, label: `${m.name} (${m.type})` }))}
                value={formData.memberId}
                onChange={(val) => setFormData({ ...formData, memberId: val })}
                placeholder="Select a member"
              />
            </div>
            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              Issue Book <ArrowRightIcon className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {activeTab === 'return' && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Return a Book</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Book</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Member</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Issue Date</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Due Date</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-gray-500">Status</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.filter(t => t.status !== 'Returned').map(trans => (
                  <tr key={trans.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{getBookTitle(trans.bookId)}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{getMemberName(trans.memberId)}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{trans.issueDate}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{trans.dueDate}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${trans.status === 'Overdue' ? 'bg-[#fee2e2] text-[#c73e2c]' : 'bg-[#fef4e6] text-[#b45309]'}`}>
                        {trans.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button onClick={() => setReturnDialog({ open: true, transactionId: trans.id })} className="btn-primary text-xs px-3 py-1.5">
                        Return
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Book</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Member</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Issue Date</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Return Date</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map(trans => (
                  <tr key={trans.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{getBookTitle(trans.bookId)}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{getMemberName(trans.memberId)}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{trans.issueDate}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{trans.returnDate || '-'}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        trans.status === 'Returned' ? 'bg-[#e8f5e9] text-[#2c7a4d]' :
                        trans.status === 'Overdue' ? 'bg-[#fee2e2] text-[#c73e2c]' :
                        'bg-[#fef4e6] text-[#b45309]'
                      }`}>
                        {trans.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog isOpen={returnDialog.open} onClose={() => setReturnDialog({ open: false, transactionId: null })} onConfirm={handleReturn} title="Return Book" message="Confirm that this book has been returned?" />
    </div>
  )
}

export default IssueReturn
