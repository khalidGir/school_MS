import { useEffect, useRef } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showClose = true,
  footer 
}) => {
  const modalRef = useRef(null)

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw]'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
      <div 
        ref={modalRef}
        className={`relative bg-white rounded-lg w-full ${sizeClasses[size]} slide-in`}
        role="dialog"
        aria-modal="true"
      >
        {(title || showClose) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
            {showClose && (
              <button
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md ml-auto"
                aria-label="Close modal"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
          {children}
        </div>
        {footer && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal
