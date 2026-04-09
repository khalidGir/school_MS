import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MegaphoneIcon, EnvelopeIcon, BellIcon } from '@heroicons/react/24/outline'
import communicationService from '../../services/communication.service'
import LoadingSpinner from '../../components/common/LoadingSpinner'

function NoticeBoard() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotices()
  }, [])

  const loadNotices = async () => {
    try {
      const res = await communicationService.getNotices()
      if (res.success) setNotices(res.data)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner text="Loading notices..." />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Notice Board</h2>
        <Link to="/communication/create-notice" className="btn-primary">Create Notice</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Link to="/communication/notices" className="card hover:shadow-md transition-shadow">
          <MegaphoneIcon className="w-8 h-8 text-primary mb-2" />
          <h4 className="font-medium text-gray-900">All Notices</h4>
          <p className="text-sm text-gray-500">View and manage notices</p>
        </Link>
        <Link to="/communication/messages" className="card hover:shadow-md transition-shadow">
          <EnvelopeIcon className="w-8 h-8 text-primary mb-2" />
          <h4 className="font-medium text-gray-900">Messages</h4>
          <p className="text-sm text-gray-500">Send bulk messages</p>
        </Link>
        <Link to="/communication/notifications" className="card hover:shadow-md transition-shadow">
          <BellIcon className="w-8 h-8 text-primary mb-2" />
          <h4 className="font-medium text-gray-900">Notifications</h4>
          <p className="text-sm text-gray-500">View all notifications</p>
        </Link>
      </div>

      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Notices</h3>
        <div className="space-y-4">
          {notices.slice(0, 5).map(notice => (
            <div key={notice.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <MegaphoneIcon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{notice.title}</h4>
                  <span className="text-xs text-gray-500">{notice.createdAt}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{notice.content}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">{notice.type}</span>
                  <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded">{notice.audience}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NoticeBoard
