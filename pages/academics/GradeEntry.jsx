import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, ArrowDownOnSquareIcon } from '@heroicons/react/24/outline'
import { useToast } from '../../components/Toast'
import academicService from '../../services/academic.service'
import studentService from '../../services/student.service'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Modal from '../../components/Modal'
import FormField from '../../components/FormField'

const GradeEntry = () => {
  const toast = useToast()
  const [exams, setExams] = useState([])
  const [selectedExam, setSelectedExam] = useState(null)
  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editedGrades, setEditedGrades] = useState({})

  useEffect(() => {
    fetchExams()
  }, [])

  useEffect(() => {
    if (selectedExam) {
      fetchGrades()
    }
  }, [selectedExam])

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

  const fetchGrades = async () => {
    try {
      const response = await academicService.grades.getByExam(selectedExam.id)
      if (response.success) {
        setGrades(response.data)
        const initial = {}
        response.data.forEach(g => {
          initial[g.id] = { score: g.score, grade: g.grade, remarks: g.remarks }
        })
        setEditedGrades(initial)
      }
    } catch (error) {
      toast.error('Failed to load grades')
    }
  }

  const handleScoreChange = (gradeId, field, value) => {
    setEditedGrades(prev => ({
      ...prev,
      [gradeId]: { ...prev[gradeId], [field]: value }
    }))
  }

  const calculateGrade = (score, maxScore) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 90) return 'A+'
    if (percentage >= 80) return 'A'
    if (percentage >= 70) return 'B+'
    if (percentage >= 60) return 'B'
    if (percentage >= 50) return 'C'
    if (percentage >= 40) return 'D'
    return 'F'
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const updates = grades.map(g => ({
        id: g.id,
        score: editedGrades[g.id]?.score ?? g.score,
        grade: editedGrades[g.id]?.grade ?? g.grade,
        remarks: editedGrades[g.id]?.remarks ?? g.remarks
      }))
      
      for (const grade of updates) {
        await academicService.grades.update(grade.id, grade)
      }
      
      toast.success('Grades saved successfully')
      fetchGrades()
    } catch (error) {
      toast.error('Failed to save grades')
    } finally {
      setSaving(false)
    }
  }

  const handleAddStudent = async (studentName, score) => {
    if (!selectedExam || !studentName || !score) return
    try {
      const grade = calculateGrade(parseInt(score), selectedExam.totalMarks)
      const response = await academicService.grades.create({
        examId: selectedExam.id,
        studentId: `STU${Date.now()}`,
        studentName,
        subject: selectedExam.subject,
        score: parseInt(score),
        maxScore: selectedExam.totalMarks,
        grade,
        remarks: ''
      })
      if (response.success) {
        toast.success('Student grade added')
        fetchGrades()
      }
    } catch (error) {
      toast.error('Failed to add grade')
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Grade Entry</h1>
          <p className="text-sm text-gray-500 mt-0.5">Enter and manage exam results</p>
        </div>
        {selectedExam && grades.length > 0 && (
            <Button onClick={handleSave} loading={saving}>
            <ArrowDownOnSquareIcon className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        )}
      </div>

      <Card>
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Exam</label>
            <select
              value={selectedExam?.id || ''}
              onChange={(e) => {
                const exam = exams.find(ex => ex.id === parseInt(e.target.value))
                setSelectedExam(exam || null)
              }}
              className="input-field"
            >
              <option value="">Select an exam...</option>
              {exams.map(exam => (
                <option key={exam.id} value={exam.id}>
                  {exam.name} - {exam.class} ({exam.subject})
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedExam && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Class:</span>
                <span className="ml-2 font-medium">{selectedExam.class}</span>
              </div>
              <div>
                <span className="text-gray-500">Subject:</span>
                <span className="ml-2 font-medium">{selectedExam.subject}</span>
              </div>
              <div>
                <span className="text-gray-500">Date:</span>
                <span className="ml-2 font-medium">{new Date(selectedExam.date).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-500">Total Marks:</span>
                <span className="ml-2 font-medium">{selectedExam.totalMarks}</span>
              </div>
            </div>
          </div>
        )}

        {selectedExam && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Roll No</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Student Name</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-gray-500">Score</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-gray-500">Grade</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {grades.map(grade => (
                  <tr key={grade.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-500">{grade.studentId}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{grade.studentName}</td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        value={editedGrades[grade.id]?.score ?? grade.score}
                        onChange={(e) => {
                          const newScore = parseInt(e.target.value) || 0
                          handleScoreChange(grade.id, 'score', newScore)
                          handleScoreChange(grade.id, 'grade', calculateGrade(newScore, grade.maxScore))
                        }}
                        className="input-field w-20 text-center"
                        min="0"
                        max={grade.maxScore}
                      />
                      <span className="text-sm text-gray-400 ml-1">/ {grade.maxScore}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={
                        grade.grade.startsWith('A') ? 'success' :
                        grade.grade.startsWith('B') ? 'primary' :
                        grade.grade.startsWith('C') ? 'warning' : 'danger'
                      }>
                        {editedGrades[grade.id]?.grade ?? grade.grade}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={editedGrades[grade.id]?.remarks ?? grade.remarks}
                        onChange={(e) => handleScoreChange(grade.id, 'remarks', e.target.value)}
                        className="input-field"
                        placeholder="Add remarks..."
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {grades.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No grade entries yet</p>
              </div>
            )}
          </div>
        )}

        {!selectedExam && (
          <div className="text-center py-12">
            <p className="text-gray-500">Select an exam to view or enter grades</p>
          </div>
        )}
      </Card>
    </div>
  )
}

export default GradeEntry
