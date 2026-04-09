import { forwardRef } from 'react'

const FormField = forwardRef(({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  helpText,
  options = [],
  rows = 4,
  className = '',
  ...props
}, ref) => {
  const inputClasses = `input-field ${error ? 'border-[#c73e2c] focus:border-[#c73e2c] focus:ring-[#c73e2c]/20' : ''} ${className}`

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            ref={ref}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            rows={rows}
            className={inputClasses}
            {...props}
          />
        )
      case 'select':
        return (
          <select
            ref={ref}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            className={inputClasses}
            {...props}
          >
            <option value="">{placeholder || 'Select...'}</option>
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )
      case 'checkbox':
        return (
          <div className="flex items-center gap-2">
            <input
              ref={ref}
              type="checkbox"
              name={name}
              checked={value}
              onChange={onChange}
              disabled={disabled}
              required={required}
              className="w-4 h-4 rounded border-gray-300"
              {...props}
            />
            {label && <span className="text-sm text-gray-700">{label}</span>}
          </div>
        )
      case 'radio':
        return (
          <div className="flex items-center gap-2">
            <input
              ref={ref}
              type="radio"
              name={name}
              value={value}
              checked={value === props.radioValue}
              onChange={onChange}
              disabled={disabled}
              required={required}
              className="w-4 h-4 border-gray-300"
              {...props}
            />
            {placeholder && <span className="text-sm text-gray-700">{placeholder}</span>}
          </div>
        )
      default:
        return (
          <input
            ref={ref}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={inputClasses}
            {...props}
          />
        )
    }
  }

  if (type === 'checkbox') {
    return (
      <div>
        {renderInput()}
        {error && <p className="mt-1 text-xs text-[#c73e2c]">{error}</p>}
        {helpText && !error && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
      </div>
    )
  }

  return (
    <div className={type === 'checkbox' ? '' : 'space-y-1.5'}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-[#c73e2c] ml-0.5">*</span>}
        </label>
      )}
      {renderInput()}
      {error && <p className="mt-1 text-xs text-[#c73e2c]">{error}</p>}
      {helpText && !error && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
    </div>
  )
})

FormField.displayName = 'FormField'

export default FormField
