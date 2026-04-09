import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'

const ToastContext = createContext(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

const toastIcons = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  info: InformationCircleIcon,
}

const toastStyles = {
  success: 'bg-[#e8f5e9] border-[#2c7a4d] text-[#2c7a4d]',
  error: 'bg-[#fee2e2] border-[#c73e2c] text-[#c73e2c]',
  info: 'bg-[#e6f0fa] border-[#1e3a5f] text-[#1e3a5f]',
}

function Toast({ id, type, message, onClose }) {
  const Icon = toastIcons[type]

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, 4000)
    return () => clearTimeout(timer)
  }, [id, onClose])

  return (
    <div 
      className={`flex items-center gap-3 px-4 py-3 rounded-md border-l-4 shadow-lg slide-down ${toastStyles[type]}`}
      role="alert"
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="p-1 hover:opacity-70 transition-opacity rounded"
        aria-label="Dismiss"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((type, message) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, type, message }])
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = {
    success: (message) => addToast('success', message),
    error: (message) => addToast('error', message),
    info: (message) => addToast('info', message),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2 w-80" aria-live="polite">
        {toasts.map(t => (
          <Toast key={t.id} {...t} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
