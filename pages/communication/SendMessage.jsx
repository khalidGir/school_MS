import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useToast } from '../../components/Toast'
import communicationService from '../../services/communication.service'
import SearchableSelect from '../../components/common/SearchableSelect'

const recipientOptions = [
  { value: 'All Parents', label: 'All Parents' },
  { value: 'All Staff', label: 'All Staff' },
  { value: 'All Students', label: 'All Students' },
  { value: 'Grade 1 Parents', label: 'Grade 1 Parents' },
  { value: 'Grade 2 Parents', label: 'Grade 2 Parents' },
  { value: 'Grade 3 Parents', label: 'Grade 3 Parents' },
]

function SendMessage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ to: '', subject: '', content: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await communicationService.sendMessage(formData)
      if (response.success) {
        toast.success('Message sent successfully')
        navigate('/communication/messages')
      } else {
        toast.error(response.error?.message || 'Failed to send message')
      }
    } catch {
      toast.error('Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/communication/messages')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-xl font-semibold text-gray-900">Send Message</h2>
      </div>

      <form onSubmit={handleSubmit} className="card max-w-2xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recipients *</label>
            <SearchableSelect options={recipientOptions} value={formData.to} onChange={(val) => setFormData({ ...formData, to: val })} placeholder="Select recipients" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
            <input type="text" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
            <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="input-field" rows={8} required />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={() => navigate('/communication/messages')} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Sending...' : 'Send Message'}</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SendMessage
