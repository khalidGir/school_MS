import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, Bars3Icon } from '@heroicons/react/24/outline'
import { useLocation } from 'react-router-dom'

const pageNames = {
  '/': 'Dashboard',
  '/upload': 'Upload Payment Data',
  '/reports': 'Payment Reports',
  '/settings': 'Settings',
  '/fees': 'Fee Management',
  '/fees/collect': 'Collect Fee',
  '/fees/structure': 'Fee Structure',
  '/fees/concessions': 'Concessions',
  '/fees/reports': 'Fee Reports',
  '/staff': 'Staff Management',
  '/staff/add': 'Add Staff',
  '/staff/leave': 'Leave Management',
  '/staff/payroll': 'Payroll',
  '/library': 'Library',
  '/library/books': 'Book Catalog',
  '/library/issue-return': 'Issue/Return',
  '/library/members': 'Members',
  '/communication': 'Communication',
  '/communication/notices': 'Notice Board',
  '/communication/create-notice': 'Create Notice',
  '/communication/messages': 'Messages',
  '/communication/send-message': 'Send Message',
  '/communication/notifications': 'Notifications',
  '/settings/users': 'User Management',
  '/settings/fees': 'Fee Settings',
  '/settings/notifications': 'Notification Settings',
  '/settings/backup': 'Backup Settings',
  '/students': 'Students',
  '/students/new': 'Add New Student',
  '/attendance/mark': 'Mark Attendance',
  '/attendance/reports': 'Attendance Reports',
  '/academics/classes': 'Classes',
  '/academics/subjects': 'Subjects',
  '/academics/exams': 'Exam Schedule',
  '/academics/grades': 'Grade Entry',
  '/academics/report-cards': 'Report Cards',
}

const pageTitleOverrides = {
  '/fees': 'Fee Management',
  '/staff': 'Staff Management',
  '/library': 'Library',
  '/communication': 'Communication',
  '/settings': 'General Settings',
  '/settings/users': 'User Management',
  '/settings/fees': 'Fee Settings',
  '/settings/notifications': 'Notification Settings',
  '/settings/backup': 'Backup Settings',
  '/students': 'Student Management',
  '/attendance/mark': 'Attendance',
  '/attendance/reports': 'Attendance Reports',
  '/academics/classes': 'Academic Classes',
  '/academics/subjects': 'Academic Subjects',
  '/academics/exams': 'Examination',
  '/academics/grades': 'Grade Management',
  '/academics/report-cards': 'Report Cards',
}

function Header({ onMenuClick }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const location = useLocation()

  const formatMonth = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const pageName = pageTitleOverrides[location.pathname] || pageNames[location.pathname] || 'Dashboard'

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between gap-2 sm:gap-4" role="banner">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <button
          onClick={onMenuClick}
          className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md xl:hidden touch-target"
          aria-label="Open menu"
        >
          <Bars3Icon className="w-5 h-5" />
        </button>
        <nav className="flex items-center gap-2 text-sm text-gray-500 min-w-0" aria-label="Breadcrumb">
          <span className="font-medium text-gray-900 truncate">{pageName}</span>
        </nav>
      </div>
      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        <div className="hidden sm:flex items-center gap-2 border border-gray-200 rounded-md px-3 py-1.5" role="group" aria-label="Month selector">
          <button
            onClick={handlePrevMonth}
            className="p-1 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-primary/20 touch-target"
            aria-label="Previous month"
          >
            <ChevronLeftIcon className="w-4 h-4 text-gray-500" />
          </button>
          <CalendarIcon className="w-4 h-4 text-gray-500" aria-hidden="true" />
          <span className="text-sm font-medium text-gray-700 min-w-[120px] text-center" aria-live="polite">
            {formatMonth(currentDate)}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-1 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-primary/20 touch-target"
            aria-label="Next month"
          >
            <ChevronRightIcon className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <div
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
          role="img"
          aria-label="User avatar"
        >
          JD
        </div>
      </div>
    </header>
  )
}

export default Header
