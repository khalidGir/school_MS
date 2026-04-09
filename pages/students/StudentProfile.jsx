import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeftIcon, PencilIcon, EnvelopeIcon, PhoneIcon, 
  MapPinIcon, CalendarIcon, UserIcon, BanknotesIcon,
  CheckCircleIcon, ClockIcon, ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { useToast } from '../../components/Toast'
import studentService from '../../services/student.service'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import Card from '../../components/Card'
import Tabs from '../../components/Tabs'

const StudentProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [attendance, setAttendance] = useState([])
  const [grades, setGrades] = useState([])
  const [payments, setPayments] = useState([])

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
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="font-medium text-gray-900 mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <UserIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Full Name</p>
                  <p className="text-sm font-medium">{student.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CalendarIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Date of Birth</p>
                  <p className="text-sm font-medium">{new Date(student.dateOfBirth).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <UserIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Gender</p>
                  <p className="text-sm font-medium">{student.gender}</p>
                </div>
              </div>
            </div>
          </Card>
          <Card>
            <h3 className="font-medium text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <UserIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Parent/Guardian</p>
                  <p className="text-sm font-medium">{student.parentName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium">{student.parentEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <PhoneIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium">{student.parentPhone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPinIcon className="w-5 h-5 text-gray-400" />
                <div>
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
      content: (
        <Card>
          <h3 className="font-medium text-gray-900 mb-4">Payment History</h3>
          {payments.length === 0 ? (
            <p className="text-gray-500 text-sm">No payment records found</p>
          ) : (
            <div className="space-y-3">
              {payments.map(payment => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{new Date(payment.date).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500">{payment.method} - {payment.reference}</p>
                  </div>
                  <p className="text-lg font-semibold text-[#2c7a4d]">${payment.amount.toLocaleString()}</p>
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
      content: (
        <Card>
          <h3 className="font-medium text-gray-900 mb-4">Recent Attendance</h3>
          <div className="grid grid-cols-7 gap-2">
            {attendance.slice(-14).map((record, i) => (
              <div key={i} className="text-center">
                <p className="text-xs text-gray-500 mb-1">{new Date(record.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                <div className={`w-full h-8 rounded flex items-center justify-center text-xs font-medium ${
                  record.status === 'Present' ? 'bg-[#e8f5e9] text-[#2c7a4d]' :
                  record.status === 'Late' ? 'bg-[#fef4e6] text-[#b45309]' :
                  'bg-[#fee2e2] text-[#c73e2c]'
                }`}>
                  {record.status === 'Present' ? 'P' : record.status === 'Late' ? 'L' : 'A'}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )
    },
    {
      id: 'grades',
      label: 'Grades',
      content: (
        <Card>
          <h3 className="font-medium text-gray-900 mb-4">Academic Records</h3>
          {grades.length === 0 ? (
            <p className="text-gray-500 text-sm">No grade records found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
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
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/students')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-900">Student Profile</h1>
        </div>
        <Button variant="secondary" onClick={() => navigate(`/students/${id}/edit`)}>
          <PencilIcon className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-semibold mb-4">
              {student.name.split(' ').map(n => n[0]).join('')}
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{student.name}</h2>
            <p className="text-sm text-gray-500">{student.studentId}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="primary">{student.grade}-{student.section}</Badge>
              <Badge variant={student.status === 'Active' ? 'success' : 'default'}>{student.status}</Badge>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Attendance Rate</span>
              <span className={`text-sm font-medium ${student.attendance >= 90 ? 'text-[#2c7a4d]' : 'text-[#b45309]'}`}>
                {student.attendance}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${student.attendance >= 90 ? 'bg-[#2c7a4d]' : 'bg-[#b45309]'}`}
                style={{ width: `${student.attendance}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Payment Status</span>
              <Badge variant={student.paymentStatus === 'Paid' ? 'success' : student.paymentStatus === 'Partial' ? 'warning' : 'danger'}>
                {student.paymentStatus}
              </Badge>
            </div>
          </div>
        </Card>

        <div className="lg:col-span-2">
          <Tabs tabs={tabs} defaultTab={0} variant="underline" />
        </div>
      </div>
    </div>
  )
}

export default StudentProfile
