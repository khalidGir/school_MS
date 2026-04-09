import { useState, useEffect } from 'react'
import { BellIcon, CheckIcon } from '@heroicons/react/24/outline'
import { useToast } from '../../components/Toast'
import communicationService from '../../services/communication.service'
import LoadingSpinner from '../../components/common/LoadingSpinner'

function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      const res = await communicationService.getNotifications()
      if (res.success) setNotifications(res.data)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAllRead = async () => {
    await communicationService.markAllNotificationsRead()
    toast.success('All notifications marked as read')
    loadNotifications()
  }

  const handleMarkRead = async (id) => {
    await communicationService.markNotificationRead(id)
    loadNotifications()
  }

  if (loading) return <LoadingSpinner text="Loading notifications..." />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
        <button onClick={handleMarkAllRead} className="btn-secondary text-sm">Mark all as read</button>
      </div>

      <div className="card">
        <div className="space-y-2">
          {notifications.map(notif => (
            <div
              key={notif.id}
              className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${notif.read ? 'bg-gray-50' : 'bg-primary/5'}`}
            >
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <BellIcon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{notif.message}</p>
                <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
              </div>
              {!notif.read && (
                <button onClick={() => handleMarkRead(notif.id)} className="p-1 text-primary hover:bg-primary/10 rounded">
                  <CheckIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          {notifications.length === 0 && (
            <div className="text-center py-8 text-gray-500">No notifications</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Notifications
