import { useEffect, useRef } from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) {
  const confirmRef = useRef(null)

  useEffect(() => {
    if (isOpen && confirmRef.current) {
      confirmRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const buttonStyles = {
    danger: 'bg-[#c73e2c] hover:bg-[#a33223] focus:ring-[#c73e2c]/20',
    warning: 'bg-[#b45309] hover:bg-[#92400e] focus:ring-[#b45309]/20',
    primary: 'bg-primary hover:bg-primary-light focus:ring-2 focus:ring-primary/20',
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-lg w-full max-w-md p-6 slide-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <div className="flex items-start gap-4 mb-4">
          {variant !== 'primary' && (
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              variant === 'danger' ? 'bg-[#fee2e2]' : 'bg-[#fef4e6]'
            }`}>
              <ExclamationTriangleIcon className={`w-5 h-5 ${
                variant === 'danger' ? 'text-[#c73e2c]' : 'text-[#b45309]'
              }`} />
            </div>
          )}
          <div className="flex-1">
            <h2 id="dialog-title" className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="mt-2 text-sm text-gray-500">{message}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition-colors ${buttonStyles[variant]}`}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
