const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const mockNotices = [
  { id: 1, title: 'School Holidays - February', content: 'The school will remain closed from 15th to 20th February for mid-term break.', type: 'Holiday', audience: 'All', postedBy: 'Admin', createdAt: '2024-01-15', active: true },
  { id: 2, title: 'Parent-Teacher Meeting', content: 'PTM scheduled for 25th January from 9 AM to 1 PM. All parents are requested to attend.', type: 'Event', audience: 'Parents', postedBy: 'Admin', createdAt: '2024-01-10', active: true },
  { id: 3, title: 'Annual Day Celebration', content: 'Annual Day will be celebrated on 5th February. Students are requested to submit their participation forms by 25th January.', type: 'Event', audience: 'All', postedBy: 'Principal', createdAt: '2024-01-12', active: true },
]

const mockMessages = [
  { id: 1, to: 'All Parents', subject: 'Fee Payment Reminder', content: 'Dear Parents, kindly ensure timely payment of fees for the current term.', sentAt: '2024-01-14', status: 'Sent', sentBy: 'Admin' },
  { id: 2, to: 'All Staff', subject: 'Staff Meeting', content: 'A staff meeting is scheduled for 20th January at 3 PM in the conference room.', sentAt: '2024-01-13', status: 'Sent', sentBy: 'Principal' },
]

const mockNotifications = [
  { id: 1, type: 'Notice', message: 'New notice posted: School Holidays - February', time: '2 hours ago', read: false },
  { id: 2, type: 'Message', message: 'You have a new message from Principal', time: '5 hours ago', read: false },
  { id: 3, type: 'Alert', message: 'Library book overdue reminder', time: '1 day ago', read: true },
]

const mockInbox = [
  { id: 1, from: 'Principal', subject: 'Regarding Staff Meeting', content: 'All teachers are requested to attend...', receivedAt: '2024-01-15 10:30 AM', read: false },
]

let notices = [...mockNotices]
let messages = [...mockMessages]
let notifications = [...mockNotifications]
let inbox = [...mockInbox]

export const communicationService = {
  async getNotices(filters = {}) {
    await delay(400)
    let result = [...notices]
    if (filters.type) result = result.filter(n => n.type === filters.type)
    if (filters.audience) result = result.filter(n => n.audience === filters.audience)
    return { success: true, data: result }
  },

  async createNotice(data) {
    await delay(500)
    const newNotice = {
      id: Date.now(),
      ...data,
      createdAt: new Date().toISOString().split('T')[0],
      postedBy: 'Admin',
      active: true,
    }
    notices.unshift(newNotice)
    return { success: true, data: newNotice }
  },

  async updateNotice(id, data) {
    await delay(400)
    const index = notices.findIndex(n => n.id === id)
    if (index === -1) return { success: false, error: { message: 'Notice not found' } }
    notices[index] = { ...notices[index], ...data }
    return { success: true, data: notices[index] }
  },

  async deleteNotice(id) {
    await delay(300)
    notices = notices.filter(n => n.id !== id)
    return { success: true, data: { deleted: true } }
  },

  async toggleNoticeStatus(id) {
    await delay(300)
    const index = notices.findIndex(n => n.id === id)
    if (index === -1) return { success: false, error: { message: 'Notice not found' } }
    notices[index].active = !notices[index].active
    return { success: true, data: notices[index] }
  },

  async getMessages() {
    await delay(400)
    return { success: true, data: messages }
  },

  async sendMessage(data) {
    await delay(500)
    const newMessage = {
      id: Date.now(),
      ...data,
      sentAt: new Date().toISOString().split('T')[0],
      status: 'Sent',
      sentBy: 'Admin',
    }
    messages.unshift(newMessage)
    return { success: true, data: newMessage }
  },

  async getInbox() {
    await delay(400)
    return { success: true, data: inbox }
  },

  async markAsRead(messageId) {
    await delay(200)
    const index = inbox.findIndex(m => m.id === messageId)
    if (index !== -1) inbox[index].read = true
    return { success: true }
  },

  async getNotifications() {
    await delay(300)
    return { success: true, data: notifications }
  },

  async markNotificationRead(id) {
    await delay(200)
    const index = notifications.findIndex(n => n.id === id)
    if (index !== -1) notifications[index].read = true
    return { success: true }
  },

  async markAllNotificationsRead() {
    await delay(300)
    notifications.forEach(n => n.read = true)
    return { success: true }
  },

  async getNoticeTypes() {
    return {
      success: true,
      data: ['General', 'Holiday', 'Event', 'Academic', 'Administrative', 'Emergency']
    }
  },

  async getAudienceOptions() {
    return {
      success: true,
      data: ['All', 'Parents', 'Staff', 'Students', 'Admin']
    }
  },
}

export default communicationService
