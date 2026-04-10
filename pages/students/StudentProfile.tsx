import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeftIcon, PencilIcon,
  CheckCircleIcon, ClockIcon, ExclamationTriangleIcon,
  UserIcon, CalendarIcon, BanknotesIcon
} from '@heroicons/react/24/outline'
import { useToast } from '../../components/Toast'
import studentService from '../../services/student.service'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import Card from '../../components/Card'
import Tabs from '../../components/Tabs'
import StudentCard from '../../components/StudentCard'

const StudentProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [student, setStudent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [attendance, setAttendance] = useState<any[]>([])
  const [grades, setGrades] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])

  useEffect(() => {
    fetchStudent()
    fetchAttendance()
    fetchGrades()
    fetchPayments()
  }, [id])

  const fetchStudent = async () => {
    try {
      const response = await studentService.getById(id)
      if (response.success) {
        setStudent(response.data)
      } else {
        toast.error('Student not found')
        navigate('/students')
      }
    } catch (error) {
      toast.error('Failed to load student')
    } finally {
      setLoading(false)
    }
  }

  const fetchAttendance = async () => {
    try {
      const response = await studentService.getAttendance(id)
      if (response.success) setAttendance(response.data)
    } catch (error) {
      console.error('Failed to load attendance')
    }
  }

  const fetchGrades = async () => {
    try {
      const response = await studentService.getGrades(id)
      if (response.success) setGrades(response.data)
    } catch (error) {
      console.error('Failed to load grades')
    }
  }

  const fetchPayments = async () => {
    try {
      const response = await studentService.getPayments(id)
      if (response.success) setPayments(response.data)
    } catch (error) {
      console.error('Failed to load payments')
    }
  }

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="skeleton h-8 w-32" />
        <div className="card">
          <div className="flex items-center gap-4 mb-6">
            <div className="skeleton w-20 h-20 rounded-full" />
            <div className="space-y-2">
              <div className="skeleton h-6 w-48" />
              <div className="skeleton h-4 w-32" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!student) return null

  const tabs = [
    {
      id: 'info',
      label: 'Information',
      icon: UserIcon,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <Card>
            <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-primary" />
              Personal Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <UserIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Full Name</p>
                  <p className="text-sm font-medium truncate">{student.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Date of Birth</p>
                  <p className="text-sm font-medium">{new Date(student.dateOfBirth).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <UserIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Gender</p>
                  <p className="text-sm font-medium">{student.gender}</p>
                </div>
              </div>
            </div>
          </Card>
          <Card>
            <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <BanknotesIcon className="w-5 h-5 text-primary" />
              Contact Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <UserIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Parent/Guardian</p>
                  <p className="text-sm font-medium truncate">{student.parentName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <UserIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium truncate">{student.parentEmail}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <UserIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium truncate">{student.parentPhone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <UserIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="text-sm font-medium">{student.address}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: BanknotesIcon,
      count: payments.length,
      content: (
        <Card>
          <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <BanknotesIcon className="w-5 h-5 text-primary" />
            Payment History
          </h3>
          {payments.length === 0 ? (
            <p className="text-gray-500 text-sm">No payment records found</p>
          ) : (
            <div className="space-y-3">
              {payments.map(payment => (
                <div key={payment.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{new Date(payment.date).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500 truncate">{payment.method} - {payment.reference}</p>
                  </div>
                  <p className="text-lg font-semibold text-[#2c7a4d] flex-shrink-0">${payment.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: CalendarIcon,
      count: attendance.length,
      content: (
        <Card>
          <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            Recent Attendance
          </h3>
          {attendance.length === 0 ? (
            <p className="text-gray-500 text-sm">No attendance records found</p>
          ) : (
            <>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {attendance.slice(-14).map((record, i) => (
                  <div key={i} className="text-center">
                    <p className="text-[10px] sm:text-xs text-gray-500 mb-1 truncate">{new Date(record.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                    <div className={`w-full h-8 sm:h-10 rounded-lg flex items-center justify-center text-xs font-medium ${
                      record.status === 'Present' ? 'bg-[#e8f5e9] text-[#2c7a4d]' :
                      record.status === 'Late' ? 'bg-[#fef4e6] text-[#b45309]' :
                      'bg-[#fee2e2] text-[#c73e2c]'
                    }`}>
                      {record.status === 'Present' ? 'P' : record.status === 'Late' ? 'L' : 'A'}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-[#e8f5e9]" />
                  <span>Present</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-[#fef4e6]" />
                  <span>Late</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-[#fee2e2]" />
                  <span>Absent</span>
                </div>
              </div>
            </>
          )}
        </Card>
      )
    },
    {
      id: 'grades',
      label: 'Grades',
      icon: CheckCircleIcon,
      count: grades.length,
      content: (
        <Card>
          <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-primary" />
            Academic Records
          </h3>
          {grades.length === 0 ? (
            <p className="text-gray-500 text-sm">No grade records found</p>
          ) : (
            <div className="table-responsive">
              <table className="w-full min-w-[400px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-xs font-medium text-gray-500">Subject</th>
                    <th className="text-left py-2 text-xs font-medium text-gray-500">Term</th>
                    <th className="text-right py-2 text-xs font-medium text-gray-500">Score</th>
                    <th className="text-center py-2 text-xs font-medium text-gray-500">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((grade, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-3 text-sm">{grade.subject}</td>
                      <td className="py-3 text-sm text-gray-500">{grade.term}</td>
                      <td className="py-3 text-sm text-right font-medium">{grade.score}/{grade.maxScore}</td>
                      <td className="py-3 text-center">
                        <Badge variant={grade.grade.startsWith('A') ? 'success' : grade.grade.startsWith('B') ? 'primary' : 'warning'}>
                          {grade.grade}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )
    }
  ]

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <button
          onClick={() => navigate('/students')}
          className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-gray-100 rounded-lg touch-target"
          aria-label="Back to students"
        >
          <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">Student Profile</h1>
        </div>
        <Button variant="secondary" onClick={() => navigate(`/students/${id}/edit`)} className="min-h-[44px] flex-shrink-0">
          <PencilIcon className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Edit</span>
        </Button>
      </div>

      {/* Futuristic Football Player Card */}
      <StudentCard
        student={student}
        attendance={attendance}
        grades={grades}
        payments={payments}
      />

      {/* Tabs */}
      <div className="mt-6">
        <Tabs tabs={tabs} defaultTab={0} variant="underline" />
      </div>
    </div>
  )
}

export default StudentProfile
