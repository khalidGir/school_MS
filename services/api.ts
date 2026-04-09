const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const mockStudents = [
  { id: 1, name: 'Emma Wilson', grade: 'Grade 5', parent: 'Sarah Wilson', parentEmail: 'sarah.wilson@email.com', status: 'Paid', paid: 7000, balance: 0 },
  { id: 2, name: 'James Brown', grade: 'Grade 3', parent: 'Michael Brown', parentEmail: 'michael.brown@email.com', status: 'Partial', paid: 3500, balance: 3500 },
  { id: 3, name: 'Olivia Davis', grade: 'Grade 7', parent: 'Jennifer Davis', parentEmail: 'jennifer.davis@email.com', status: 'Unpaid', paid: 0, balance: 7000 },
  { id: 4, name: 'William Martinez', grade: 'Grade 4', parent: 'Carlos Martinez', parentEmail: 'carlos.martinez@email.com', status: 'Paid', paid: 7000, balance: 0 },
  { id: 5, name: 'Sophia Anderson', grade: 'Grade 6', parent: 'Lisa Anderson', parentEmail: 'lisa.anderson@email.com', status: 'Partial', paid: 2000, balance: 5000 },
  { id: 6, name: 'Liam Johnson', grade: 'Grade 2', parent: 'Robert Johnson', parentEmail: 'robert.johnson@email.com', status: 'Unpaid', paid: 0, balance: 7000 },
  { id: 7, name: 'Ava Thompson', grade: 'Grade 1', parent: 'Emily Thompson', parentEmail: 'emily.thompson@email.com', status: 'Paid', paid: 7000, balance: 0 },
  { id: 8, name: 'Noah Garcia', grade: 'Grade 8', parent: 'Maria Garcia', parentEmail: 'maria.garcia@email.com', status: 'Partial', paid: 1500, balance: 5500 },
]

const mockSettings = {
  schoolName: 'Springfield Elementary School',
  logo: null,
  tuition: 7000,
  reminderTemplate: 'Dear Parent/Guardian,\n\nThis is a reminder that the tuition payment for {student_name} is {balance} overdue.\n\nPlease contact the school office to arrange payment.\n\nThank you.'
}

let students = [...mockStudents]
let settings = { ...mockSettings }

