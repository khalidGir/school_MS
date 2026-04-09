export const formatCurrency = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export const formatNumber = (num) => {
  if (typeof num !== 'number' || isNaN(num)) return '0'
  return new Intl.NumberFormat('en-US').format(num)
}

export const formatPercent = (value, decimals = 1) => {
  if (typeof value !== 'number' || isNaN(value)) return '0%'
  return `${value.toFixed(decimals)}%`
}

export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const getStatusOrder = (status) => {
  const order = { Unpaid: 0, Partial: 1, Paid: 2 }
  return order[status] ?? 3
}

export const sortByStatus = (data, field = 'status') => {
  return [...data].sort((a, b) => getStatusOrder(a[field]) - getStatusOrder(b[field]))
}

export const filterBySearch = (data, searchTerm, fields = ['name', 'parent']) => {
  if (!searchTerm) return data
  const term = searchTerm.toLowerCase().trim()
  return data.filter(item =>
    fields.some(field => 
      item[field]?.toLowerCase().includes(term)
    )
  )
}

export const filterByStatus = (data, status) => {
  if (!status || status === 'all') return data
  return data.filter(item => item.status === status)
}

export const filterByGrade = (data, grade) => {
  if (!grade || grade === 'all') return data
  return data.filter(item => item.grade === grade)
}

export const getUniqueGrades = (data) => {
  return [...new Set(data.map(item => item.grade))].sort()
}
