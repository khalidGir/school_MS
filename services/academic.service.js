const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const mockClasses = [
  { id: 1, name: 'Grade 1', sections: ['A', 'B'], capacity: 30, enrolled: 45, subjects: ['Mathematics', 'English', 'Science', 'Art', 'Physical Education'] },
  { id: 2, name: 'Grade 2', sections: ['A', 'B', 'C'], capacity: 30, enrolled: 78, subjects: ['Mathematics', 'English', 'Science', 'Art', 'Physical Education'] },
  { id: 3, name: 'Grade 3', sections: ['A', 'B'], capacity: 30, enrolled: 52, subjects: ['Mathematics', 'English', 'Science', 'Social Studies', 'Art', 'Physical Education'] },
  { id: 4, name: 'Grade 4', sections: ['A', 'B'], capacity: 35, enrolled: 60, subjects: ['Mathematics', 'English', 'Science', 'Social Studies', 'Art', 'Physical Education'] },
  { id: 5, name: 'Grade 5', sections: ['A', 'B'], capacity: 35, enrolled: 62, subjects: ['Mathematics', 'English', 'Science', 'Social Studies', 'Art', 'Physical Education'] },
  { id: 6, name: 'Grade 6', sections: ['A', 'B'], capacity: 35, enrolled: 58, subjects: ['Mathematics', 'English', 'Science', 'Social Studies', 'Art', 'Computer Science'] },
  { id: 7, name: 'Grade 7', sections: ['A', 'B'], capacity: 40, enrolled: 72, subjects: ['Mathematics', 'English', 'Science', 'Social Studies', 'Art', 'Computer Science'] },
  { id: 8, name: 'Grade 8', sections: ['A', 'B'], capacity: 40, enrolled: 68, subjects: ['Mathematics', 'English', 'Science', 'Social Studies', 'Art', 'Computer Science'] },
]

