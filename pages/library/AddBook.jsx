import { useState, useEffect } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import { useToast } from '../../components/Toast'
import libraryService from '../../services/library.service'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import SearchableSelect from '../../components/common/SearchableSelect'

function AddBook() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    isbn: '', title: '', author: '', category: '', publisher: '', copies: '', rack: ''
  })
  const toast = useToast()

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    const res = await libraryService.getCategories()
    if (res.success) setCategories(res.data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await libraryService.createBook({ ...formData, copies: parseInt(formData.copies) })
      if (response.success) {
        toast.success('Book added successfully')
        setFormData({ isbn: '', title: '', author: '', category: '', publisher: '', copies: '', rack: '' })
      } else {
        toast.error(response.error?.message || 'Failed to add book')
      }
    } catch {
      toast.error('Failed to add book')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Add New Book</h2>
      <form onSubmit={handleSubmit} className="card max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ISBN *</label>
            <input type="text" value={formData.isbn} onChange={(e) => setFormData({ ...formData, isbn: e.target.value })} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
            <input type="text" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <SearchableSelect options={categories.map(c => ({ value: c, label: c }))} value={formData.category} onChange={(val) => setFormData({ ...formData, category: val })} placeholder="Select category" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Publisher</label>
            <input type="text" value={formData.publisher} onChange={(e) => setFormData({ ...formData, publisher: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Copies *</label>
            <input type="number" min="1" value={formData.copies} onChange={(e) => setFormData({ ...formData, copies: e.target.value })} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rack Location</label>
            <input type="text" value={formData.rack} onChange={(e) => setFormData({ ...formData, rack: e.target.value })} className="input-field" placeholder="e.g., A-1" />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
          <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Adding...' : 'Add Book'}</button>
        </div>
      </form>
    </div>
  )
}

export default AddBook
