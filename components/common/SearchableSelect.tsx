import { useState, useRef, useEffect } from 'react'
import { ChevronDownIcon, CheckIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function SearchableSelect({
  options = [],
  value,
  onChange,
  placeholder = 'Select...',
  disabled = false,
  searchable = true,
  renderOption,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, searchable])

  const filteredOptions = options.filter(opt => {
    if (!search) return true
    const label = typeof opt === 'object' ? opt.label : opt
    return label.toLowerCase().includes(search.toLowerCase())
  })

  const selectedOption = options.find(opt => {
    if (typeof opt === 'object') return opt.value === value
    return opt === value
  })

  const handleSelect = (opt) => {
    const val = typeof opt === 'object' ? opt.value : opt
    onChange(val)
    setIsOpen(false)
    setSearch('')
  }

  const getLabel = (opt) => {
    if (typeof opt === 'object') return opt.label
    return opt
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 border rounded-md text-sm text-left bg-white transition-colors ${
          disabled ? 'bg-gray-100 cursor-not-allowed opacity-50' : 'hover:border-gray-300'
        } ${isOpen ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'}`}
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
          {selectedOption ? getLabel(selectedOption) : placeholder}
        </span>
        <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          {searchable && (
            <div className="p-2 border-b border-gray-100">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          )}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">No options found</div>
            ) : (
              filteredOptions.map((opt, i) => {
                const isSelected = typeof opt === 'object' ? opt.value === value : opt === value
                return (
                  <button
                    key={typeof opt === 'object' ? opt.value : i}
                    type="button"
                    onClick={() => handleSelect(opt)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-gray-50 ${
                      isSelected ? 'bg-primary/5 text-primary' : 'text-gray-900'
                    }`}
                  >
                    {renderOption ? renderOption(opt) : getLabel(opt)}
                    {isSelected && <CheckIcon className="w-4 h-4 text-primary" />}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