export const api = {
  students: {
    async getAll() {
      await delay(800)
      return {
        success: true,
        data: students,
        error: null
      }
    },

    async getById(id) {
      await delay(300)
      const student = students.find(s => s.id === id)
      if (!student) {
        return {
          success: false,
          data: null,
          error: { code: 'NOT_FOUND', message: 'Student not found' }
        }
      }
      return {
        success: true,
        data: student,
        error: null
      }
    },

    async create(data) {
      await delay(500)
      const newStudent = {
        id: Math.max(...students.map(s => s.id), 0) + 1,
        ...data
      }
      students.push(newStudent)
      return {
        success: true,
        data: newStudent,
        error: null
      }
    },

    async update(id, data) {
      await delay(500)
      const index = students.findIndex(s => s.id === id)
      if (index === -1) {
        return {
          success: false,
          data: null,
          error: { code: 'NOT_FOUND', message: 'Student not found' }
        }
      }
      students[index] = { ...students[index], ...data }
      return {
        success: true,
        data: students[index],
        error: null
      }
    },

    async delete(id) {
      await delay(300)
      const index = students.findIndex(s => s.id === id)
      if (index === -1) {
        return {
          success: false,
          data: null,
          error: { code: 'NOT_FOUND', message: 'Student not found' }
        }
      }
      students.splice(index, 1)
      return {
        success: true,
        data: { deleted: true },
        error: null
      }
    },

    async bulkCreate(dataArray) {
      await delay(1000)
      const newStudents = dataArray.map((data, i) => ({
        id: Math.max(...students.map(s => s.id), 0) + 1 + i,
        ...data
      }))
      students.push(...newStudents)
      return {
        success: true,
        data: { created: newStudents.length, students: newStudents },
        error: null
      }
    }
  },

  payments: {
    async sendReminder(studentId) {
      await delay(600)
      const student = students.find(s => s.id === studentId)
      if (!student) {
        return {
          success: false,
          data: null,
          error: { code: 'NOT_FOUND', message: 'Student not found' }
        }
      }
      console.log(`Reminder sent to ${student.parent} (${student.parentEmail}) for ${student.name}`)
      return {
        success: true,
        data: { sent: true, recipient: student.parentEmail },
        error: null
      }
    },

    async recordPayment(studentId, amount) {
      await delay(500)
      const index = students.findIndex(s => s.id === studentId)
      if (index === -1) {
        return {
          success: false,
          data: null,
          error: { code: 'NOT_FOUND', message: 'Student not found' }
        }
      }
      const student = students[index]
      const newPaid = student.paid + amount
      const newBalance = Math.max(0, settings.tuition - newPaid)
      const newStatus = newBalance === 0 ? 'Paid' : newPaid > 0 ? 'Partial' : 'Unpaid'
      
      students[index] = {
        ...student,
        paid: newPaid,
        balance: newBalance,
        status: newStatus
      }
      return {
        success: true,
        data: students[index],
        error: null
      }
    },

    async getReport(grade = null) {
      await delay(700)
      let filtered = students
      if (grade) {
        filtered = students.filter(s => s.grade === grade)
      }
      
      const byGrade = {}
      students.forEach(s => {
        if (!byGrade[s.grade]) {
          byGrade[s.grade] = { paid: 0, partial: 0, unpaid: 0, total: 0 }
        }
        byGrade[s.grade][s.status.toLowerCase()]++
        byGrade[s.grade].total++
      })

      return {
        success: true,
        data: {
          students: filtered,
          byGrade,
          summary: {
            total: students.length,
            paid: students.filter(s => s.status === 'Paid').length,
            partial: students.filter(s => s.status === 'Partial').length,
            unpaid: students.filter(s => s.status === 'Unpaid').length
          }
        },
        error: null
      }
    },

    async exportUnpaid() {
      await delay(400)
      const unpaid = students.filter(s => s.status === 'Unpaid')
      const csv = [
        ['Student Name', 'Grade', 'Parent', 'Email', 'Balance'].join(','),
        ...unpaid.map(s => [s.name, s.grade, s.parent, s.parentEmail, s.balance].join(','))
      ].join('\n')
      return {
        success: true,
        data: { csv, filename: 'unpaid-students.csv' },
        error: null
      }
    },

    async exportSummary() {
      await delay(400)
      const totals = {
        paid: students.filter(s => s.status === 'Paid').reduce((acc, s) => acc + s.paid, 0),
        partial: students.filter(s => s.status === 'Partial').reduce((acc, s) => acc + s.paid, 0),
        unpaid: students.filter(s => s.status === 'Unpaid').reduce((acc, s) => acc + s.balance, 0)
      }
      const csv = [
        ['Status', 'Count', 'Total Amount'].join(','),
        ['Paid', students.filter(s => s.status === 'Paid').length, totals.paid].join(','),
        ['Partial', students.filter(s => s.status === 'Partial').length, totals.partial].join(','),
        ['Unpaid', students.filter(s => s.status === 'Unpaid').length, totals.unpaid].join(','),
      ].join('\n')
      return {
        success: true,
        data: { csv, filename: 'payment-summary.csv' },
        error: null
      }
    }
  },

  settings: {
    async get() {
      await delay(300)
      return {
        success: true,
        data: settings,
        error: null
      }
    },

    async update(data) {
      await delay(500)
      settings = { ...settings, ...data }
      return {
        success: true,
        data: settings,
        error: null
      }
    },

    async uploadLogo(file) {
      await delay(1000)
      const reader = new FileReader()
      return new Promise((resolve) => {
        reader.onload = () => {
          settings.logo = reader.result
          resolve({
            success: true,
            data: { logo: settings.logo },
            error: null
          })
        }
        reader.readAsDataURL(file)
      })
    }
  },

  reset() {
    students = [...mockStudents]
    settings = { ...mockSettings }
  }
}

export default api
