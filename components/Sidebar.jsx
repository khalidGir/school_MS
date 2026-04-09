import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import { 
  HomeIcon, CloudArrowUpIcon, ChartBarIcon, Cog6ToothIcon, Bars3Icon, XMarkIcon,
  UserGroupIcon, CalendarDaysIcon, AcademicCapIcon, CurrencyDollarIcon, BookOpenIcon, MegaphoneIcon,
  ChevronDownIcon, ChevronRightIcon
} from '@heroicons/react/24/outline'

const mainNavItems = [
  { to: '/', icon: HomeIcon, label: 'Dashboard' },
  { to: '/upload', icon: CloudArrowUpIcon, label: 'Upload' },
  { to: '/reports', icon: ChartBarIcon, label: 'Reports' },
]

const feeSubMenu = [
  { to: '/fees', label: 'Dashboard' },
  { to: '/fees/collect', label: 'Collect Fee' },
  { to: '/fees/structure', label: 'Fee Structure' },
  { to: '/fees/concessions', label: 'Concessions' },
  { to: '/fees/reports', label: 'Reports' },
]

const staffSubMenu = [
  { to: '/staff', label: 'Staff List' },
  { to: '/staff/add', label: 'Add Staff' },
  { to: '/staff/leave', label: 'Leave' },
  { to: '/staff/payroll', label: 'Payroll' },
]

const librarySubMenu = [
  { to: '/library', label: 'Dashboard' },
  { to: '/library/books', label: 'Books' },
  { to: '/library/issue-return', label: 'Issue/Return' },
  { to: '/library/members', label: 'Members' },
]

const communicationSubMenu = [
  { to: '/communication', label: 'Notices' },
  { to: '/communication/messages', label: 'Messages' },
  { to: '/communication/notifications', label: 'Notifications' },
]

const studentSubMenu = [
  { to: '/students', label: 'Student List' },
  { to: '/students/new', label: 'Add New Student' },
]

const attendanceSubMenu = [
  { to: '/attendance/mark', label: 'Mark Attendance' },
  { to: '/attendance/reports', label: 'Attendance Reports' },
]

const academicsSubMenu = [
  { to: '/academics/classes', label: 'Classes' },
  { to: '/academics/subjects', label: 'Subjects' },
  { to: '/academics/exams', label: 'Exam Schedule' },
  { to: '/academics/grades', label: 'Grade Entry' },
  { to: '/academics/report-cards', label: 'Report Cards' },
]

const settingsSubMenu = [
  { to: '/settings', label: 'General' },
  { to: '/settings/users', label: 'Users' },
  { to: '/settings/fees', label: 'Fee Settings' },
  { to: '/settings/notifications', label: 'Notifications' },
  { to: '/settings/backup', label: 'Backup' },
]

