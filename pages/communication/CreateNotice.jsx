import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useToast } from '../../components/Toast'
import communicationService from '../../services/communication.service'
import SearchableSelect from '../../components/common/SearchableSelect'

function CreateNotice() {
  const navigate = useNavigate()
  const toast = useToast()
  const [types, setTypes] = useState([])
  const [audiences, setAudiences] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ title: '', content: '', type: '', audience: 'All' })

  useEffect(() => {
    loadOptions()
  }, [])

  const loadOptions = async () => {
    const [typesRes, audienceRes] = await Promise.all([
      communicationService.getNoticeTypes(),
      communicationService.getAudienceOptions(),
    ])
    if (typesRes.success) setTypes(typesRes.data)
    if (audienceRes.success) setAudiences(audienceRes.data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await communicationService.createNotice(formData)
      if (response.success) {
        toast.success('Notice created successfully')
        navigate('/communication')
      } else {
        toast.error(response.error?.message || 'Failed to create notice')
      }
    } catch {
      toast.error('Failed to create notice')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/communication')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-xl font-semibold text-gray-900">Create Notice</h2>
      </div>

      <form onSubmit={handleSubmit} className="card max-w-2xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input-field" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <SearchableSelect options={types.map(t => ({ value: t, label: t }))} value={formData.type} onChange={(val) => setFormData({ ...formData, type: val })} placeholder="Select type" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Audience *</label>
              <SearchableSelect options={audiences.map(a => ({ value: a, label: a }))} value={formData.audience} onChange={(val) => setFormData({ ...formData, audience: val })} placeholder="Select audience" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
            <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="input-field" rows={6} required />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={() => navigate('/communication')} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Publishing...' : 'Publish Notice'}</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CreateNotice
