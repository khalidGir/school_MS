import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeftIcon, ArrowRightIcon, CheckIcon,
  UserIcon, AcademicCapIcon, UserGroupIcon, DocumentTextIcon
} from '@heroicons/react/24/outline'
import { useToast } from '../../components/Toast'
import studentService from '../../services/student.service'
import Button from '../../components/Button'
import FormField from '../../components/FormField'
import Card from '../../components/Card'

const steps = [
  { id: 'personal', label: 'Personal Info', icon: UserIcon },
  { id: 'academic', label: 'Academic Info', icon: AcademicCapIcon },
  { id: 'parent', label: 'Parent Info', icon: UserGroupIcon },
  { id: 'review', label: 'Review', icon: DocumentTextIcon },
]

const AddStudent = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', gender: '', dateOfBirth: '',
    grade: '', section: '', rollNumber: '',
    parentName: '', parentEmail: '', parentPhone: '', address: ''
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateStep = (step) => {
    const newErrors = {}
    if (step === 0) {
      if (!formData.firstName) newErrors.firstName = 'First name is required'
      if (!formData.lastName) newErrors.lastName = 'Last name is required'
      if (!formData.gender) newErrors.gender = 'Gender is required'
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required'
    } else if (step === 1) {
      if (!formData.grade) newErrors.grade = 'Grade is required'
      if (!formData.section) newErrors.section = 'Section is required'
    } else if (step === 2) {
      if (!formData.parentName) newErrors.parentName = 'Parent name is required'
      if (!formData.parentEmail) newErrors.parentEmail = 'Parent email is required'
      if (!formData.parentPhone) newErrors.parentPhone = 'Parent phone is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`
      const response = await studentService.create({
        ...formData,
        name: fullName,
        grade: formData.grade,
        status: 'Active'
      })
      if (response.success) {
        toast.success('Student added successfully')
        navigate('/students')
      } else {
        toast.error(response.error?.message || 'Failed to add student')
      }
    } catch (error) {
      toast.error('Failed to add student')
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                required
              />
              <FormField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                required
              />
              <FormField
                label="Gender"
                name="gender"
                type="select"
                value={formData.gender}
                onChange={handleChange}
                options={[
                  { value: 'Male', label: 'Male' },
                  { value: 'Female', label: 'Female' },
                ]}
                error={errors.gender}
                required
              />
              <FormField
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                error={errors.dateOfBirth}
                required
              />
            </div>
          </div>
        )
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Grade"
                name="grade"
                type="select"
                value={formData.grade}
                onChange={handleChange}
                options={studentService.getGradesList().map(g => ({ value: g, label: g }))}
                error={errors.grade}
                required
              />
              <FormField
                label="Section"
                name="section"
                type="select"
                value={formData.section}
                onChange={handleChange}
                options={studentService.getSectionsList().map(s => ({ value: s, label: `Section ${s}` }))}
                error={errors.section}
                required
              />
              <FormField
                label="Roll Number"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                placeholder="e.g., 5A01"
              />
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Parent/Guardian Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Parent/Guardian Name"
                name="parentName"
                value={formData.parentName}
                onChange={handleChange}
                error={errors.parentName}
                required
              />
              <FormField
                label="Email Address"
                name="parentEmail"
                type="email"
                value={formData.parentEmail}
                onChange={handleChange}
                error={errors.parentEmail}
                required
              />
              <FormField
                label="Phone Number"
                name="parentPhone"
                type="tel"
                value={formData.parentPhone}
                onChange={handleChange}
                error={errors.parentPhone}
                required
              />
              <div className="md:col-span-2">
                <FormField
                  label="Address"
                  name="address"
                  type="textarea"
                  value={formData.address}
                  onChange={handleChange}
                  rows={2}
                />
              </div>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="font-medium text-gray-900">Review Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card padding>
                <h4 className="text-sm font-medium text-gray-500 mb-3">Personal Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Name:</span>
                    <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Gender:</span>
                    <span>{formData.gender || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date of Birth:</span>
                    <span>{formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : '-'}</span>
                  </div>
                </div>
              </Card>
              <Card padding>
                <h4 className="text-sm font-medium text-gray-500 mb-3">Academic Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Grade:</span>
                    <span>{formData.grade || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Section:</span>
                    <span>{formData.section ? `Section ${formData.section}` : '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Roll Number:</span>
                    <span>{formData.rollNumber || '-'}</span>
                  </div>
                </div>
              </Card>
              <Card padding className="md:col-span-2">
                <h4 className="text-sm font-medium text-gray-500 mb-3">Parent/Guardian Information</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 block">Name:</span>
                    <span className="font-medium">{formData.parentName || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Email:</span>
                    <span>{formData.parentEmail || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Phone:</span>
                    <span>{formData.parentPhone || '-'}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/students')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Add New Student</h1>
          <p className="text-sm text-gray-500">Step {currentStep + 1} of {steps.length}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              index < currentStep ? 'bg-[#2c7a4d] text-white' :
              index === currentStep ? 'bg-primary text-white' :
              'bg-gray-100 text-gray-400'
            }`}>
              {index < currentStep ? (
                <CheckIcon className="w-5 h-5" />
              ) : (
                <step.icon className="w-5 h-5" />
              )}
            </div>
            <span className={`ml-2 text-sm font-medium hidden md:inline ${
              index <= currentStep ? 'text-gray-900' : 'text-gray-400'
            }`}>
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <div className={`w-12 md:w-24 h-0.5 mx-2 ${
                index < currentStep ? 'bg-[#2c7a4d]' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      <Card>
        {renderStepContent()}
        
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <Button 
            variant="secondary" 
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} loading={loading}>
              <CheckIcon className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}

export default AddStudent
