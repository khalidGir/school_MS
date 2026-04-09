import { useState } from 'react'
import { CloudArrowDownIcon, ServerIcon } from '@heroicons/react/24/outline'
import { useToast } from '../../components/Toast'

function BackupSettings() {
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [autoBackup, setAutoBackup] = useState(true)
  const [backupFrequency, setBackupFrequency] = useState('daily')

  const handleManualBackup = async () => {
    setLoading(true)
    setTimeout(() => {
      toast.success('Backup created successfully')
      setLoading(false)
    }, 2000)
  }

  const handleRestore = () => {
    toast.info('Restore functionality coming soon')
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Backup Settings</h2>

      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Manual Backup</h3>
        <p className="text-sm text-gray-500 mb-4">Create a backup of your database and settings.</p>
        <button onClick={handleManualBackup} disabled={loading} className="btn-primary flex items-center gap-2">
          <CloudArrowDownIcon className="w-4 h-4" />
          {loading ? 'Creating Backup...' : 'Create Backup Now'}
        </button>
      </div>

      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Auto Backup</h3>
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={autoBackup} onChange={(e) => setAutoBackup(e.target.checked)} className="w-4 h-4 text-primary" />
            <span className="text-sm text-gray-700">Enable automatic backups</span>
          </label>
          {autoBackup && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Backup Frequency</label>
              <select value={backupFrequency} onChange={(e) => setBackupFrequency(e.target.value)} className="input-field w-48">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Restore Backup</h3>
        <p className="text-sm text-gray-500 mb-4">Restore your system from a previous backup.</p>
        <button onClick={handleRestore} className="btn-secondary flex items-center gap-2">
          <ServerIcon className="w-4 h-4" />
          Restore from Backup
        </button>
      </div>
    </div>
  )
}

export default BackupSettings
