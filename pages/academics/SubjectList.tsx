import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon, BookOpenIcon } from '@heroicons/react/24/outline'
import { useToast } from '../../components/Toast'
import academicService from '../../services/academic.service'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Modal from '../../components/Modal'
import FormField from '../../components/FormField'

const SubjectList = () => {
  const toast = useToast()
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingSubject, setEditingSubject] = useState(null)
  const [formData, setFormData] = useState({ name: '', code: '', classes: [], teachers: [], credits: 3 })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSubjects()
  }, [])

  const fetchSubjects = async () => {
    try {
      const response = await academicService.subjects.getAll()
      if (response.success) setSubjects(response.data)
    } catch (error) {
      toast.error('Failed to load subjects')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (subject = null) => {
    if (subject) {
      setEditingSubject(subject)
      setFormData({ 
        name: subject.name, 
        code: subject.code, 
        classes: subject.classes,
        teachers: subject.teachers,
        credits: subject.credits
      })
    } else {
      setEditingSubject(null)
      setFormData({ name: '', code: '', classes: [], teachers: [], credits: 3 })
    }
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!formData.name || !formData.code) {
      toast.error('Subject name and code are required')
      return
    }
    setSaving(true)
    try {
      const response = editingSubject
        ? await academicService.subjects.update(editingSubject.id, formData)
        : await academicService.subjects.create(formData)
      if (response.success) {
        toast.success(`Subject ${editingSubject ? 'updated' : 'created'} successfully`)
        setShowModal(false)
        fetchSubjects()
      } else {
        toast.error(response.error?.message || 'Failed to save subject')
      }
    } catch (error) {
      toast.error('Failed to save subject')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await academicService.subjects.delete(id)
      if (response.success) {
        toast.success('Subject deleted')
        fetchSubjects()
      }
    } catch (error) {
      toast.error('Failed to delete subject')
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Subjects</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage subjects and assignments</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Subject
        </Button>
      </div>

      <Card>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton h-16 w-full rounded" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 text-xs font-medium text-gray-500">Subject</th>
                  <th className="text-left py-3 text-xs font-medium text-gray-500">Code</th>
                  <th className="text-left py-3 text-xs font-medium text-gray-500">Classes</th>
                  <th className="text-left py-3 text-xs font-medium text-gray-500">Teachers</th>
                  <th className="text-center py-3 text-xs font-medium text-gray-500">Credits</th>
                  <th className="text-right py-3 text-xs font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {subjects.map(subject => (
                  <tr key={subject.id} className="hover:bg-gray-50">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                          <BookOpenIcon className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium text-gray-900">{subject.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-500">{subject.code}</td>
                    <td className="py-4">
                      <div className="flex flex-wrap gap-1">
                        {subject.classes.slice(0, 3).map(c => (
                          <Badge key={c} variant="default">{c}</Badge>
                        ))}
                        {subject.classes.length > 3 && (
                          <Badge variant="default">+{subject.classes.length - 3}</Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-500">{subject.teachers.join(', ')}</td>
                    <td className="py-4 text-center">
                      <Badge variant="primary">{subject.credits} Credits</Badge>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(subject)}
                          className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(subject.id)}
                          className="p-1.5 text-gray-400 hover:text-[#c73e2c] hover:bg-[#fee2e2] rounded"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingSubject ? 'Edit Subject' : 'Add New Subject'}
        size="lg"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>Save</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Subject Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Mathematics"
              required
            />
            <FormField
              label="Subject Code"
              value={formData.code}
              onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
              placeholder="e.g., MATH"
              required
            />
          </div>
          <FormField
            label="Assigned Classes"
            value={formData.classes.join(', ')}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              classes: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
            }))}
            placeholder="Grade 1, Grade 2, Grade 3 (comma separated)"
            helpText="Enter classes separated by commas"
          />
          <FormField
            label="Teachers"
            value={formData.teachers.join(', ')}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              teachers: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
            }))}
            placeholder="Mr. Smith, Ms. Johnson (comma separated)"
            helpText="Enter teacher names separated by commas"
          />
          <FormField
            label="Credits"
            type="number"
            value={formData.credits}
            onChange={(e) => setFormData(prev => ({ ...prev, credits: parseInt(e.target.value) || 3 }))}
          />
        </div>
      </Modal>
    </div>
  )
}

export default SubjectList
