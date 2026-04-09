const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const mockStudents = [
  { id: 1, studentId: 'STU001', name: 'Emma Wilson', firstName: 'Emma', lastName: 'Wilson', gender: 'Female', dateOfBirth: '2015-03-15', grade: 'Grade 5', section: 'A', rollNumber: '5A01', parentName: 'Sarah Wilson', parentEmail: 'sarah.wilson@email.com', parentPhone: '+1-555-0101', address: '123 Oak Street, Springfield', status: 'Active', admissionDate: '2020-09-01', attendance: 95, paymentStatus: 'Paid' },
  { id: 2, studentId: 'STU002', name: 'James Brown', firstName: 'James', lastName: 'Brown', gender: 'Male', dateOfBirth: '2016-07-22', grade: 'Grade 4', section: 'B', rollNumber: '4B02', parentName: 'Michael Brown', parentEmail: 'michael.brown@email.com', parentPhone: '+1-555-0102', address: '456 Maple Avenue, Springfield', status: 'Active', admissionDate: '2021-09-01', attendance: 88, paymentStatus: 'Partial' },
  { id: 3, studentId: 'STU003', name: 'Olivia Davis', firstName: 'Olivia', lastName: 'Davis', gender: 'Female', dateOfBirth: '2014-11-08', grade: 'Grade 6', section: 'A', rollNumber: '6A01', parentName: 'Jennifer Davis', parentEmail: 'jennifer.davis@email.com', parentPhone: '+1-555-0103', address: '789 Pine Road, Springfield', status: 'Active', admissionDate: '2019-09-01', attendance: 92, paymentStatus: 'Unpaid' },
  { id: 4, studentId: 'STU004', name: 'William Martinez', firstName: 'William', lastName: 'Martinez', gender: 'Male', dateOfBirth: '2015-05-30', grade: 'Grade 5', section: 'A', rollNumber: '5A02', parentName: 'Carlos Martinez', parentEmail: 'carlos.martinez@email.com', parentPhone: '+1-555-0104', address: '321 Elm Court, Springfield', status: 'Active', admissionDate: '2020-09-01', attendance: 97, paymentStatus: 'Paid' },
  { id: 5, studentId: 'STU005', name: 'Sophia Anderson', firstName: 'Sophia', lastName: 'Anderson', gender: 'Female', dateOfBirth: '2015-09-12', grade: 'Grade 5', section: 'B', rollNumber: '5B01', parentName: 'Lisa Anderson', parentEmail: 'lisa.anderson@email.com', parentPhone: '+1-555-0105', address: '654 Cedar Lane, Springfield', status: 'Active', admissionDate: '2020-09-01', attendance: 85, paymentStatus: 'Partial' },
  { id: 6, studentId: 'STU006', name: 'Liam Johnson', firstName: 'Liam', lastName: 'Johnson', gender: 'Male', dateOfBirth: '2017-02-28', grade: 'Grade 3', section: 'A', rollNumber: '3A01', parentName: 'Robert Johnson', parentEmail: 'robert.johnson@email.com', parentPhone: '+1-555-0106', address: '987 Birch Drive, Springfield', status: 'Active', admissionDate: '2022-09-01', attendance: 90, paymentStatus: 'Unpaid' },
  { id: 7, studentId: 'STU007', name: 'Ava Thompson', firstName: 'Ava', lastName: 'Thompson', gender: 'Female', dateOfBirth: '2018-04-15', grade: 'Grade 2', section: 'A', rollNumber: '2A01', parentName: 'Emily Thompson', parentEmail: 'emily.thompson@email.com', parentPhone: '+1-555-0107', address: '147 Spruce Way, Springfield', status: 'Active', admissionDate: '2023-09-01', attendance: 98, paymentStatus: 'Paid' },
  { id: 8, studentId: 'STU008', name: 'Noah Garcia', firstName: 'Noah', lastName: 'Garcia', gender: 'Male', dateOfBirth: '2013-08-20', grade: 'Grade 7', section: 'B', rollNumber: '7B01', parentName: 'Maria Garcia', parentEmail: 'maria.garcia@email.com', parentPhone: '+1-555-0108', address: '258 Willow Street, Springfield', status: 'Active', admissionDate: '2018-09-01', attendance: 93, paymentStatus: 'Partial' },
]

const mockClasses = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8']
const mockSections = ['A', 'B', 'C']

let students = [...mockStudents]

