import { useState } from 'react'
import { useToast } from '../../components/Toast'

function NotificationSettings() {
  const toast = useToast()
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [smsEnabled, setSmsEnabled] = useState(false)
  const [templates, setTemplates] = useState({
    reminder: 'Dear Parent,\n\nThis is a reminder that the tuition payment for {student_name} is overdue by {balance}.\n\nPlease arrange payment at the earliest.\n\nThank you.',
    welcome: 'Welcome to {school_name}!\n\nDear {parent_name},\n\nYour child {student_name} has been enrolled successfully.\n\nBest regards,\n{school_name}',
  })

  const handleSave = () => {
    toast.success('Notification settings saved')
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Notification Settings</h2>

      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Channels</h3>
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={emailEnabled} onChange={(e) => setEmailEnabled(e.target.checked)} className="w-4 h-4 text-primary" />
            <span className="text-sm text-gray-700">Email Notifications</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={smsEnabled} onChange={(e) => setSmsEnabled(e.target.checked)} className="w-4 h-4 text-primary" />
            <span className="text-sm text-gray-700">SMS Notifications</span>
          </label>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Email Templates</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Reminder</label>
            <textarea value={templates.reminder} onChange={(e) => setTemplates({ ...templates, reminder: e.target.value })} className="input-field" rows={4} />
            <p className="text-xs text-gray-500 mt-1">Available: {'{student_name}'}, {'{balance}'}, {'{school_name}'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Welcome Message</label>
            <textarea value={templates.welcome} onChange={(e) => setTemplates({ ...templates, welcome: e.target.value })} className="input-field" rows={4} />
            <p className="text-xs text-gray-500 mt-1">Available: {'{school_name}'}, {'{parent_name}'}, {'{student_name}'}</p>
          </div>
        </div>
        <div className="flex justify-end pt-4 border-t border-gray-200 mt-4">
          <button onClick={handleSave} className="btn-primary">Save Templates</button>
        </div>
      </div>
    </div>
  )
}

export default NotificationSettings
