import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PlusIcon, EnvelopeIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import communicationService from '../../services/communication.service'
import LoadingSpinner from '../../components/common/LoadingSpinner'

function Messages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    try {
      const res = await communicationService.getMessages()
      if (res.success) setMessages(res.data)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner text="Loading messages..." />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
        <Link to="/communication/send-message" className="btn-primary flex items-center gap-2">
          <PaperAirplaneIcon className="w-4 h-4" /> Compose
        </Link>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">To</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Subject</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Sent By</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Date</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {messages.map(msg => (
                <tr key={msg.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900 font-medium">{msg.to}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{msg.subject}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{msg.sentBy}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{msg.sentAt}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-[#e8f5e9] text-[#2c7a4d]">
                      {msg.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Messages