function Sidebar({ isOpen, onClose }) {
  const [expandedMenus, setExpandedMenus] = useState({})

  const toggleMenu = (key) => {
    setExpandedMenus(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const renderMenuWithSubmenu = (key, label, Icon, subMenu) => {
    const isExpanded = expandedMenus[key]
    return (
      <div key={key}>
        <button
          onClick={() => toggleMenu(key)}
          className="w-full flex items-center gap-3 px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
        >
          <Icon className="w-5 h-5" aria-hidden="true" />
          <span className="flex-1 text-left">{label}</span>
          {isExpanded ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />}
        </button>
        {isExpanded && (
          <div className="bg-gray-50">
            {subMenu.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 pl-12 pr-6 py-2.5 text-sm transition-colors ${
                    isActive ? 'text-primary font-medium' : 'text-gray-500 hover:text-gray-900'
                  }`
                }
              >
                <div className="w-1.5 h-1.5 rounded-full bg-current" />
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 xl:hidden" onClick={onClose} role="presentation" />
      )}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 flex flex-col z-50 transition-transform duration-300 xl:hidden ${
          isOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full w-[280px]'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-primary">SchoolPay Ledger</h1>
          <button onClick={onClose} className="p-2 -mr-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md" aria-label="Close menu">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          {mainNavItems.map(({ to, icon, label }) => {
            const Icon = icon
            return (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                    isActive ? 'text-primary border-l-[3px] border-primary bg-gray-50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
                {label}
              </NavLink>
            )
          })}

          <div className="h-px bg-gray-200 my-4" />

          {renderMenuWithSubmenu('fees', 'Fees', CurrencyDollarIcon, feeSubMenu)}
          {renderMenuWithSubmenu('staff', 'Staff', UserGroupIcon, staffSubMenu)}
          {renderMenuWithSubmenu('library', 'Library', BookOpenIcon, librarySubMenu)}
          {renderMenuWithSubmenu('communication', 'Communication', MegaphoneIcon, communicationSubMenu)}
          {renderMenuWithSubmenu('students', 'Students', UserGroupIcon, studentSubMenu)}
          {renderMenuWithSubmenu('attendance', 'Attendance', CalendarDaysIcon, attendanceSubMenu)}
          {renderMenuWithSubmenu('academics', 'Academics', AcademicCapIcon, academicsSubMenu)}

          <div className="h-px bg-gray-200 my-4" />

          {renderMenuWithSubmenu('settings', 'Settings', Cog6ToothIcon, settingsSubMenu)}
        </nav>
      </aside>
    </>
  )
}

function CollapsedSidebar({ onExpand }) {
  return (
    <aside
      className="hidden xl:flex fixed left-0 top-0 h-full w-[72px] bg-white border-r border-gray-200 flex-col items-center py-4 z-30"
      role="navigation"
      aria-label="Collapsed navigation"
    >
      <button onClick={onExpand} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md" aria-label="Expand menu">
        <Bars3Icon className="w-6 h-6" />
      </button>
      <nav className="flex-1 mt-4 flex flex-col items-center gap-1">
        {mainNavItems.map(({ to, icon, label }) => {
          const Icon = icon
          return (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              title={label}
              className={({ isActive }) =>
                `p-3 rounded-lg transition-colors ${isActive ? 'text-primary bg-gray-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`
              }
              aria-label={label}
            >
              <Icon className="w-6 h-6" aria-hidden="true" />
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

function ExpandedSidebar({ onCollapse }) {
  const [expandedMenus, setExpandedMenus] = useState({})

  const toggleMenu = (key) => {
    setExpandedMenus(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const renderMenuWithSubmenu = (key, label, Icon, subMenu) => {
    const isExpanded = expandedMenus[key]
    return (
      <div key={key}>
        <button
          onClick={() => toggleMenu(key)}
          className="w-full flex items-center gap-3 px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
        >
          <Icon className="w-5 h-5" aria-hidden="true" />
          <span className="flex-1 text-left">{label}</span>
          {isExpanded ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />}
        </button>
        {isExpanded && (
          <div className="bg-gray-50">
            {subMenu.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 pl-12 pr-6 py-2.5 text-sm transition-colors ${
                    isActive ? 'text-primary font-medium' : 'text-gray-500 hover:text-gray-900'
                  }`
                }
              >
                <div className="w-1.5 h-1.5 rounded-full bg-current" />
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <aside
      className="hidden xl:block fixed left-0 top-0 h-full w-[260px] bg-white border-r border-gray-200 flex flex-col z-30"
      role="navigation"
      aria-label="Expanded navigation"
    >
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
        <h1 className="text-lg font-semibold text-primary">SchoolPay Ledger</h1>
        <button onClick={onCollapse} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md" aria-label="Collapse menu">
          <Bars3Icon className="w-5 h-5" />
        </button>
      </div>
      <nav className="flex-1 py-4 overflow-y-auto">
        {mainNavItems.map(({ to, icon, label }) => {
          const Icon = icon
          return (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                  isActive ? 'text-primary border-l-[3px] border-primary bg-gray-50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`
              }
            >
              <Icon className="w-5 h-5" aria-hidden="true" />
              {label}
            </NavLink>
          )
        })}

        <div className="h-px bg-gray-200 my-4" />

        {renderMenuWithSubmenu('fees', 'Fees', CurrencyDollarIcon, feeSubMenu)}
        {renderMenuWithSubmenu('staff', 'Staff', UserGroupIcon, staffSubMenu)}
        {renderMenuWithSubmenu('library', 'Library', BookOpenIcon, librarySubMenu)}
        {renderMenuWithSubmenu('communication', 'Communication', MegaphoneIcon, communicationSubMenu)}
        {renderMenuWithSubmenu('students', 'Students', UserGroupIcon, studentSubMenu)}
        {renderMenuWithSubmenu('attendance', 'Attendance', CalendarDaysIcon, attendanceSubMenu)}
        {renderMenuWithSubmenu('academics', 'Academics', AcademicCapIcon, academicsSubMenu)}

        <div className="h-px bg-gray-200 my-4" />

        {renderMenuWithSubmenu('settings', 'Settings', Cog6ToothIcon, settingsSubMenu)}
      </nav>
    </aside>
  )
}

export { Sidebar, CollapsedSidebar, ExpandedSidebar }
export default Sidebar
