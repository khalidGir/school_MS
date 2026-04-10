import { useState, useEffect } from 'react'
import {
  UserIcon, CalendarIcon, PhoneIcon, EnvelopeIcon,
  MapPinIcon, AcademicCapIcon, ClockIcon, BanknotesIcon,
  CheckCircleIcon, ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface StudentCardProps {
  student: any
  attendance: any[]
  grades: any[]
  payments: any[]
}

const StudentCard = ({ student, attendance, grades, payments }: StudentCardProps) => {
  const [animatedStats, setAnimatedStats] = useState({ att: 0, pay: 0, overall: 0, attendanceRate: 0 })
  const [activeStat, setActiveStat] = useState<string | null>(null)

  const initials = student.name.split(' ').map((n: string) => n[0]).join('')
  const gradeLabel = `${student.grade}-${student.section}`

  // Calculate metrics
  const attendanceRate = student.attendance || 0
  const paymentCompletion = payments.length > 0 ? 100 : student.paymentStatus === 'Paid' ? 100 : student.paymentStatus === 'Partial' ? 50 : 0
  const avgGrade = grades.length > 0
    ? Math.round(grades.reduce((sum: number, g: any) => sum + (g.score / g.maxScore) * 100, 0) / grades.length)
    : 75
  const overallRating = Math.round((attendanceRate * 0.3 + paymentCompletion * 0.3 + avgGrade * 0.4))

  // Animate stats on mount
  useEffect(() => {
    const duration = 1200
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic

      setAnimatedStats({
        att: Math.round(attendanceRate * eased),
        pay: Math.round(paymentCompletion * eased),
        overall: Math.round(overallRating * eased),
        attendanceRate: Math.round(attendanceRate * eased),
      })

      if (step >= steps) clearInterval(timer)
    }, interval)

    return () => clearInterval(timer)
  }, [attendanceRate, paymentCompletion, overallRating])

  const statusColor = student.paymentStatus === 'Paid'
    ? 'from-emerald-400 to-green-500'
    : student.paymentStatus === 'Partial'
    ? 'from-amber-400 to-yellow-500'
    : 'from-red-400 to-rose-500'

  const statusGlow = student.paymentStatus === 'Paid'
    ? 'status-pulse'
    : student.paymentStatus === 'Partial'
    ? 'status-pulse-warning'
    : 'status-pulse-danger'

  const getGradeColor = (value: number) => {
    if (value >= 90) return 'from-emerald-400 to-green-500'
    if (value >= 75) return 'from-cyan-400 to-blue-500'
    if (value >= 60) return 'from-amber-400 to-yellow-500'
    return 'from-red-400 to-rose-500'
  }

  const getGradeColorSolid = (value: number) => {
    if (value >= 90) return '#10b981'
    if (value >= 75) return '#06b6d4'
    if (value >= 60) return '#f59e0b'
    return '#ef4444'
  }

  const presentDays = attendance.filter((a: any) => a.status === 'Present').length
  const lateDays = attendance.filter((a: any) => a.status === 'Late').length
  const absentDays = attendance.filter((a: any) => a.status === 'Absent').length

  return (
    <div className="card-entrance">
      {/* Main Card */}
      <div className="relative futuristic-card-bg rounded-2xl overflow-hidden border border-white/10">
        {/* Animated shimmer overlay */}
        <div className="absolute inset-0 shimmer-effect pointer-events-none" />

        {/* Floating particles */}
        <div className="absolute top-4 left-8 w-2 h-2 rounded-full bg-cyan-400/30 particle" />
        <div className="absolute top-12 right-16 w-1.5 h-1.5 rounded-full bg-purple-400/30 particle particle-delay-1" />
        <div className="absolute bottom-20 left-20 w-1 h-1 rounded-full bg-blue-400/30 particle particle-delay-2" />
        <div className="absolute top-24 right-32 w-1.5 h-1.5 rounded-full bg-cyan-400/20 particle particle-delay-3" />
        <div className="absolute bottom-12 right-8 w-2 h-2 rounded-full bg-purple-400/20 particle particle-delay-4" />

        {/* Gradient border glow */}
        <div className="absolute inset-0 rounded-2xl" style={{
          background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(168, 85, 247, 0.15), rgba(6, 182, 212, 0.15))',
          padding: '1px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }} />

        <div className="relative p-4 sm:p-6 lg:p-8">
          {/* Top section: Overall Rating + Avatar */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left: Player-style rating and avatar */}
            <div className="flex flex-row lg:flex-col items-center lg:items-start gap-4 lg:gap-6">
              {/* Overall Rating Badge */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br ${getGradeColor(overallRating)} flex items-center justify-center glow-rotate`}>
                    <span className="text-3xl sm:text-4xl font-black text-white glow-text-blue">
                      {animatedStats.overall}
                    </span>
                  </div>
                  {/* Corner accent */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-cyan-400 mt-2 tracking-widest uppercase glow-text-blue">OVR</span>
              </div>

              {/* Avatar with glow */}
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 blur-md opacity-60 glow-rotate" />
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border-2 border-cyan-400/50 flex items-center justify-center">
                  <span className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    {initials}
                  </span>
                </div>
              </div>
            </div>

            {/* Center: Student Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight truncate">
                    {student.name}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">{student.studentId}</p>
                </div>

                {/* Grade badge (jersey number style) */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 blur-sm opacity-40" />
                    <div className="relative px-4 py-2 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 border border-cyan-500/30">
                      <div className="flex items-center gap-2">
                        <AcademicCapIcon className="w-4 h-4 text-cyan-400" />
                        <span className="text-lg font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                          {gradeLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status badges */}
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${statusColor} status-badge ${statusGlow}`}>
                  {student.paymentStatus === 'Paid' ? (
                    <CheckCircleIcon className="w-4 h-4 text-white" />
                  ) : student.paymentStatus === 'Partial' ? (
                    <ClockIcon className="w-4 h-4 text-white" />
                  ) : (
                    <ExclamationTriangleIcon className="w-4 h-4 text-white" />
                  )}
                  <span className="text-sm font-semibold text-white">{student.paymentStatus}</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-700/50 border border-white/10">
                  <div className={`w-2 h-2 rounded-full ${student.status === 'Active' ? 'bg-emerald-400' : 'bg-gray-500'}`} />
                  <span className="text-sm text-gray-300">{student.status}</span>
                </div>
              </div>

              {/* Contact info row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                  <span className="truncate">{student.parentName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneIcon className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                  <span className="truncate">{student.parentPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <EnvelopeIcon className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                  <span className="truncate">{student.parentEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                  <span className="truncate">{student.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid - Football Player Style */}
          <div className="mt-6 lg:mt-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {/* ATT - Attendance */}
              <div
                className="relative group cursor-pointer"
                onMouseEnter={() => setActiveStat('att')}
                onMouseLeave={() => setActiveStat(null)}
              >
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${getGradeColor(attendanceRate)} opacity-0 group-hover:opacity-20 transition-opacity rounded-xl blur-md`} />
                <div className="relative glass-card rounded-xl p-3 sm:p-4 text-center stat-hex">
                  <div className="text-[10px] sm:text-xs font-bold text-gray-400 tracking-wider mb-1">ATT</div>
                  <div className={`text-2xl sm:text-3xl font-black bg-gradient-to-r ${getGradeColor(attendanceRate)} bg-clip-text text-transparent`}>
                    {animatedStats.att}
                  </div>
                  <div className="w-full h-1.5 bg-gray-700 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${getGradeColor(attendanceRate)} stat-progress-gradient`}
                      style={{ width: `${attendanceRate}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">Attendance %</div>
                </div>
              </div>

              {/* PAY - Payment */}
              <div
                className="relative group cursor-pointer"
                onMouseEnter={() => setActiveStat('pay')}
                onMouseLeave={() => setActiveStat(null)}
              >
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${getGradeColor(paymentCompletion)} opacity-0 group-hover:opacity-20 transition-opacity rounded-xl blur-md`} />
                <div className="relative glass-card rounded-xl p-3 sm:p-4 text-center stat-hex">
                  <div className="text-[10px] sm:text-xs font-bold text-gray-400 tracking-wider mb-1">PAY</div>
                  <div className={`text-2xl sm:text-3xl font-black bg-gradient-to-r ${getGradeColor(paymentCompletion)} bg-clip-text text-transparent`}>
                    {animatedStats.pay}
                  </div>
                  <div className="w-full h-1.5 bg-gray-700 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${getGradeColor(paymentCompletion)} stat-progress-gradient`}
                      style={{ width: `${paymentCompletion}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">Payment %</div>
                </div>
              </div>

              {/* GRD - Average Grade */}
              <div
                className="relative group cursor-pointer"
                onMouseEnter={() => setActiveStat('grade')}
                onMouseLeave={() => setActiveStat(null)}
              >
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${getGradeColor(avgGrade)} opacity-0 group-hover:opacity-20 transition-opacity rounded-xl blur-md`} />
                <div className="relative glass-card rounded-xl p-3 sm:p-4 text-center stat-hex">
                  <div className="text-[10px] sm:text-xs font-bold text-gray-400 tracking-wider mb-1">GRD</div>
                  <div className={`text-2xl sm:text-3xl font-black bg-gradient-to-r ${getGradeColor(avgGrade)} bg-clip-text text-transparent`}>
                    {avgGrade}
                  </div>
                  <div className="w-full h-1.5 bg-gray-700 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${getGradeColor(avgGrade)} stat-progress-gradient`}
                      style={{ width: `${avgGrade}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">Avg Grade %</div>
                </div>
              </div>

              {/* ATT Summary - Present/Late/Absent */}
              <div className="relative">
                <div className="relative glass-card rounded-xl p-3 sm:p-4 text-center">
                  <div className="text-[10px] sm:text-xs font-bold text-gray-400 tracking-wider mb-2">REC</div>
                  <div className="flex justify-center gap-2 sm:gap-3">
                    <div className="text-center">
                      <div className="text-sm sm:text-lg font-bold text-emerald-400">{presentDays}</div>
                      <div className="text-[9px] text-gray-500">P</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm sm:text-lg font-bold text-amber-400">{lateDays}</div>
                      <div className="text-[9px] text-gray-500">L</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm sm:text-lg font-bold text-red-400">{absentDays}</div>
                      <div className="text-[9px] text-gray-500">A</div>
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">Record</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom quick info */}
          <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="glass-card rounded-lg p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                <CalendarIcon className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <div className="text-[10px] text-gray-500">Date of Birth</div>
                <div className="text-xs text-gray-300 font-medium">
                  {new Date(student.dateOfBirth).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </div>
            <div className="glass-card rounded-lg p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0">
                <BanknotesIcon className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <div className="text-[10px] text-gray-500">Payments Made</div>
                <div className="text-xs text-gray-300 font-medium">{payments.length} transaction{payments.length !== 1 ? 's' : ''}</div>
              </div>
            </div>
            <div className="glass-card rounded-lg p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center flex-shrink-0">
                <AcademicCapIcon className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="text-[10px] text-gray-500">Subjects</div>
                <div className="text-xs text-gray-300 font-medium">{grades.length} graded</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentCard
