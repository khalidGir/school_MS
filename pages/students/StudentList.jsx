import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  PlusIcon, MagnifyingGlassIcon, FunnelIcon, PencilIcon, 
  TrashIcon, EyeIcon, DocumentArrowDownIcon, UserPlusIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline'
import { useToast } from '../../components/Toast'
import studentService from '../../services/student.service'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import DataTable from '../../components/DataTable'
import Modal from '../../components/Modal'
import StudentFilters from './StudentFilters'

const StudentList = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRows, setSelectedRows] = useState([])
  const [filters, setFilters] = useState({ search: '', grade: 'all', status: 'all', section: 'all' })
  const [showFilters, setShowFilters] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })

  useEffect(() => {
    fetchStudents()
  }, [filters, pagination.page])

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const response = await studentService.getAll({
        ...filters,
        page: pagination.page,
        limit: 10
      })
      if (response.success) {
        setStudents(response.data.students)
        setPagination({
          page: response.data.page,
          totalPages: response.data.totalPages,
          total: response.data.total
        })
      }
    } catch (error) {
      toast.error('Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleDelete = async () => {
    try {
      const response = await studentService.delete(deleteId)
      if (response.success) {
        toast.success('Student deleted successfully')
        fetchStudents()
      } else {
        toast.error(response.error?.message || 'Failed to delete student')
      }
    } catch (error) {
      toast.error('Failed to delete student')
    }
    setShowDeleteModal(false)
    setDeleteId(null)
  }

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedRows.map(id => studentService.delete(id)))
      toast.success(`${selectedRows.length} students deleted`)
      setSelectedRows([])
      fetchStudents()
    } catch (error) {
      toast.error('Failed to delete students')
    }
    setShowDeleteModal(false)
  }

  const handleExport = () => {
    const csv = [
      ['Student ID', 'Name', 'Grade', 'Section', 'Parent', 'Email', 'Status'].join(','),
      ...students.map(s => [s.studentId, s.name, s.grade, s.section, s.parentName, s.parentEmail, s.status].join(','))
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'students.csv'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Export completed')
  }

  const columns = [
    { key: 'studentId', label: 'ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true, render: (val, row) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">
          {row.name.split(' ').map(n => n[0]).join('')}
        </div>
        <span className="font-medium">{val}</span>
      </div>
    )},
    { key: 'grade', label: 'Grade', sortable: true },
    { key: 'section', label: 'Section' },
    { key: 'parentName', label: 'Parent' },
    { key: 'attendance', label: 'Attendance', sortable: true, render: (val) => (
      <div className="flex items-center gap-2">
        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${val >= 90 ? 'bg-[#2c7a4d]' : val >= 75 ? 'bg-[#b45309]' : 'bg-[#c73e2c]'}`}
            style={{ width: `${val}%` }}
          />
        </div>
        <span className="text-xs text-gray-500">{val}%</span>
      </div>
    )},
    { key: 'paymentStatus', label: 'Payment', render: (val) => (
      <Badge variant={val === 'Paid' ? 'success' : val === 'Partial' ? 'warning' : 'danger'}>{val}</Badge>
    )},
    { key: 'status', label: 'Status', render: (val) => (
      <Badge variant={val === 'Active' ? 'primary' : 'default'}>{val}</Badge>
    )},
    { key: 'actions', label: '', width: '80px', render: (_, row) => (
      <div className="relative">
        <button 
          onClick={(e) => {
            e.stopPropagation()
            setDeleteId(row.id)
            setShowDeleteModal(true)
          }}
          className="p-1.5 text-gray-400 hover:text-[#c73e2c] hover:bg-[#fee2e2] rounded"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    )}
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Students</h1>
          <p className="text-sm text-gray-500 mt-0.5">{pagination.total} total students</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={handleExport}>
            <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Link to="/students/new">
            <Button>
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </Link>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input-field pl-9"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={filters.grade}
                onChange={(e) => handleFilterChange('grade', e.target.value)}
                className="input-field w-auto"
              >
                <option value="all">All Grades</option>
                {studentService.getGradesList().map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="input-field w-auto"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              {selectedRows.length > 0 && (
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete Selected ({selectedRows.length})
                </Button>
              )}
            </div>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={students}
          loading={loading}
          pagination={true}
          pageSize={10}
          selectable={true}
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          searchPlaceholder="Search by name, ID, or parent..."
          onRowClick={(row) => navigate(`/students/${row.id}`)}
        />
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setDeleteId(null); }}
        title="Delete Student"
        size="sm"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => { setShowDeleteModal(false); setDeleteId(null); }}>
              Cancel
            </Button>
            <Button variant="danger" onClick={deleteId ? handleDelete : handleBulkDelete}>
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-gray-600">
          {deleteId && !selectedRows.length 
            ? 'Are you sure you want to delete this student? This action cannot be undone.'
            : `Are you sure you want to delete ${selectedRows.length || 1} student(s)? This action cannot be undone.`
          }
        </p>
      </Modal>
    </div>
  )
}

export default StudentList
