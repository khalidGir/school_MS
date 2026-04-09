import { useState, useEffect } from 'react'
import { DocumentArrowDownIcon, MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/outline'
import { useToast } from '../../components/Toast'
import studentService from '../../services/student.service'
import academicService from '../../services/academic.service'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Modal from '../../components/Modal'

const ReportCards = () => {
  const toast = useToast()
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [reportCard, setReportCard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGrade, setSelectedGrade] = useState('all')
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await studentService.getAll({ limit: 100 })
      if (response.success) setStudents(response.data.students)
    } catch (error) {
      toast.error('Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async (student) => {
    setSelectedStudent(student)
    setGenerating(true)
    try {
      const response = await academicService.reportCards.generate(student.studentId, 'Term 1')
      if (response.success) {
        setReportCard(response.data)
        setShowPreview(true)
      } else {
        toast.error('Failed to generate report card')
      }
    } catch (error) {
      toast.error('Failed to generate report card')
    } finally {
      setGenerating(false)
    }
  }

  const handleExport = () => {
    if (!reportCard) return
    const content = `
Report Card - ${selectedStudent?.name}
Generated: ${new Date().toLocaleDateString()}
Term: ${reportCard.term}

Subjects:
${reportCard.subjects.map(s => `${s.subject}: ${s.score}/${s.maxScore} (${s.percentage}%) - Grade: ${s.grade}`).join('\n')}

Overall Performance:
Total Score: ${reportCard.overall.totalScore}/${reportCard.overall.totalMax}
Percentage: ${reportCard.overall.percentage}%
`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Report_Card_${selectedStudent?.name.replace(/\s/g, '_')}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Report card exported')
  }

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGrade = selectedGrade === 'all' || s.grade === selectedGrade
    return matchesSearch && matchesGrade
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Report Cards</h1>
          <p className="text-sm text-gray-500 mt-0.5">Generate and view student report cards</p>
        </div>
        {reportCard && (
          <Button variant="secondary" onClick={handleExport}>
            <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
            Export
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <select
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
          className="input-field w-auto"
        >
          <option value="all">All Grades</option>
          {studentService.getGradesList().map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <h3 className="font-medium text-gray-900 mb-4">Select Student</h3>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="skeleton h-16 w-full rounded" />
              ))}
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredStudents.map(student => (
                <div
                  key={student.id}
                  onClick={() => !generating && handleGenerate(student)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedStudent?.id === student.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.studentId} - {student.grade}</p>
                    </div>
                    {selectedStudent?.id === student.id && generating && (
                      <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
                    )}
                  </div>
                </div>
              ))}
              {filteredStudents.length === 0 && (
                <p className="text-center text-gray-500 py-8">No students found</p>
              )}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="font-medium text-gray-900 mb-4">Report Card Preview</h3>
          {reportCard ? (
            <div className="space-y-4">
              <div className="text-center pb-4 border-b border-gray-200">
                <h4 className="text-lg font-semibold">School Report Card</h4>
                <p className="text-sm text-gray-500">{reportCard.term}</p>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  {selectedStudent?.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{selectedStudent?.name}</p>
                  <p className="text-sm text-gray-500">{selectedStudent?.studentId} - {selectedStudent?.grade}</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-gray-500">Subject</th>
                      <th className="text-center py-2 text-gray-500">Score</th>
                      <th className="text-center py-2 text-gray-500">%</th>
                      <th className="text-center py-2 text-gray-500">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {reportCard.subjects.map((subject, i) => (
                      <tr key={i}>
                        <td className="py-2 text-gray-900">{subject.subject}</td>
                        <td className="py-2 text-center">{subject.score}/{subject.maxScore}</td>
                        <td className="py-2 text-center">{subject.percentage}%</td>
                        <td className="py-2 text-center">
                          <Badge variant={
                            subject.grade.startsWith('A') ? 'success' :
                            subject.grade.startsWith('B') ? 'primary' :
                            subject.grade.startsWith('C') ? 'warning' : 'danger'
                          }>
                            {subject.grade}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-primary/5 rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-500">Total Score</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {reportCard.overall.totalScore}/{reportCard.overall.totalMax}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Percentage</p>
                    <p className="text-xl font-semibold text-gray-900">{reportCard.overall.percentage}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Overall</p>
                    <Badge variant={reportCard.overall.percentage >= 60 ? 'success' : 'danger'}>
                      {reportCard.overall.percentage >= 60 ? 'Pass' : 'Fail'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <DocumentArrowDownIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Select a student to preview their report card</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default ReportCards
