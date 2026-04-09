import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastProvider } from './components/Toast'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import FeeDashboard from './pages/fees/FeeDashboard'
import FeeStructure from './pages/fees/FeeStructure'
import FeeCollection from './pages/fees/FeeCollection'
import Concessions from './pages/fees/Concessions'
import FeeReports from './pages/fees/FeeReports'
import StaffList from './pages/staff/StaffList'
import StaffProfile from './pages/staff/StaffProfile'
import AddStaff from './pages/staff/AddStaff'
import LeaveManagement from './pages/staff/LeaveManagement'
import Payroll from './pages/staff/Payroll'
import LibraryDashboard from './pages/library/LibraryDashboard'
import BookCatalog from './pages/library/BookCatalog'
import AddBook from './pages/library/AddBook'
import IssueReturn from './pages/library/IssueReturn'
import MemberManagement from './pages/library/MemberManagement'
import NoticeBoard from './pages/communication/NoticeBoard'
import CreateNotice from './pages/communication/CreateNotice'
import Messages from './pages/communication/Messages'
import SendMessage from './pages/communication/SendMessage'
import Notifications from './pages/communication/Notifications'
import GeneralSettings from './pages/settings/GeneralSettings'
import UserManagement from './pages/settings/UserManagement'
import FeeSettings from './pages/settings/FeeSettings'
import NotificationSettings from './pages/settings/NotificationSettings'
import BackupSettings from './pages/settings/BackupSettings'
import StudentList from './pages/students/StudentList'
import StudentProfile from './pages/students/StudentProfile'
import AddStudent from './pages/students/AddStudent'
import AttendanceDashboard from './pages/attendance/AttendanceDashboard'
import MarkAttendance from './pages/attendance/MarkAttendance'
import AttendanceReport from './pages/attendance/AttendanceReport'
import ClassList from './pages/academics/ClassList'
import SubjectList from './pages/academics/SubjectList'
import ExamSchedule from './pages/academics/ExamSchedule'
import GradeEntry from './pages/academics/GradeEntry'
import ReportCards from './pages/academics/ReportCards'

function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="upload" element={<Upload />} />
              <Route path="reports" element={<Reports />} />

              <Route path="settings" element={<GeneralSettings />} />
              <Route path="settings/users" element={<UserManagement />} />
              <Route path="settings/fees" element={<FeeSettings />} />
              <Route path="settings/notifications" element={<NotificationSettings />} />
              <Route path="settings/backup" element={<BackupSettings />} />

              <Route path="fees" element={<FeeDashboard />} />
              <Route path="fees/collect" element={<FeeCollection />} />
              <Route path="fees/structure" element={<FeeStructure />} />
              <Route path="fees/concessions" element={<Concessions />} />
              <Route path="fees/reports" element={<FeeReports />} />

              <Route path="staff" element={<StaffList />} />
              <Route path="staff/add" element={<AddStaff />} />
              <Route path="staff/:id" element={<StaffProfile />} />
              <Route path="staff/leave" element={<LeaveManagement />} />
              <Route path="staff/payroll" element={<Payroll />} />

              <Route path="library" element={<LibraryDashboard />} />
              <Route path="library/books" element={<BookCatalog />} />
              <Route path="library/add-book" element={<AddBook />} />
              <Route path="library/issue-return" element={<IssueReturn />} />
              <Route path="library/members" element={<MemberManagement />} />

              <Route path="communication" element={<NoticeBoard />} />
              <Route path="communication/notices" element={<NoticeBoard />} />
              <Route path="communication/create-notice" element={<CreateNotice />} />
              <Route path="communication/messages" element={<Messages />} />
              <Route path="communication/send-message" element={<SendMessage />} />
              <Route path="communication/notifications" element={<Notifications />} />

              <Route path="students" element={<StudentList />} />
              <Route path="students/new" element={<AddStudent />} />
              <Route path="students/:id" element={<StudentProfile />} />
              <Route path="attendance/mark" element={<MarkAttendance />} />
              <Route path="attendance/reports" element={<AttendanceReport />} />
              <Route path="academics/classes" element={<ClassList />} />
              <Route path="academics/subjects" element={<SubjectList />} />
              <Route path="academics/exams" element={<ExamSchedule />} />
              <Route path="academics/grades" element={<GradeEntry />} />
              <Route path="academics/report-cards" element={<ReportCards />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AppProvider>
  )
}

export default App
