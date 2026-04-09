const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const mockBooks = [
  { id: 1, isbn: '978-0-06-112008-4', title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Fiction', publisher: 'Harper Perennial', copies: 5, available: 3, rack: 'A-1' },
  { id: 2, isbn: '978-0-7432-7356-5', title: '1984', author: 'George Orwell', category: 'Fiction', publisher: 'Penguin', copies: 4, available: 2, rack: 'A-2' },
  { id: 3, isbn: '978-0-316-76948-0', title: 'The Catcher in the Rye', author: 'J.D. Salinger', category: 'Fiction', publisher: 'Little, Brown', copies: 3, available: 3, rack: 'A-3' },
  { id: 4, isbn: '978-0-452-28423-4', title: 'Brave New World', author: 'Aldous Huxley', category: 'Fiction', publisher: 'Harper Perennial', copies: 2, available: 1, rack: 'A-4' },
  { id: 5, isbn: '978-0-553-21311-7', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', publisher: 'Scribner', copies: 6, available: 4, rack: 'B-1' },
]

const mockMembers = [
  { id: 1, memberId: 'LIB001', name: 'Emma Wilson', type: 'Student', grade: 'Grade 5', joinDate: '2023-09-01', booksIssued: 2 },
  { id: 2, memberId: 'LIB002', name: 'James Brown', type: 'Student', grade: 'Grade 3', joinDate: '2023-09-01', booksIssued: 1 },
  { id: 3, memberId: 'LIB003', name: 'John Smith', type: 'Staff', department: 'Mathematics', joinDate: '2020-03-15', booksIssued: 0 },
]

const mockTransactions = [
  { id: 1, bookId: 1, memberId: 1, issueDate: '2024-01-10', dueDate: '2024-01-24', returnDate: null, status: 'Issued' },
  { id: 2, bookId: 5, memberId: 1, issueDate: '2024-01-05', dueDate: '2024-01-19', returnDate: '2024-01-18', status: 'Returned' },
  { id: 3, bookId: 2, memberId: 2, issueDate: '2024-01-08', dueDate: '2024-01-22', returnDate: null, status: 'Overdue' },
]

let books = [...mockBooks]
let members = [...mockMembers]
let transactions = [...mockTransactions]

export const libraryService = {
  async getBooks(filters = {}) {
    await delay(500)
    let result = [...books]
    if (filters.category) result = result.filter(b => b.category === filters.category)
    if (filters.search) {
      const term = filters.search.toLowerCase()
      result = result.filter(b => b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term) || b.isbn.includes(term))
    }
    return { success: true, data: result }
  },

  async getBookById(id) {
    await delay(300)
    const book = books.find(b => b.id === id)
    if (!book) return { success: false, error: { message: 'Book not found' } }
    return { success: true, data: book }
  },

  async createBook(data) {
    await delay(400)
    const newBook = { id: Date.now(), ...data, available: data.copies }
    books.push(newBook)
    return { success: true, data: newBook }
  },

  async updateBook(id, data) {
    await delay(400)
    const index = books.findIndex(b => b.id === id)
    if (index === -1) return { success: false, error: { message: 'Book not found' } }
    books[index] = { ...books[index], ...data }
    return { success: true, data: books[index] }
  },

  async deleteBook(id) {
    await delay(300)
    books = books.filter(b => b.id !== id)
    return { success: true, data: { deleted: true } }
  },

  async getMembers(filters = {}) {
    await delay(400)
    let result = [...members]
    if (filters.type) result = result.filter(m => m.type === filters.type)
    if (filters.search) {
      const term = filters.search.toLowerCase()
      result = result.filter(m => m.name.toLowerCase().includes(term) || m.memberId.toLowerCase().includes(term))
    }
    return { success: true, data: result }
  },

  async createMember(data) {
    await delay(400)
    const newMember = { id: Date.now(), memberId: `LIB${String(members.length + 1).padStart(3, '0')}`, ...data, booksIssued: 0 }
    members.push(newMember)
    return { success: true, data: newMember }
  },

  async getTransactions(filters = {}) {
    await delay(400)
    let result = [...transactions]
    if (filters.status) result = result.filter(t => t.status === filters.status)
    if (filters.memberId) result = result.filter(t => t.memberId === filters.memberId)
    return { success: true, data: result }
  },

  async issueBook(data) {
    await delay(500)
    const book = books.find(b => b.id === data.bookId)
    if (!book || book.available < 1) {
      return { success: false, error: { message: 'Book not available' } }
    }
    
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 14)
    
    const transaction = {
      id: Date.now(),
      ...data,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      returnDate: null,
      status: 'Issued',
    }
    transactions.push(transaction)
    
    const bookIndex = books.findIndex(b => b.id === data.bookId)
    books[bookIndex].available--
    
    const memberIndex = members.findIndex(m => m.id === data.memberId)
    members[memberIndex].booksIssued++
    
    return { success: true, data: transaction }
  },

  async returnBook(transactionId) {
    await delay(400)
    const index = transactions.findIndex(t => t.id === transactionId)
    if (index === -1) return { success: false, error: { message: 'Transaction not found' } }
    
    transactions[index] = {
      ...transactions[index],
      returnDate: new Date().toISOString().split('T')[0],
      status: 'Returned',
    }
    
    const bookIndex = books.findIndex(b => b.id === transactions[index].bookId)
    books[bookIndex].available++
    
    const memberIndex = members.findIndex(m => m.id === transactions[index].memberId)
    members[memberIndex].booksIssued--
    
    return { success: true, data: transactions[index] }
  },

  async getDashboardStats() {
    await delay(400)
    return {
      success: true,
      data: {
        totalBooks: books.reduce((acc, b) => acc + b.copies, 0),
        availableBooks: books.reduce((acc, b) => acc + b.available, 0),
        totalMembers: members.length,
        issuedBooks: transactions.filter(t => t.status === 'Issued').length,
        overdueBooks: transactions.filter(t => t.status === 'Overdue').length,
        todayReturns: 3,
      }
    }
  },

  async getOverdueList() {
    await delay(500)
    const overdue = transactions
      .filter(t => t.status === 'Issued' || t.status === 'Overdue')
      .map(t => {
        const member = members.find(m => m.id === t.memberId)
        const book = books.find(b => b.id === t.bookId)
        const dueDate = new Date(t.dueDate)
        const today = new Date()
        const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24))
        return {
          ...t,
          memberName: member?.name,
          bookTitle: book?.title,
          daysOverdue: daysOverdue > 0 ? daysOverdue : 0,
        }
      })
      .filter(t => t.daysOverdue > 0)
    return { success: true, data: overdue }
  },

  async getCategories() {
    return {
      success: true,
      data: ['Fiction', 'Non-Fiction', 'Science', 'Mathematics', 'History', 'Biography', 'Reference', 'Periodicals']
    }
  },
}

export default libraryService
