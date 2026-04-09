/**
 * Real Backend API Service
 * Connects frontend to the Express.js backend
 * 
 * Base URL: http://localhost:5000/api
 * Auth: JWT Bearer token stored in localStorage
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Helper to get auth token
const getToken = () => localStorage.getItem('auth_token')

// Helper to set auth token
const setToken = (token) => {
  if (token) {
    localStorage.setItem('auth_token', token)
  } else {
    localStorage.removeItem('auth_token')
  }
}

// Standard fetch wrapper with auth and error handling
async function apiRequest(endpoint, options = {}) {
  const token = getToken()
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    const data = await response.json()

    if (!response.ok) {
      // Handle authentication errors
      if (data.error?.code === 'UNAUTHORIZED' || response.status === 401) {
        setToken(null)
        window.location.href = '/' // Redirect to login if we had one
      }
      
      throw new ApiError(data.error?.message || 'Request failed', data.error?.code, response.status)
    }

    return data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    // Network error or other fetch failure
    throw new ApiError('Network error. Please check your connection.', 'NETWORK_ERROR', 0)
  }
}

// Custom error class for API errors
export class ApiError extends Error {
  constructor(message, code, status) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
  }
}

// Transform backend student to frontend format
function transformStudent(student) {
  return {
    id: student.id,
    studentId: student.studentId,
    name: student.name,
    grade: student.grade,
    parent: student.parentName,
    parentEmail: student.parentEmail,
    status: transformStatus(student.status),
    paid: student.paidAmount,
    balance: student.balance,
    tuitionAmount: student.tuitionAmount,
    academicYear: student.academicYear,
    isActive: student.isActive,
  }
}

// Transform backend status to frontend format
function transformStatus(status) {
  const map = {
    'PAID': 'Paid',
    'PARTIAL': 'Partial',
    'UNPAID': 'Unpaid'
  }
  return map[status] || 'Unpaid'
}

// Transform frontend status to backend format
function transformStatusToBackend(status) {
  const map = {
    'Paid': 'PAID',
    'Partial': 'PARTIAL',
    'Unpaid': 'UNPAID'
  }
  return map[status] || 'UNPAID'
}

// ============================================
// AUTH API
// ============================================

export const auth = {
  async login(email, password) {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    
    if (response.success && response.data.token) {
      setToken(response.data.token)
    }
    
    return response
  },

  async logout() {
    try {
      await apiRequest('/auth/logout', { method: 'POST' })
    } finally {
      setToken(null)
    }
  },

  async getCurrentUser() {
    return await apiRequest('/auth/me')
  },

  isAuthenticated() {
    return !!getToken()
  },
}

// ============================================
// STUDENTS API
// ============================================

export const students = {
  async getAll(params = {}) {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    if (params.search) queryParams.append('search', params.search)
    if (params.grade) queryParams.append('grade', params.grade)
    if (params.status) queryParams.append('status', transformStatusToBackend(params.status))

    const queryString = queryParams.toString()
    const response = await apiRequest(`/students${queryString ? `?${queryString}` : ''}`)
    
    return {
      ...response,
      data: response.data.map(transformStudent),
    }
  },

  async getById(id) {
    const response = await apiRequest(`/students/${id}`)
    return {
      ...response,
      data: transformStudent(response.data),
    }
  },

  async create(data) {
    const response = await apiRequest('/students', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return {
      ...response,
      data: transformStudent(response.data),
    }
  },

  async update(id, data) {
    const response = await apiRequest(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return {
      ...response,
      data: transformStudent(response.data),
    }
  },

  async delete(id) {
    return await apiRequest(`/students/${id}`, {
      method: 'DELETE',
    })
  },

  async bulkCreate(studentsData) {
    return await apiRequest('/students/bulk', {
      method: 'POST',
      body: JSON.stringify(studentsData),
    })
  },
}

// ============================================
// PAYMENTS API
// ============================================

export const payments = {
  async recordPayment(studentId, amount, options = {}) {
    const response = await apiRequest('/payments/record', {
      method: 'POST',
      body: JSON.stringify({
        studentId,
        amount,
        method: options.method || 'CASH',
        reference: options.reference,
        notes: options.notes,
      }),
    })
    
    // Transform the student data in response
    return {
      ...response,
      data: {
        ...response.data,
        student: transformStudent(response.data.student),
      },
    }
  },

  async sendReminder(studentId) {
    return await apiRequest('/payments/remind', {
      method: 'POST',
      body: JSON.stringify({ studentId }),
    })
  },

  async getHistory(studentId) {
    return await apiRequest(`/payments/student/${studentId}`)
  },
}

// ============================================
// SETTINGS API
// ============================================

export const settings = {
  async get() {
    return await apiRequest('/settings')
  },

  async update(data) {
    return await apiRequest('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async uploadLogo(logoUrl) {
    return await apiRequest('/settings/logo', {
      method: 'POST',
      body: JSON.stringify({ logoUrl }),
    })
  },
}

// ============================================
// REPORTS API
// ============================================

export const reports = {
  async getMetrics() {
    const response = await apiRequest('/reports/metrics')
    return {
      ...response,
      data: {
        total: response.data.total,
        paid: response.data.paid,
        partial: response.data.partial,
        unpaid: response.data.unpaid,
        totalCollected: response.data.totalCollected,
        totalOutstanding: response.data.totalOutstanding,
      },
    }
  },

  async getSummary(grade = null) {
    const queryString = grade ? `?grade=${encodeURIComponent(grade)}` : ''
    const response = await apiRequest(`/reports/summary${queryString}`)
    
    return {
      ...response,
      data: {
        ...response.data,
        byGrade: response.data.byGrade,
        summary: response.data.summary,
      },
    }
  },

  async exportUnpaid() {
    const token = getToken()
    const response = await fetch(`${API_BASE_URL}/reports/export/unpaid`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new ApiError(error.error?.message || 'Export failed', error.error?.code, response.status)
    }
    
    const csv = await response.text()
    const filename = response.headers.get('content-disposition')
      ?.split('filename=')[1]
      ?.replace(/"/g, '') || 'unpaid-students.csv'
    
    return {
      success: true,
      data: { csv, filename },
      error: null,
    }
  },

  async exportSummary() {
    const token = getToken()
    const response = await fetch(`${API_BASE_URL}/reports/export/summary`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new ApiError(error.error?.message || 'Export failed', error.error?.code, response.status)
    }
    
    const csv = await response.text()
    const filename = response.headers.get('content-disposition')
      ?.split('filename=')[1]
      ?.replace(/"/g, '') || 'payment-summary.csv'
    
    return {
      success: true,
      data: { csv, filename },
      error: null,
    }
  },
}

// ============================================
// EXPORT
// ============================================

export const api = {
  auth,
  students,
  payments,
  settings,
  reports,
}

export default api
