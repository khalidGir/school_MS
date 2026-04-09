import { useState, useRef } from 'react'
import { CloudArrowUpIcon, XMarkIcon, DocumentIcon } from '@heroicons/react/24/outline'

export default function FileUpload({
  onChange,
  accept,
  multiple = false,
  maxSize = 5,
  disabled = false,
  preview = true,
  className = '',
}) {
  const [files, setFiles] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled) return

    const droppedFiles = Array.from(e.dataTransfer.files)
    processFiles(droppedFiles)
  }

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || [])
    processFiles(selectedFiles)
  }

  const processFiles = (newFiles) => {
    const validFiles = newFiles.filter(file => {
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File "${file.name}" exceeds ${maxSize}MB limit`)
        return false
      }
      return true
    })

    const filesToAdd = multiple ? [...files, ...validFiles] : validFiles.slice(0, 1)
    setFiles(filesToAdd)
    onChange(multiple ? filesToAdd : filesToAdd[0])
  }

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    onChange(multiple ? newFiles : null)
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const isImage = (file) => file.type.startsWith('image/')

  return (
    <div className={className}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          disabled ? 'bg-gray-100 cursor-not-allowed opacity-50' : ''
        } ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <CloudArrowUpIcon className={`w-10 h-10 mx-auto mb-3 ${isDragging ? 'text-primary' : 'text-gray-400'}`} />
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-medium text-primary">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-400">
          {accept?.replace(/\*/g, '').toUpperCase()} files up to {maxSize}MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
        />
      </div>

      {preview && files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
            >
              {isImage(file) ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-10 h-10 object-cover rounded"
                />
              ) : (
                <DocumentIcon className="w-10 h-10 text-gray-400" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
