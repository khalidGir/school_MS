import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useToast } from '../../components/Toast'
import libraryService from '../../services/library.service'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import SearchableSelect from '../../components/common/SearchableSelect'

function BookCatalog() {
  const [books, setBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null })
  const [formData, setFormData] = useState({
    isbn: '', title: '', author: '', category: '', publisher: '', copies: '', rack: ''
  })
  const toast = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [booksRes, catsRes] = await Promise.all([
        libraryService.getBooks(),
        libraryService.getCategories(),
      ])
      if (booksRes.success) setBooks(booksRes.data)
      if (catsRes.success) setCategories(catsRes.data)
    } finally {
      setLoading(false)
    }
  }

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm)
    const matchesCategory = !categoryFilter || book.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = editingBook
      ? await libraryService.updateBook(editingBook.id, formData)
      : await libraryService.createBook({ ...formData, copies: parseInt(formData.copies) })
    
    if (response.success) {
      toast.success(editingBook ? 'Book updated' : 'Book added')
      loadData()
      resetForm()
    } else {
      toast.error(response.error?.message || 'Operation failed')
    }
  }

  const handleDelete = async () => {
    await libraryService.deleteBook(deleteDialog.id)
    toast.success('Book deleted')
    setDeleteDialog({ open: false, id: null })
    loadData()
  }

  const editBook = (book) => {
    setEditingBook(book)
    setFormData({
      isbn: book.isbn, title: book.title, author: book.author,
      category: book.category, publisher: book.publisher,
      copies: book.copies.toString(), rack: book.rack
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setShowModal(false)
    setEditingBook(null)
    setFormData({ isbn: '', title: '', author: '', category: '', publisher: '', copies: '', rack: '' })
  }

  if (loading) return <LoadingSpinner text="Loading books..." />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Book Catalog</h2>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-primary flex items-center gap-2">
          <PlusIcon className="w-4 h-4" /> Add Book
        </button>
      </div>

      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <SearchableSelect
            options={categories.map(c => ({ value: c, label: c }))}
            value={categoryFilter}
            onChange={setCategoryFilter}
            placeholder="All Categories"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">ISBN</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Title</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Author</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Category</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-500">Copies</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-500">Available</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBooks.map(book => (
                <tr key={book.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-500">{book.isbn}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 font-medium">{book.title}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{book.author}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{book.category}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-center">{book.copies}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      book.available > 0 ? 'bg-[#e8f5e9] text-[#2c7a4d]' : 'bg-[#fee2e2] text-[#c73e2c]'
                    }`}>
                      {book.available}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button onClick={() => editBook(book)} className="p-1 text-gray-400 hover:text-gray-600">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteDialog({ open: true, id: book.id })} className="p-1 text-gray-400 hover:text-red-600 ml-2">
                      <TrashIcon className="w-4 h-4" />
                    </button>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{editingBook ? 'Edit Book' : 'Add Book'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                <input type="text" value={formData.isbn} onChange={(e) => setFormData({ ...formData, isbn: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input type="text" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <SearchableSelect options={categories.map(c => ({ value: c, label: c }))} value={formData.category} onChange={(val) => setFormData({ ...formData, category: val })} placeholder="Select category" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Publisher</label>
                <input type="text" value={formData.publisher} onChange={(e) => setFormData({ ...formData, publisher: e.target.value })} className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Copies</label>
                  <input type="number" value={formData.copies} onChange={(e) => setFormData({ ...formData, copies: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rack</label>
                  <input type="text" value={formData.rack} onChange={(e) => setFormData({ ...formData, rack: e.target.value })} className="input-field" />
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog isOpen={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })} onConfirm={handleDelete} title="Delete Book" message="Are you sure you want to delete this book?" />
    </div>
  )
}

export default BookCatalog
