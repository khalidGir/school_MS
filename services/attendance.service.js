const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const generateAttendanceData = () => {
  const classes = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8']
  const sections = ['A', 'B', 'C']
  const attendance = {}
  
  classes.forEach(grade => {
    sections.forEach(section => {
      const key = `${grade}-${section}`
      const present = Math.floor(Math.random() * 15) + 25
      const absent = Math.floor(Math.random() * 5)
      const late = Math.floor(Math.random() * 3)
      attendance[key] = { present, absent, late, total: present + absent + late }
    })
  })
  
  return attendance
}

const mockAttendance = generateAttendanceData()
const mockMonthlyData = Array.from({ length: 12 }, (_, i) => ({
  month: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' }),
  present: 85 + Math.floor(Math.random() * 10),
  absent: 5 + Math.floor(Math.random() * 5),
  late: 2 + Math.floor(Math.random() * 3)
}))

export const attendanceService = {
  async getDashboard() {
    await delay(400)
    const totalStudents = 180
    const todayPresent = Math.floor(totalStudents * 0.92)
    const todayAbsent = Math.floor(totalStudents * 0.05)
    const todayLate = Math.floor(totalStudents * 0.03)
    
    return {
      success: true,
      data: {
        today: {
          present: todayPresent,
          absent: todayAbsent,
          late: todayLate,
          total: totalStudents
        },
        weekly: mockMonthlyData.slice(-7),
        monthly: mockMonthlyData,
        byClass: mockAttendance
      },
      error: null
    }
  },

  async getClassAttendance(grade, section) {
    await delay(300)
    const key = `${grade}-${section}`
    const data = mockAttendance[key] || { present: 30, absent: 2, late: 1, total: 33 }
    
    const students = Array.from({ length: data.total }, (_, i) => ({
      id: i + 1,
      rollNumber: `${grade.charAt(grade.length - 1)}${section}${String(i + 1).padStart(2, '0')}`,
      name: `Student ${i + 1}`,
      status: i < data.present ? 'Present' : i < data.present + data.late ? 'Late' : 'Absent'
    }))
    
    return {
      success: true,
      data: { students, summary: data },
      error: null
    }
  },

  async markAttendance(grade, section, date, records) {
    await delay(500)
    const key = `${grade}-${section}`
    if (!mockAttendance[key]) {
      mockAttendance[key] = { present: 0, absent: 0, late: 0, total: records.length }
    }
    
    records.forEach(record => {
      if (record.status === 'Present') mockAttendance[key].present++
      else if (record.status === 'Absent') mockAttendance[key].absent++
      else if (record.status === 'Late') mockAttendance[key].late++
    })
    
    return { success: true, data: { marked: records.length }, error: null }
  },

  async getReport(params = {}) {
    await delay(400)
    const { class: grade, startDate, endDate, format = 'summary' } = params
    
    if (format === 'detailed') {
      const students = Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        name: `Student ${i + 1}`,
        rollNumber: `001${i + 1}`,
        totalDays: 30,
        present: 25 + Math.floor(Math.random() * 5),
        absent: Math.floor(Math.random() * 3),
        late: Math.floor(Math.random() * 2),
        percentage: 85 + Math.floor(Math.random() * 12)
      }))
      return { success: true, data: { students, format: 'detailed' }, error: null }
    }
    
    return {
      success: true,
      data: {
        summary: {
          totalStudents: 180,
          averageAttendance: 92.5,
          highestClass: 'Grade 2-A',
          lowestClass: 'Grade 8-B'
        },
        byClass: Object.entries(mockAttendance).map(([key, data]) => ({
          class: key,
          ...data,
          percentage: Math.round((data.present / data.total) * 100)
        })),
        format: 'summary'
      },
      error: null
    }
  },

  async exportReport(params = {}) {
    await delay(600)
    const csv = [
      ['Class', 'Present', 'Absent', 'Late', 'Total', 'Attendance %'].join(','),
      ...Object.entries(mockAttendance).map(([key, data]) => 
        [key, data.present, data.absent, data.late, data.total, Math.round((data.present / data.total) * 100) + '%'].join(',')
      )
    ].join('\n')
    
    return { success: true, data: { csv, filename: 'attendance-report.csv' }, error: null }
  },

  getClasses() {
    return ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8']
  },

  getSections() {
    return ['A', 'B', 'C']
  }
}

export default attendanceService
