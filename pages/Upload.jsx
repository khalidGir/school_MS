import { useState, useCallback, useMemo, useRef } from 'react'
import { CloudArrowUpIcon, DocumentIcon, XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import Papa from 'papaparse'
import Button from '../components/Button'
import { useToast } from '../components/Toast'

const requiredFields = [
  { key: 'studentName', label: 'Student Name', required: true },
  { key: 'amount', label: 'Amount Paid', required: true },
  { key: 'status', label: 'Status', required: true },
  { key: 'month', label: 'Month', required: false },
  { key: 'grade', label: 'Grade', required: false },
  { key: 'parentName', label: 'Parent Name', required: false },
  { key: 'parentEmail', label: 'Parent Email', required: false },
]

const statusKeywords = ['paid', 'partial', 'unpaid', 'status', 'payment']
const amountKeywords = ['amount', 'paid', 'payment', 'fee', 'tuition']
const nameKeywords = ['name', 'student', 'student name']
const monthKeywords = ['month', 'date', 'period']
const gradeKeywords = ['grade', 'class', 'level', 'year']
const parentKeywords = ['parent', 'guardian', 'mother', 'father']

function detectColumnMappings(headers) {
  const mappings = {}
  const lowerHeaders = headers.map(h => (h || '').toLowerCase().trim())

  requiredFields.forEach(field => {
    const keywords = getKeywordsForField(field.key)
    const matchIndex = lowerHeaders.findIndex(h => keywords.some(kw => h.includes(kw)))
    mappings[field.key] = matchIndex >= 0 ? matchIndex : null
  })

  return mappings
}

function getKeywordsForField(key) {
  switch (key) {
    case 'studentName': return nameKeywords
    case 'amount': return amountKeywords
    case 'status': return statusKeywords
    case 'month': return monthKeywords
    case 'grade': return gradeKeywords
    case 'parentName': return parentKeywords
    case 'parentEmail': return ['email', 'mail', 'e-mail', 'parent email']
    default: return []
  }
}

function parseStatus(value) {
  const lower = (value || '').toLowerCase().trim()
  if (lower.includes('paid') && !lower.includes('partial')) return 'Paid'
  if (lower.includes('partial')) return 'Partial'
  if (lower.includes('unpaid') || lower.includes('pending')) return 'Unpaid'
  return null
}

function validateCSVData(rawData, mappings) {
  const errors = []
  
  rawData.forEach((row, index) => {
    const rowNum = index + 2
    const studentName = row[mappings.studentName]
    
    if (!studentName || !studentName.trim()) {
      errors.push(`Row ${rowNum}: Missing student name`)
    }
    
    const amount = row[mappings.amount]
    if (amount && isNaN(parseFloat(amount))) {
      errors.push(`Row ${rowNum}: Invalid amount "${amount}"`)
    }
    
    const status = row[mappings.status]
    if (status && !parseStatus(status)) {
      errors.push(`Row ${rowNum}: Invalid status "${status}" (use: Paid, Partial, Unpaid)`)
    }
  })
  
  return errors
}

function Upload() {
  const navigate = useNavigate()
  const toast = useToast()
  const fileInputRef = useRef(null)
  
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState(null)
  const [rawData, setRawData] = useState([])
  const [headers, setHeaders] = useState([])
  const [mappings, setMappings] = useState({})
  const [validationErrors, setValidationErrors] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [error, setError] = useState(null)

  const isMappingComplete = useMemo(() => {
    return requiredFields
      .filter(f => f.required)
      .every(f => mappings[f.key] !== null && mappings[f.key] !== undefined)
  }, [mappings])

  const previewData = useMemo(() => {
    if (!rawData.length || Object.values(mappings).every(m => m === null)) return []
    return rawData.slice(0, 5).map(row => {
      const mapped = {}
      requiredFields.forEach(field => {
        if (mappings[field.key] !== null && mappings[field.key] !== undefined) {
          mapped[field.key] = row[mappings[field.key]] || ''
        }
      })
      return mapped
    })
  }, [rawData, mappings])

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    setError(null)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv'))) {
      processFile(droppedFile)
    } else {
      setError('Please upload a CSV file (.csv)')
    }
  }, [])

  const handleFileSelect = useCallback((e) => {
    const selectedFile = e.target.files[0]
    setError(null)
    setUploadSuccess(false)
    if (selectedFile && (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv'))) {
      processFile(selectedFile)
    } else {
      setError('Please upload a CSV file (.csv)')
    }
  }, [])

  const processFile = (csvFile) => {
    setFile(csvFile)
    setValidationErrors([])
    
    Papa.parse(csvFile, {
      complete: (results) => {
        const data = results.data.filter(row => row.some(cell => cell && cell.trim()))
        if (data.length < 2) {
          setError('CSV file is empty or has no data rows')
          return
        }
        const headers = data[0] || []
        const rows = data.slice(1)
        setHeaders(headers)
        setRawData(rows)
        setMappings(detectColumnMappings(headers))
        
        if (rows.length > 0) {
          const errors = validateCSVData(rows, detectColumnMappings(headers))
          setValidationErrors(errors.slice(0, 5))
        }
      },
      error: (err) => {
        setError('Failed to parse CSV file. Please check the file format.')
        console.error(err)
      }
    })
  }

  const handleMappingChange = (fieldKey, columnIndex) => {
    const newMappings = {
      ...mappings,
      [fieldKey]: columnIndex === '' ? null : parseInt(columnIndex)
    }
    setMappings(newMappings)
    
    if (rawData.length > 0) {
      const errors = validateCSVData(rawData, newMappings)
      setValidationErrors(errors.slice(0, 5))
    }
  }

  const handleClear = () => {
    setFile(null)
    setRawData([])
    setHeaders([])
    setMappings({})
    setError(null)
    setValidationErrors([])
    setUploadSuccess(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleConfirmUpload = async () => {
    if (!isMappingComplete) return
    
    setUploading(true)
    setUploadProgress(0)
    setError(null)

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90))
    }, 100)

    await new Promise(resolve => setTimeout(resolve, 1500))

    const studentsToAdd = rawData.map(row => {
      const amount = parseFloat(row[mappings.amount]) || 0
      const tuition = 7000
      const balance = tuition - amount
      const status = parseStatus(row[mappings.status]) || 'Unpaid'
      
      return {
        name: row[mappings.studentName] || '',
        grade: mappings.grade !== null ? row[mappings.grade] || '' : '',
        parent: mappings.parentName !== null ? row[mappings.parentName] || '' : '',
        parentEmail: mappings.parentEmail !== null ? row[mappings.parentEmail] || '' : '',
        status,
        paid: amount,
        balance: status === 'Paid' ? 0 : balance
      }
    })

    clearInterval(progressInterval)
    setUploadProgress(100)

    console.log('Uploading students:', studentsToAdd)

    setTimeout(() => {
      setUploading(false)
      setUploadSuccess(true)
      toast.success(`Successfully imported ${studentsToAdd.length} students!`)
      
      setTimeout(() => {
        handleClear()
        navigate('/')
      }, 1500)
    }, 500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Upload Payment Data</h1>
        <p className="text-sm text-gray-500 mt-1">Upload CSV files to import student payment records</p>
      </div>

      {uploadSuccess && (
        <div className="bg-[#e8f5e9] border border-[#2c7a4d] rounded-lg p-4 flex items-center gap-3 fade-in">
          <CheckCircleIcon className="w-5 h-5 text-[#2c7a4d]" />
          <p className="text-sm font-medium text-[#2c7a4d]">File uploaded successfully! Redirecting...</p>
        </div>
      )}

      {error && (
        <div className="bg-[#fee2e2] border border-[#c73e2c] rounded-lg p-4 flex items-start gap-3 fade-in">
          <ExclamationTriangleIcon className="w-5 h-5 text-[#c73e2c] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-[#c73e2c]">Upload Error</p>
            <p className="text-sm text-[#c73e2c] mt-1">{error}</p>
          </div>
        </div>
      )}

      {!file ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
            dragActive
              ? 'border-[#1e3a5f] bg-[#f0f4f9]'
              : 'border-gray-200 bg-gray-50 hover:border-gray-300'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-base font-medium text-gray-900 mb-1">
            Drag and drop CSV file or click to browse
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Format: Student ID, Student Name, Amount, Status, Month
          </p>
          <p className="text-xs text-gray-400 mb-4">Accepted file: .csv, max 10MB</p>
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button variant="primary" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
            Select File
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200/50 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <DocumentIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{rawData.length} student records</p>
                </div>
              </div>
              <button
                onClick={handleClear}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                aria-label="Remove file"
                disabled={uploading}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {validationErrors.length > 0 && (
            <div className="bg-[#fee2e2] border border-[#c73e2c] rounded-lg p-4">
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-[#c73e2c] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#c73e2c]">Validation Warnings</p>
                  <ul className="text-sm text-[#c73e2c] mt-1 space-y-1">
                    {validationErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                    {validationErrors.length >= 5 && (
                      <li>...and more errors</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-200/50 p-6">
            <h3 className="text-base font-medium text-gray-900 mb-2">Column Mapping</h3>
            <p className="text-sm text-gray-500 mb-4">Map CSV columns to the required fields. Auto-detected columns are pre-selected.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {requiredFields.map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {field.label}
                    {field.required && <span className="text-[#c73e2c] ml-1">*</span>}
                  </label>
                  <select
                    value={mappings[field.key] ?? ''}
                    onChange={(e) => handleMappingChange(field.key, e.target.value)}
                    disabled={uploading}
                    className="input-field"
                  >
                    <option value="">Select column...</option>
                    {headers.map((header, i) => (
                      <option key={i} value={i}>
                        {header || `Column ${i + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-base font-medium text-gray-900">Preview</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f9fafb] border-b border-gray-200">
                    {requiredFields.map(field => (
                      <th key={field.key} className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                        {field.label}
                        {field.required && <span className="text-[#c73e2c] ml-0.5">*</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {previewData.map((row, i) => (
                    <tr key={i} className="hover:bg-[#f9fafb]">
                      {requiredFields.map(field => (
                        <td key={field.key} className="px-4 py-3 text-sm text-gray-900">
                          {row[field.key] || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {uploading && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#1e3a5f] transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{uploadProgress}%</span>
                </div>
              </div>
            )}
            
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center gap-4">
                <Button
                  variant="primary"
                  onClick={handleConfirmUpload}
                  disabled={!isMappingComplete || uploading}
                  loading={uploading}
                >
                  {uploading ? 'Importing...' : 'Confirm Upload'}
                </Button>
                {!isMappingComplete && (
                  <p className="text-xs text-gray-500">Please map all required fields to continue.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Upload
