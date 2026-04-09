const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const mockFeeHeads = [
  { id: 1, name: 'Tuition Fee', description: 'Monthly tuition', isActive: true },
  { id: 2, name: 'Admission Fee', description: 'One-time admission', isActive: true },
  { id: 3, name: 'Lab Fee', description: 'Laboratory charges', isActive: true },
  { id: 4, name: 'Library Fee', description: 'Library charges', isActive: true },
  { id: 5, name: 'Sports Fee', description: 'Sports activities', isActive: true },
  { id: 6, name: 'Exam Fee', description: 'Examination charges', isActive: true },
]

const mockFeeStructures = [
  { id: 1, className: 'Grade 1', feeHeadId: 1, amount: 5000, term: 'Annual' },
  { id: 2, className: 'Grade 2', feeHeadId: 1, amount: 5500, term: 'Annual' },
  { id: 3, className: 'Grade 3', feeHeadId: 1, amount: 6000, term: 'Annual' },
]

const mockConcessions = [
  { id: 1, studentId: 1, type: 'Merit', percentage: 20, reason: 'Top performer' },
  { id: 2, studentId: 2, type: 'Sibling', percentage: 10, reason: 'Sibling discount' },
]

let feeHeads = [...mockFeeHeads]
let feeStructures = [...mockFeeStructures]
let concessions = [...mockConcessions]

export const feeService = {
  async getFeeHeads() {
    await delay(500)
    return { success: true, data: feeHeads }
  },

  async createFeeHead(data) {
    await delay(400)
    const newHead = { id: Date.now(), ...data, isActive: true }
    feeHeads.push(newHead)
    return { success: true, data: newHead }
  },

  async updateFeeHead(id, data) {
    await delay(400)
    const index = feeHeads.findIndex(h => h.id === id)
    if (index === -1) return { success: false, error: { message: 'Fee head not found' } }
    feeHeads[index] = { ...feeHeads[index], ...data }
    return { success: true, data: feeHeads[index] }
  },

  async getFeeStructures() {
    await delay(500)
    return { success: true, data: feeStructures }
  },

  async createFeeStructure(data) {
    await delay(400)
    const newStructure = { id: Date.now(), ...data }
    feeStructures.push(newStructure)
    return { success: true, data: newStructure }
  },

  async updateFeeStructure(id, data) {
    await delay(400)
    const index = feeStructures.findIndex(s => s.id === id)
    if (index === -1) return { success: false, error: { message: 'Structure not found' } }
    feeStructures[index] = { ...feeStructures[index], ...data }
    return { success: true, data: feeStructures[index] }
  },

  async getConcessions() {
    await delay(400)
    return { success: true, data: concessions }
  },

  async createConcession(data) {
    await delay(400)
    const newConcession = { id: Date.now(), ...data }
    concessions.push(newConcession)
    return { success: true, data: newConcession }
  },

  async updateConcession(id, data) {
    await delay(400)
    const index = concessions.findIndex(c => c.id === id)
    if (index === -1) return { success: false, error: { message: 'Concession not found' } }
    concessions[index] = { ...concessions[index], ...data }
    return { success: true, data: concessions[index] }
  },

  async deleteConcession(id) {
    await delay(300)
    concessions = concessions.filter(c => c.id !== id)
    return { success: true, data: { deleted: true } }
  },

  async getDashboardStats() {
    await delay(400)
    return {
      success: true,
      data: {
        totalCollected: 125000,
        pendingAmount: 45000,
        defaulters: 12,
        concessionAmount: 8500,
        todayCollection: 8500,
        monthlyTrend: '+12%',
      }
    }
  },

  async getDefaulters(grade = null) {
    await delay(500)
    const defaulters = [
      { id: 3, studentName: 'Olivia Davis', grade: 'Grade 7', amountDue: 7000, daysOverdue: 30 },
      { id: 6, studentName: 'Liam Johnson', grade: 'Grade 2', amountDue: 7000, daysOverdue: 45 },
    ]
    return { success: true, data: grade ? defaulters.filter(d => d.grade === grade) : defaulters }
  },

  async getCollectionReport(startDate, endDate) {
    await delay(600)
    return {
      success: true,
      data: {
        collections: [
          { date: '2024-01-15', amount: 5000, studentName: 'Emma Wilson', method: 'Cash' },
          { date: '2024-01-14', amount: 3500, studentName: 'James Brown', method: 'Online' },
        ],
        total: 8500,
      }
    }
  },
}

export default feeService