const mockSubjects = [
  { id: 1, name: 'Mathematics', code: 'MATH', classes: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8'], teachers: ['Mr. Smith', 'Ms. Johnson'], credits: 4 },
  { id: 2, name: 'English', code: 'ENG', classes: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8'], teachers: ['Mrs. Williams', 'Mr. Brown'], credits: 4 },
  { id: 3, name: 'Science', code: 'SCI', classes: ['Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8'], teachers: ['Dr. Davis', 'Ms. Miller'], credits: 4 },
  { id: 4, name: 'Social Studies', code: 'SS', classes: ['Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8'], teachers: ['Mr. Wilson', 'Mrs. Taylor'], credits: 3 },
  { id: 5, name: 'Art', code: 'ART', classes: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8'], teachers: ['Ms. Anderson'], credits: 2 },
  { id: 6, name: 'Physical Education', code: 'PE', classes: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8'], teachers: ['Coach Thomas'], credits: 2 },
  { id: 7, name: 'Computer Science', code: 'CS', classes: ['Grade 6', 'Grade 7', 'Grade 8'], teachers: ['Mr. Clark'], credits: 3 },
]

const mockExams = [
  { id: 1, name: 'Mid-Term Examination', class: 'Grade 5', subject: 'Mathematics', date: '2024-03-15', time: '09:00 AM - 11:00 AM', room: 'Room 101', totalMarks: 100, status: 'Scheduled' },
  { id: 2, name: 'Mid-Term Examination', class: 'Grade 5', subject: 'English', date: '2024-03-16', time: '09:00 AM - 11:00 AM', room: 'Room 102', totalMarks: 100, status: 'Scheduled' },
  { id: 3, name: 'Mid-Term Examination', class: 'Grade 5', subject: 'Science', date: '2024-03-17', time: '09:00 AM - 11:00 AM', room: 'Room 101', totalMarks: 100, status: 'Scheduled' },
  { id: 4, name: 'Unit Test 1', class: 'Grade 6', subject: 'Mathematics', date: '2024-02-20', time: '10:00 AM - 12:00 PM', room: 'Room 201', totalMarks: 50, status: 'Completed' },
  { id: 5, name: 'Final Examination', class: 'Grade 8', subject: 'Science', date: '2024-04-10', time: '09:00 AM - 12:00 PM', room: 'Room 301', totalMarks: 100, status: 'Scheduled' },
]

const mockGrades = [
  { id: 1, examId: 4, studentId: 'STU001', studentName: 'Emma Wilson', subject: 'Mathematics', score: 45, maxScore: 50, grade: 'A+', remarks: 'Excellent' },
  { id: 2, examId: 4, studentId: 'STU002', studentName: 'James Brown', subject: 'Mathematics', score: 38, maxScore: 50, grade: 'B+', remarks: 'Good' },
  { id: 3, examId: 4, studentId: 'STU003', studentName: 'Olivia Davis', subject: 'Mathematics', score: 42, maxScore: 50, grade: 'A', remarks: 'Very Good' },
  { id: 4, examId: 4, studentId: 'STU004', studentName: 'William Martinez', subject: 'Mathematics', score: 35, maxScore: 50, grade: 'B', remarks: 'Satisfactory' },
  { id: 5, examId: 4, studentId: 'STU005', studentName: 'Sophia Anderson', subject: 'Mathematics', score: 40, maxScore: 50, grade: 'A-', remarks: 'Very Good' },
]

let classes = [...mockClasses]
let subjects = [...mockSubjects]
let exams = [...mockExams]
let grades = [...mockGrades]

export const academicService = {
  classes: {
    async getAll() {
      await delay(400)
      return { success: true, data: classes, error: null }
    },
    async getById(id) {
      await delay(300)
      const cls = classes.find(c => c.id === parseInt(id))
      if (!cls) return { success: false, data: null, error: { code: 'NOT_FOUND', message: 'Class not found' } }
      return { success: true, data: cls, error: null }
    },
    async create(data) {
      await delay(400)
      const newClass = { id: Math.max(...classes.map(c => c.id), 0) + 1, enrolled: 0, ...data }
      classes.push(newClass)
      return { success: true, data: newClass, error: null }
    },
    async update(id, data) {
      await delay(400)
      const index = classes.findIndex(c => c.id === parseInt(id))
      if (index === -1) return { success: false, data: null, error: { code: 'NOT_FOUND', message: 'Class not found' } }
      classes[index] = { ...classes[index], ...data }
      return { success: true, data: classes[index], error: null }
    },
    async delete(id) {
      await delay(300)
      const index = classes.findIndex(c => c.id === parseInt(id))
      if (index === -1) return { success: false, data: null, error: { code: 'NOT_FOUND', message: 'Class not found' } }
      classes.splice(index, 1)
      return { success: true, data: { deleted: true }, error: null }
    }
  },
  subjects: {
    async getAll() {
      await delay(400)
      return { success: true, data: subjects, error: null }
    },
    async getById(id) {
      await delay(300)
      const subject = subjects.find(s => s.id === parseInt(id))
      if (!subject) return { success: false, data: null, error: { code: 'NOT_FOUND', message: 'Subject not found' } }
      return { success: true, data: subject, error: null }
    },
    async create(data) {
      await delay(400)
      const newSubject = { id: Math.max(...subjects.map(s => s.id), 0) + 1, ...data }
      subjects.push(newSubject)
      return { success: true, data: newSubject, error: null }
    },
    async update(id, data) {
      await delay(400)
      const index = subjects.findIndex(s => s.id === parseInt(id))
      if (index === -1) return { success: false, data: null, error: { code: 'NOT_FOUND', message: 'Subject not found' } }
      subjects[index] = { ...subjects[index], ...data }
      return { success: true, data: subjects[index], error: null }
    },
    async delete(id) {
      await delay(300)
      const index = subjects.findIndex(s => s.id === parseInt(id))
      if (index === -1) return { success: false, data: null, error: { code: 'NOT_FOUND', message: 'Subject not found' } }
      subjects.splice(index, 1)
      return { success: true, data: { deleted: true }, error: null }
    }
  },
  exams: {
    async getAll(params = {}) {
      await delay(400)
      let result = [...exams]
      if (params.class && params.class !== 'all') {
        result = result.filter(e => e.class === params.class)
      }
      if (params.subject && params.subject !== 'all') {
        result = result.filter(e => e.subject === params.subject)
      }
      return { success: true, data: result, error: null }
    },
    async getById(id) {
      await delay(300)
      const exam = exams.find(e => e.id === parseInt(id))
      if (!exam) return { success: false, data: null, error: { code: 'NOT_FOUND', message: 'Exam not found' } }
      return { success: true, data: exam, error: null }
    },
    async create(data) {
      await delay(400)
      const newExam = { id: Math.max(...exams.map(e => e.id), 0) + 1, status: 'Scheduled', ...data }
      exams.push(newExam)
      return { success: true, data: newExam, error: null }
    },
    async update(id, data) {
      await delay(400)
      const index = exams.findIndex(e => e.id === parseInt(id))
      if (index === -1) return { success: false, data: null, error: { code: 'NOT_FOUND', message: 'Exam not found' } }
      exams[index] = { ...exams[index], ...data }
      return { success: true, data: exams[index], error: null }
    },
    async delete(id) {
      await delay(300)
      const index = exams.findIndex(e => e.id === parseInt(id))
      if (index === -1) return { success: false, data: null, error: { code: 'NOT_FOUND', message: 'Exam not found' } }
      exams.splice(index, 1)
      return { success: true, data: { deleted: true }, error: null }
    }
  },
  grades: {
    async getByExam(examId) {
      await delay(300)
      const examGrades = grades.filter(g => g.examId === parseInt(examId))
      return { success: true, data: examGrades, error: null }
    },
    async getByStudent(studentId) {
      await delay(300)
      const studentGrades = grades.filter(g => g.studentId === studentId)
      return { success: true, data: studentGrades, error: null }
    },
    async create(data) {
      await delay(400)
      const newGrade = { id: Math.max(...grades.map(g => g.id), 0) + 1, ...data }
      grades.push(newGrade)
      return { success: true, data: newGrade, error: null }
    },
    async bulkCreate(examId, records) {
      await delay(600)
      const newGrades = records.map((record, i) => ({
        id: Math.max(...grades.map(g => g.id), 0) + 1 + i,
        examId: parseInt(examId),
        ...record
      }))
      grades.push(...newGrades)
      return { success: true, data: { created: newGrades.length, grades: newGrades }, error: null }
    },
    async update(id, data) {
      await delay(400)
      const index = grades.findIndex(g => g.id === parseInt(id))
      if (index === -1) return { success: false, data: null, error: { code: 'NOT_FOUND', message: 'Grade entry not found' } }
      grades[index] = { ...grades[index], ...data }
      return { success: true, data: grades[index], error: null }
    }
  },
  reportCards: {
    async generate(studentId, term) {
      await delay(600)
      const studentGrades = grades.filter(g => g.studentId === studentId)
      const reportCard = {
        studentId,
        term,
        generatedAt: new Date().toISOString(),
        subjects: studentGrades.map(g => ({
          subject: g.subject,
          score: g.score,
          maxScore: g.maxScore,
          percentage: Math.round((g.score / g.maxScore) * 100),
          grade: g.grade,
          remarks: g.remarks
        })),
        overall: {
          totalScore: studentGrades.reduce((acc, g) => acc + g.score, 0),
          totalMax: studentGrades.reduce((acc, g) => acc + g.maxScore, 0),
          percentage: studentGrades.length > 0 
            ? Math.round(studentGrades.reduce((acc, g) => acc + (g.score / g.maxScore * 100), 0) / studentGrades.length)
            : 0
        }
      }
      return { success: true, data: reportCard, error: null }
    }
  }
}

export default academicService
