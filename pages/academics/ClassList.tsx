import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon, UsersIcon } from '@heroicons/react/24/outline'
import { useToast } from '../../components/Toast'
import academicService from '../../services/academic.service'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Modal from '../../components/Modal'
import FormField from '../../components/FormField'

const ClassList = () => {
  const toast = useToast()
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingClass, setEditingClass] = useState(null)
  const [formData, setFormData] = useState({ name: '', sections: [], capacity: 30, subjects: [] })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      const response = await academicService.classes.getAll()
      if (response.success) setClasses(response.data)
    } catch (error) {
      toast.error('Failed to load classes')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (cls = null) => {
    if (cls) {
      setEditingClass(cls)
      setFormData({ name: cls.name, sections: cls.sections, capacity: cls.capacity, subjects: cls.subjects })
    } else {
      setEditingClass(null)
      setFormData({ name: '', sections: ['A'], capacity: 30, subjects: [] })
    }
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!formData.name) {
      toast.error('Class name is required')
      return
    }
    setSaving(true)
    try {
      const response = editingClass
        ? await academicService.classes.update(editingClass.id, formData)
        : await academicService.classes.create(formData)
      if (response.success) {
        toast.success(`Class ${editingClass ? 'updated' : 'created'} successfully`)
        setShowModal(false)
        fetchClasses()
      } else {
        toast.error(response.error?.message || 'Failed to save class')
      }
    } catch (error) {
      toast.error('Failed to save class')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await academicService.classes.delete(id)
      if (response.success) {
        toast.success('Class deleted')
        fetchClasses()
      }
    } catch (error) {
      toast.error('Failed to delete class')
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Classes</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage classes and sections</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Class
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <Card key={i}>
              <div className="skeleton h-32 w-full" />
            </Card>
          ))
        ) : (
          classes.map(cls => (
            <Card key={cls.id} hover onClick={() => handleOpenModal(cls)}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{cls.name}</h3>
                  <p className="text-sm text-gray-500">{cls.sections.length} Sections</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <UsersIcon className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm">
                  <span className="text-gray-500">Enrolled:</span>
                  <span className="font-medium ml-1">{cls.enrolled}/{cls.capacity * cls.sections.length}</span>
                </div>
                <Badge variant={cls.enrolled >= cls.capacity * cls.sections.length ? 'warning' : 'success'}>
                  {Math.round((cls.enrolled / (cls.capacity * cls.sections.length)) * 100)}% Full
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                {cls.sections.map(section => (
                  <Badge key={section} variant="primary">Section {section}</Badge>
                ))}
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleOpenModal(cls); }}>
                  <PencilIcon className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(cls.id); }}>
                  <TrashIcon className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingClass ? 'Edit Class' : 'Add New Class'}
        size="md"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>Save</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <FormField
            label="Class Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Grade 5"
            required
          />
          <FormField
            label="Sections"
            value={formData.sections.join(', ')}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              sections: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
            }))}
            placeholder="A, B, C (comma separated)"
            helpText="Enter sections separated by commas"
          />
          <FormField
            label="Capacity per Section"
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 30 }))}
          />
        </div>
      </Modal>
    </div>
  )
}

export default ClassList
