import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api.real.js'

const AppContext = createContext(null)

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

export function AppProvider({ children }) {
  const [students, setStudents] = useState([])
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)

  const fetchStudents = useCallback(async () => {
    try {
      const response = await api.students.getAll()
      if (response.success) {
        setStudents(response.data)
      } else {
        setError(response.error)
      }
    } catch (err) {
      console.error('Failed to fetch students:', err)
      setError({ code: err.code || 'FETCH_ERROR', message: err.message })
    }
  }, [])

  const fetchSettings = useCallback(async () => {
    try {
      const response = await api.settings.get()
      if (response.success) {
        setSettings(response.data)
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err)
    }
  }, [])

  const fetchMetrics = useCallback(async () => {
    try {
      const response = await api.reports.getMetrics()
      return response.data
    } catch (err) {
      console.error('Failed to fetch metrics:', err)
      return null
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      // Check if api.auth is available (real API loaded)
      if (api.auth && api.auth.isAuthenticated && api.auth.isAuthenticated()) {
        try {
          const userResponse = await api.auth.getCurrentUser()
          if (userResponse.success) {
            setUser(userResponse.data)
          }
        } catch (err) {
          console.error('Failed to get current user:', err)
        }
      }
      await Promise.all([fetchStudents(), fetchSettings()])
      setLoading(false)
    }
    init()
  }, [fetchStudents, fetchSettings])

  const login = useCallback(async (email, password) => {
    const response = await api.auth.login(email, password)
    if (response.success) {
      setUser(response.data.user)
    }
    return response
  }, [])

  const logout = useCallback(async () => {
    await api.auth.logout()
    setUser(null)
    setStudents([])
  }, [])

  const addStudent = useCallback(async (studentData) => {
    const response = await api.students.create(studentData)
    if (response.success) {
      setStudents(prev => [...prev, response.data])
    }
    return response
  }, [])

  const updateStudent = useCallback(async (id, data) => {
    const response = await api.students.update(id, data)
    if (response.success) {
      setStudents(prev => prev.map(s => s.id === id ? response.data : s))
    }
    return response
  }, [])

  const deleteStudent = useCallback(async (id) => {
    const response = await api.students.delete(id)
    if (response.success) {
      setStudents(prev => prev.filter(s => s.id !== id))
    }
    return response
  }, [])

  const bulkAddStudents = useCallback(async (studentsData) => {
    const response = await api.students.bulkCreate(studentsData)
    if (response.success) {
      setStudents(prev => [...prev, ...response.data.students])
    }
    return response
  }, [])

  const sendReminder = useCallback(async (studentId) => {
    return await api.payments.sendReminder(studentId)
  }, [])

  const recordPayment = useCallback(async (studentId, amount, options) => {
    const response = await api.payments.recordPayment(studentId, amount, options)
    if (response.success) {
      // Update the student in the list with the new payment data
      setStudents(prev => prev.map(s => 
        s.id === studentId ? {
          ...s,
          paid: response.data.student.paid,
          balance: response.data.student.balance,
          status: response.data.student.status,
        } : s
      ))
    }
    return response
  }, [])

  const updateSettings = useCallback(async (data) => {
    const response = await api.settings.update(data)
    if (response.success) {
      setSettings(response.data)
    }
    return response
  }, [])

  const uploadLogo = useCallback(async (file) => {
    // Convert file to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = async () => {
        try {
          const response = await api.settings.uploadLogo(reader.result)
          if (response.success) {
            setSettings(prev => prev ? { ...prev, logo: response.data.logo } : null)
          }
          resolve(response)
        } catch (err) {
          reject(err)
        }
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }, [])

  const getMetrics = useCallback(() => {
    const total = students.length
    const paid = students.filter(s => s.status === 'Paid').length
    const partial = students.filter(s => s.status === 'Partial').length
    const unpaid = students.filter(s => s.status === 'Unpaid').length
    return { total, paid, partial, unpaid }
  }, [students])

  const value = {
    students,
    settings,
    user,
    loading,
    error,
    login,
    logout,
    fetchStudents,
    fetchSettings,
    fetchMetrics,
    addStudent,
    updateStudent,
    deleteStudent,
    bulkAddStudents,
    sendReminder,
    recordPayment,
    updateSettings,
    uploadLogo,
    getMetrics,
    api,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContext
