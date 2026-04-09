import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon, CalendarIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { useToast } from '../../components/Toast'
import academicService from '../../services/academic.service'
import studentService from '../../services/student.service'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Modal from '../../components/Modal'
import FormField from '../../components/FormField'

const ExamSchedule = () => {
  const toast = useToast()
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingExam, setEditingExam] = useState(null)
  const [formData, setFormData] = useState({
    name: '', class: '', subject: '', date: '', time: '', room: '', totalMarks: 100
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchExams()
  }, [])

  const fetchExams = async () => {
    try {
      const response = await academicService.exams.getAll()
      if (response.success) setExams(response.data)
    } catch (error) {
      toast.error('Failed to load exams')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (exam = null) => {
    if (exam) {
      setEditingExam(exam)
      setFormData({ ...exam })
    } else {
      setEditingExam(null)
      setFormData({ name: '', class: '', subject: '', date: '', time: '', room: '', totalMarks: 100 })
    }
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!formData.name || !formData.class || !formData.subject || !formData.date) {
      toast.error('Please fill in all required fields')
      return
    }
    setSaving(true)
    try {
      const response = editingExam
        ? await academicService.exams.update(editingExam.id, formData)
        : await academicService.exams.create(formData)
      if (response.success) {
        toast.success(`Exam ${editingExam ? 'updated' : 'scheduled'} successfully`)
        setShowModal(false)
        fetchExams()
      } else {
        toast.error(response.error?.message || 'Failed to save exam')
      }
    } catch (error) {
      toast.error('Failed to save exam')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await academicService.exams.delete(id)
      if (response.success) {
        toast.success('Exam deleted')
        fetchExams()
      }
    } catch (error) {
      toast.error('Failed to delete exam')
    }
  }

  const getStatusBadge = (exam) => {
    const examDate = new Date(exam.date)
    const today = new Date()
    if (examDate < today) return <Badge variant="default">Completed</Badge>
    if (examDate.toDateString() === today.toDateString()) return <Badge variant="warning">Today</Badge>
    return <Badge variant="success">Scheduled</Badge>
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Exam Schedule</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage examination timetables</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Schedule Exam
        </Button>
      </div>

      <Card>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton h-20 w-full rounded" />
            ))}
          </div>
        ) : exams.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No exams scheduled</p>
            <Button variant="secondary" onClick={() => handleOpenModal()} className="mt-4">
              Schedule First Exam
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {exams.map(exam => (
              <div key={exam.id} className="p-4 border border-gray-200 rounded-lg hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{exam.name}</h3>
                      {getStatusBadge(exam)}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Badge variant="primary">{exam.class}</Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>{exam.subject}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{new Date(exam.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>{exam.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPinIcon className="w-4 h-4" />
                        <span>{exam.room}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">|</span>
                        <span className="ml-2">Total Marks: {exam.totalMarks}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleOpenModal(exam)}
                      className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(exam.id)}
                      className="p-1.5 text-gray-400 hover:text-[#c73e2c] hover:bg-[#fee2e2] rounded"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingExam ? 'Edit Exam' : 'Schedule New Exam'}
        size="md"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>
              {editingExam ? 'Update' : 'Schedule'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <FormField
            label="Exam Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Mid-Term Examination"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Class"
              type="select"
              value={formData.class}
              onChange={(e) => setFormData(prev => ({ ...prev, class: e.target.value }))}
              options={studentService.getGradesList().map(g => ({ value: g, label: g }))}
              required
            />
            <FormField
              label="Subject"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="e.g., Mathematics"
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <FormField
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
            <FormField
              label="Time"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              placeholder="09:00 AM - 11:00 AM"
              required
            />
            <FormField
              label="Room"
              value={formData.room}
              onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
              placeholder="Room 101"
              required
            />
          </div>
          <FormField
            label="Total Marks"
            type="number"
            value={formData.totalMarks}
            onChange={(e) => setFormData(prev => ({ ...prev, totalMarks: parseInt(e.target.value) || 100 }))}
          />
        </div>
      </Modal>
    </div>
  )
}

export default ExamSchedule
