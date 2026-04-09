const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const mockStaff = [
  { id: 1, employeeId: 'EMP001', name: 'John Smith', email: 'john.smith@school.edu', phone: '555-0101', role: 'Teacher', department: 'Mathematics', qualification: 'M.Sc.', joiningDate: '2020-03-15', status: 'Active', salary: 45000 },
  { id: 2, employeeId: 'EMP002', name: 'Sarah Johnson', email: 'sarah.j@school.edu', phone: '555-0102', role: 'Principal', department: 'Administration', qualification: 'Ph.D.', joiningDate: '2018-01-10', status: 'Active', salary: 75000 },
  { id: 3, employeeId: 'EMP003', name: 'Michael Brown', email: 'michael.b@school.edu', phone: '555-0103', role: 'Teacher', department: 'Science', qualification: 'M.Sc.', joiningDate: '2019-08-20', status: 'Active', salary: 42000 },
  { id: 4, employeeId: 'EMP004', name: 'Emily Davis', email: 'emily.d@school.edu', phone: '555-0104', role: 'Admin Staff', department: 'Front Office', qualification: 'B.Com.', joiningDate: '2021-06-01', status: 'Active', salary: 28000 },
  { id: 5, employeeId: 'EMP005', name: 'David Wilson', email: 'david.w@school.edu', phone: '555-0105', role: 'Support Staff', department: 'Maintenance', qualification: 'High School', joiningDate: '2022-02-15', status: 'Active', salary: 22000 },
]

const mockLeaves = [
  { id: 1, staffId: 1, type: 'Sick Leave', startDate: '2024-01-20', endDate: '2024-01-22', reason: 'Medical appointment', status: 'Approved', appliedDate: '2024-01-15' },
  { id: 2, staffId: 3, type: 'Casual Leave', startDate: '2024-02-05', endDate: '2024-02-07', reason: 'Family function', status: 'Pending', appliedDate: '2024-01-28' },
]

let staff = [...mockStaff]
let leaves = [...mockLeaves]

export const staffService = {
  async getAll(filters = {}) {
    await delay(500)
    let result = [...staff]
    if (filters.role) result = result.filter(s => s.role === filters.role)
    if (filters.department) result = result.filter(s => s.department === filters.department)
    if (filters.status) result = result.filter(s => s.status === filters.status)
    if (filters.search) {
      const term = filters.search.toLowerCase()
      result = result.filter(s => s.name.toLowerCase().includes(term) || s.employeeId.toLowerCase().includes(term))
    }
    return { success: true, data: result }
  },

  async getById(id) {
    await delay(300)
    const member = staff.find(s => s.id === id)
    if (!member) return { success: false, error: { message: 'Staff member not found' } }
    return { success: true, data: member }
  },

  async create(data) {
    await delay(500)
    const newStaff = {
      id: Date.now(),
      employeeId: `EMP${String(staff.length + 1).padStart(3, '0')}`,
      ...data,
      status: 'Active',
    }
    staff.push(newStaff)
    return { success: true, data: newStaff }
  },

  async update(id, data) {
    await delay(400)
    const index = staff.findIndex(s => s.id === id)
    if (index === -1) return { success: false, error: { message: 'Staff member not found' } }
    staff[index] = { ...staff[index], ...data }
    return { success: true, data: staff[index] }
  },

  async delete(id) {
    await delay(300)
    staff = staff.filter(s => s.id !== id)
    return { success: true, data: { deleted: true } }
  },

  async getLeaves(staffId = null) {
    await delay(400)
    let result = [...leaves]
    if (staffId) result = result.filter(l => l.staffId === staffId)
    return { success: true, data: result }
  },

  async applyLeave(data) {
    await delay(500)
    const newLeave = {
      id: Date.now(),
      ...data,
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0],
    }
    leaves.push(newLeave)
    return { success: true, data: newLeave }
  },

  async updateLeaveStatus(id, status) {
    await delay(400)
    const index = leaves.findIndex(l => l.id === id)
    if (index === -1) return { success: false, error: { message: 'Leave not found' } }
    leaves[index] = { ...leaves[index], status }
    return { success: true, data: leaves[index] }
  },

  async getPayroll(staffId = null) {
    await delay(500)
    const payroll = staff.map(s => ({
      staffId: s.id,
      staffName: s.name,
      employeeId: s.employeeId,
      role: s.role,
      basicSalary: s.salary,
      allowances: s.salary * 0.1,
      deductions: s.salary * 0.05,
      netSalary: s.salary * 1.05,
      month: 'January 2024',
      status: 'Paid',
    }))
    if (staffId) return { success: true, data: payroll.filter(p => p.staffId === staffId) }
    return { success: true, data: payroll }
  },

  async generatePayslip(staffId, month) {
    await delay(400)
    const member = staff.find(s => s.id === staffId)
    if (!member) return { success: false, error: { message: 'Staff not found' } }
    return {
      success: true,
      data: {
        staffName: member.name,
        employeeId: member.employeeId,
        role: member.role,
        month,
        basicSalary: member.salary,
        allowances: member.salary * 0.1,
        deductions: member.salary * 0.05,
        netSalary: member.salary * 1.05,
        accountNumber: '****1234',
      }
    }
  },

  async getRoles() {
    return {
      success: true,
      data: ['Teacher', 'Principal', 'Vice Principal', 'Admin Staff', 'Support Staff', 'Librarian']
    }
  },

  async getDepartments() {
    return {
      success: true,
      data: ['Mathematics', 'Science', 'English', 'Administration', 'Front Office', 'Maintenance', 'Library']
    }
  },
}

export default staffService
