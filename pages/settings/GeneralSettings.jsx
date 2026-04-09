import { useState, useEffect } from 'react'
import { useToast } from '../../components/Toast'
import { useApp } from '../../context/AppContext'
import FileUpload from '../../components/common/FileUpload'
import LoadingSpinner from '../../components/common/LoadingSpinner'

function GeneralSettings() {
  const { settings, updateSettings, uploadLogo } = useApp()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    schoolName: '',
    address: '',
    phone: '',
    email: '',
    academicYear: '',
    term1Start: '',
    term1End: '',
    term2Start: '',
    term2End: '',
  })

  useEffect(() => {
    if (settings) {
      setFormData({
        schoolName: settings.schoolName || '',
        address: settings.address || '',
        phone: settings.phone || '',
        email: settings.email || '',
        academicYear: settings.academicYear || '',
        term1Start: settings.term1Start || '',
        term1End: settings.term1End || '',
        term2Start: settings.term2Start || '',
        term2End: settings.term2End || '',
      })
    }
  }, [settings])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await updateSettings(formData)
      if (response.success) {
        toast.success('Settings updated successfully')
      } else {
        toast.error('Failed to update settings')
      }
    } catch {
      toast.error('Failed to update settings')
    } finally {
      setLoading(false)
    }
  }

  const handleLogoUpload = async (file) => {
    try {
      const response = await uploadLogo(file)
      if (response.success) {
        toast.success('Logo uploaded successfully')
      }
    } catch {
      toast.error('Failed to upload logo')
    }
  }

  if (!settings) return <LoadingSpinner text="Loading settings..." />

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">General Settings</h2>

      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">School Information</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
              <input type="text" value={formData.schoolName} onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
              <input type="text" value={formData.academicYear} onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })} className="input-field" placeholder="e.g., 2024-2025" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="input-field" rows={2} />
            </div>
          </div>

          <h4 className="text-sm font-medium text-gray-700 pt-4 border-t border-gray-200">Academic Terms</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Term 1 Start</label>
              <input type="date" value={formData.term1Start} onChange={(e) => setFormData({ ...formData, term1Start: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Term 1 End</label>
              <input type="date" value={formData.term1End} onChange={(e) => setFormData({ ...formData, term1End: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Term 2 Start</label>
              <input type="date" value={formData.term2Start} onChange={(e) => setFormData({ ...formData, term2Start: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Term 2 End</label>
              <input type="date" value={formData.term2End} onChange={(e) => setFormData({ ...formData, term2End: e.target.value })} className="input-field" />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default GeneralSettings
