import { useState, useEffect } from 'react'
import { ArrowLeftIcon, CheckIcon, XMarkIcon, ClockIcon } from '@heroicons/react/24/outline'
import { useToast } from '../../components/Toast'
import attendanceService from '../../services/attendance.service'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Modal from '../../components/Modal'

const MarkAttendance = () => {
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [selectedClass, setSelectedClass] = useState(null)
  const [selectedSection, setSelectedSection] = useState('A')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({})
  const [summary, setSummary] = useState({})
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [saving, setSaving] = useState(false)

  const classes = attendanceService.getClasses()
  const sections = attendanceService.getSections()

  useEffect(() => {
    if (selectedClass) {
      fetchClassAttendance()
    } else {
      setLoading(false)
    }
  }, [selectedClass, selectedSection])

  const fetchClassAttendance = async () => {
    setLoading(true)
    try {
      const response = await attendanceService.getClassAttendance(selectedClass, selectedSection)
      if (response.success) {
        setStudents(response.data.students)
        setSummary(response.data.summary)
        const initialAttendance = {}
        response.data.students.forEach(s => {
          initialAttendance[s.id] = s.status
        })
        setAttendance(initialAttendance)
      }
    } catch (error) {
      toast.error('Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }))
  }

  const handleMarkAll = (status) => {
    const updated = {}
    students.forEach(s => { updated[s.id] = status })
    setAttendance(updated)
  }

  const getCounts = () => {
    const counts = { Present: 0, Absent: 0, Late: 0 }
    Object.values(attendance).forEach(status => {
      if (counts[status] !== undefined) counts[status]++
    })
    return counts
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const records = students.map(s => ({
        studentId: s.id,
        status: attendance[s.id]
      }))
      const response = await attendanceService.markAttendance(
        selectedClass,
        selectedSection,
        selectedDate,
        records
      )
      if (response.success) {
        toast.success(`Attendance marked for ${response.data.marked} students`)
        setShowConfirmModal(false)
      } else {
        toast.error('Failed to save attendance')
      }
    } catch (error) {
      toast.error('Failed to save attendance')
    } finally {
      setSaving(false)
    }
  }

  const counts = getCounts()

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-900">Mark Attendance</h1>
      </div>

      <Card>
        <div className="flex flex-wrap items-end gap-4 mb-6">
          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Class</label>
            <select
              value={selectedClass || ''}
              onChange={(e) => setSelectedClass(e.target.value || null)}
              className="input-field"
            >
              <option value="">Select Class</option>
              {classes.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="input-field"
              disabled={!selectedClass}
            >
              {sections.map(s => (
                <option key={s} value={s}>Section {s}</option>
              ))}
            </select>
          </div>
          <div className="w-40">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-field"
              disabled={!selectedClass}
            />
          </div>
        </div>

        {selectedClass && (
          <>
            <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#2c7a4d]" />
                  <span className="text-sm text-gray-600">Present: {counts.Present}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#b45309]" />
                  <span className="text-sm text-gray-600">Late: {counts.Late}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#c73e2c]" />
                  <span className="text-sm text-gray-600">Absent: {counts.Absent}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => handleMarkAll('Present')}>
                  All Present
                </Button>
                <Button size="sm" variant="secondary" onClick={() => handleMarkAll('Absent')}>
                  All Absent
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="skeleton h-16 w-full rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Roll No</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Student Name</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Present</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Late</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Absent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {students.map(student => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-500">{student.rollNumber}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{student.name}</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleStatusChange(student.id, 'Present')}
                            className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto transition-colors ${
                              attendance[student.id] === 'Present'
                                ? 'bg-[#2c7a4d] text-white'
                                : 'bg-gray-100 text-gray-400 hover:bg-[#e8f5e9]'
                            }`}
                          >
                            <CheckIcon className="w-5 h-5" />
                          </button>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleStatusChange(student.id, 'Late')}
                            className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto transition-colors ${
                              attendance[student.id] === 'Late'
                                ? 'bg-[#b45309] text-white'
                                : 'bg-gray-100 text-gray-400 hover:bg-[#fef4e6]'
                            }`}
                          >
                            <ClockIcon className="w-5 h-5" />
                          </button>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleStatusChange(student.id, 'Absent')}
                            className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto transition-colors ${
                              attendance[student.id] === 'Absent'
                                ? 'bg-[#c73e2c] text-white'
                                : 'bg-gray-100 text-gray-400 hover:bg-[#fee2e2]'
                            }`}
                          >
                            <XMarkIcon className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
              <Button onClick={() => setShowConfirmModal(true)} disabled={students.length === 0}>
                Save Attendance
              </Button>
            </div>
          </>
        )}

        {!selectedClass && (
          <div className="text-center py-12">
            <p className="text-gray-500">Select a class to mark attendance</p>
          </div>
        )}
      </Card>

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Attendance"
        size="sm"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saving}>
              Confirm & Save
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            You are about to mark attendance for <strong>{selectedClass} - Section {selectedSection}</strong> on <strong>{new Date(selectedDate).toLocaleDateString()}</strong>.
          </p>
          <div className="p-4 bg-gray-50 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Present</span>
              <span className="font-medium text-[#2c7a4d]">{counts.Present}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Late</span>
              <span className="font-medium text-[#b45309]">{counts.Late}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Absent</span>
              <span className="font-medium text-[#c73e2c]">{counts.Absent}</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default MarkAttendance
