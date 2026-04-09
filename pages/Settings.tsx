import { useState, useEffect, useRef } from 'react'
import { PhotoIcon } from '@heroicons/react/24/outline'
import { useApp } from '../context/AppContext'
import { useToast } from '../components/Toast'

function Settings() {
  const { settings, updateSettings, uploadLogo } = useApp()
  const toast = useToast()

  const [schoolName, setSchoolName] = useState('')
  const [tuition, setTuition] = useState('')
  const [reminderTemplate, setReminderTemplate] = useState('')
  const [logo, setLogo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [errors, setErrors] = useState({})
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (settings) {
      setSchoolName(settings.schoolName || '')
      setTuition(settings.tuition?.toString() || '7000')
      setReminderTemplate(settings.reminderTemplate || '')
      setLogo(settings.logo || null)
      setLoading(false)
    }
  }, [settings])

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Logo file must be less than 2MB')
        return
      }
      const reader = new FileReader()
      reader.onload = (event) => {
        setLogo({ file, preview: event.target.result })
        setHasChanges(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveLogo = () => {
    setLogo(null)
    setHasChanges(true)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!schoolName.trim()) {
      newErrors.schoolName = 'School name is required'
    }
    
    const tuitionNum = parseFloat(tuition)
    if (isNaN(tuitionNum) || tuitionNum < 0) {
      newErrors.tuition = 'Please enter a valid tuition amount'
    }
    
    if (!reminderTemplate.trim()) {
      newErrors.reminderTemplate = 'Reminder template is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    setSaving(true)

    try {
      // Upload logo if changed
      if (logo && typeof logo === 'object' && logo.file) {
        await uploadLogo(logo.file)
      }

      // Update settings
      await updateSettings({
        schoolName: schoolName.trim(),
        tuitionAmount: parseFloat(tuition),
        reminderTemplate: reminderTemplate.trim(),
      })

      setHasChanges(false)
      toast.success('Settings saved successfully!')
    } catch (error) {
      toast.error(error.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (setter) => (e) => {
    setter(e.target.value)
    setHasChanges(true)
    setErrors({})
  }

  if (loading) {
    return (
      <div className="space-y-6 lg:max-w-2xl">
        <div>
          <div className="skeleton h-8 w-32 mb-2"></div>
          <div className="skeleton h-4 w-48"></div>
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg p-6 card-shadow">
            <div className="skeleton h-5 w-32 mb-4"></div>
            <div className="space-y-4">
              <div className="skeleton h-10 w-full"></div>
              <div className="skeleton h-10 w-full"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6 lg:max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your school profile and preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200/50 p-6">
          <h3 className="text-base font-medium text-gray-900 mb-4">School Profile</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                School Name <span className="text-[#c73e2c]">*</span>
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={handleChange(setSchoolName)}
                className={`input-field ${errors.schoolName ? 'border-[#c73e2c] focus:ring-[#c73e2c]/20 focus:border-[#c73e2c]' : ''}`}
                placeholder="Enter school name"
              />
              {errors.schoolName && (
                <p className="text-xs text-[#c73e2c] mt-1">{errors.schoolName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">School Logo</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
                  {logo && (logo.preview || typeof logo === 'string') ? (
                    <img src={logo.preview || logo} alt="School logo" className="w-full h-full object-cover" />
                  ) : (
                    <PhotoIcon className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="btn-secondary cursor-pointer"
                  >
                    Upload Logo
                  </label>
                  {logo && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="btn-danger"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Recommended: 200x200px, max 2MB</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200/50 p-6">
          <h3 className="text-base font-medium text-gray-900 mb-4">Tuition Configuration</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Default Tuition Amount <span className="text-[#c73e2c]">*</span>
            </label>
            <div className="relative max-w-[200px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={tuition}
                onChange={handleChange(setTuition)}
                min="0"
                step="0.01"
                className={`input-field pl-7 ${errors.tuition ? 'border-[#c73e2c] focus:ring-[#c73e2c]/20 focus:border-[#c73e2c]' : ''}`}
              />
            </div>
            {errors.tuition && (
              <p className="text-xs text-[#c73e2c] mt-1">{errors.tuition}</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200/50 p-6">
          <h3 className="text-base font-medium text-gray-900 mb-4">Reminder Template</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email Template <span className="text-[#c73e2c]">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Available placeholders: <code className="bg-gray-100 px-1 rounded">{'{student_name}'}</code>, <code className="bg-gray-100 px-1 rounded">{'{balance}'}</code>
            </p>
            <textarea
              value={reminderTemplate}
              onChange={handleChange(setReminderTemplate)}
              rows={6}
              className={`input-field resize-none ${errors.reminderTemplate ? 'border-[#c73e2c] focus:ring-[#c73e2c]/20 focus:border-[#c73e2c]' : ''}`}
              placeholder="Enter your reminder email template..."
            />
            {errors.reminderTemplate && (
              <p className="text-xs text-[#c73e2c] mt-1">{errors.reminderTemplate}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          {hasChanges && (
            <p className="text-sm text-amber-600">
              You have unsaved changes
            </p>
          )}
          <div className="ml-auto flex gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="btn-secondary"
              disabled={saving}
            >
              Reset
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={saving || (!hasChanges && Object.keys(errors).length === 0)}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Settings