export const studentService = {
  async getAll(params = {}) {
    await delay(500)
    let result = [...students]
    
    if (params.search) {
      const term = params.search.toLowerCase()
      result = result.filter(s => 
        s.name.toLowerCase().includes(term) || 
        s.studentId.toLowerCase().includes(term) ||
        s.parentName.toLowerCase().includes(term)
      )
    }
    
    if (params.grade && params.grade !== 'all') {
      result = result.filter(s => s.grade === params.grade)
    }
    
    if (params.status && params.status !== 'all') {
      result = result.filter(s => s.status === params.status)
    }
    
    if (params.section && params.section !== 'all') {
      result = result.filter(s => s.section === params.section)
    }
    
    const page = params.page || 1
    const limit = params.limit || 10
    const total = result.length
    const start = (page - 1) * limit
    result = result.slice(start, start + limit)
    
    return {
      success: true,
      data: { students: result, total, page, totalPages: Math.ceil(total / limit) },
      error: null
    }
  },

  async getById(id) {
    await delay(300)
    const student = students.find(s => s.id === parseInt(id) || s.studentId === id)
    if (!student) {
      return { success: false, data: null, error: { code: 'NOT_FOUND', message: 'Student not found' } }
    }
    return { success: true, data: student, error: null }
  },

  async create(data) {
    await delay(500)
    const newStudent = {
      id: Math.max(...students.map(s => s.id), 0) + 1,
      studentId: `STU${String(Math.max(...students.map(s => parseInt(s.studentId.replace('STU', ''))), 0) + 1).padStart(3, '0')}`,
      attendance: 0,
      paymentStatus: 'Unpaid',
      status: 'Active',
      admissionDate: new Date().toISOString().split('T')[0],
      ...data
    }
    students.push(newStudent)
    return { success: true, data: newStudent, error: null }
  },

  async update(id, data) {
    await delay(500)
    const index = students.findIndex(s => s.id === parseInt(id) || s.studentId === id)
    if (index === -1) {
      return { success: false, data: null, error: { code: 'NOT_FOUND', message: 'Student not found' } }
    }
    students[index] = { ...students[index], ...data }
    return { success: true, data: students[index], error: null }
  },

  async delete(id) {
    await delay(300)
    const index = students.findIndex(s => s.id === parseInt(id) || s.studentId === id)
    if (index === -1) {
      return { success: false, data: null, error: { code: 'NOT_FOUND', message: 'Student not found' } }
    }
    students.splice(index, 1)
    return { success: true, data: { deleted: true }, error: null }
  },

  async bulkCreate(dataArray) {
    await delay(800)
    const newStudents = dataArray.map((data, i) => ({
      id: Math.max(...students.map(s => s.id), 0) + 1 + i,
      studentId: `STU${String(Math.max(...students.map(s => parseInt(s.studentId.replace('STU', ''))), 0) + 1 + i).padStart(3, '0')}`,
      attendance: 0,
      paymentStatus: 'Unpaid',
      status: 'Active',
      admissionDate: new Date().toISOString().split('T')[0],
      ...data
    }))
    students.push(...newStudents)
    return { success: true, data: { created: newStudents.length, students: newStudents }, error: null }
  },

  async getAttendance(studentId) {
    await delay(300)
    const attendance = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: ['Present', 'Absent', 'Late'][Math.floor(Math.random() * 3)]
    }))
    return { success: true, data: attendance, error: null }
  },

  async getGrades(studentId) {
    await delay(300)
    const grades = [
      { subject: 'Mathematics', term: 'Term 1', score: 85, maxScore: 100, grade: 'A' },
      { subject: 'English', term: 'Term 1', score: 78, maxScore: 100, grade: 'B+' },
      { subject: 'Science', term: 'Term 1', score: 92, maxScore: 100, grade: 'A+' },
      { subject: 'Mathematics', term: 'Term 2', score: 88, maxScore: 100, grade: 'A' },
      { subject: 'English', term: 'Term 2', score: 81, maxScore: 100, grade: 'A-' },
      { subject: 'Science', term: 'Term 2', score: 95, maxScore: 100, grade: 'A+' },
    ]
    return { success: true, data: grades, error: null }
  },

  async getPayments(studentId) {
    await delay(300)
    const payments = [
      { id: 1, amount: 3500, date: '2024-01-15', method: 'Cash', reference: 'CASH-001' },
      { id: 2, amount: 3500, date: '2024-02-10', method: 'Bank Transfer', reference: 'TRF-001' },
    ]
    return { success: true, data: payments, error: null }
  },

  getGradesList() {
    return mockClasses
  },

  getSectionsList() {
    return mockSections
  }
}

export default studentService
