import { useState } from 'react'
import { useToast } from '../../components/Toast'

function FeeSettings() {
  const toast = useToast()
  const [formData, setFormData] = useState({
    tuitionAmount: '7000',
    lateFeePercentage: '2',
    lateFeeGraceDays: '7',
    concessionLimit: '50',
    paymentMethods: 'Cash,Online,Check',
    receiptPrefix: 'RCP',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success('Fee settings saved successfully')
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Fee Settings</h2>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Tuition Amount</label>
              <input type="number" value={formData.tuitionAmount} onChange={(e) => setFormData({ ...formData, tuitionAmount: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Late Fee Percentage (%)</label>
              <input type="number" value={formData.lateFeePercentage} onChange={(e) => setFormData({ ...formData, lateFeePercentage: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Late Fee Grace Period (days)</label>
              <input type="number" value={formData.lateFeeGraceDays} onChange={(e) => setFormData({ ...formData, lateFeeGraceDays: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Concession Limit (%)</label>
              <input type="number" value={formData.concessionLimit} onChange={(e) => setFormData({ ...formData, concessionLimit: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Methods</label>
              <input type="text" value={formData.paymentMethods} onChange={(e) => setFormData({ ...formData, paymentMethods: e.target.value })} className="input-field" placeholder="Cash,Online,Check" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Receipt Prefix</label>
              <input type="text" value={formData.receiptPrefix} onChange={(e) => setFormData({ ...formData, receiptPrefix: e.target.value })} className="input-field" />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button type="submit" className="btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FeeSettings
