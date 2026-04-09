const buttonStyles = {
  primary: 'bg-[#1e3a5f] text-white hover:bg-[#2c4c7a] focus:ring-2 focus:ring-[#1e3a5f]/20',
  secondary: 'bg-transparent text-[#1e3a5f] border border-[#1e3a5f] hover:bg-gray-50',
  danger: 'bg-[#c73e2c] text-white hover:bg-[#a33223] focus:ring-2 focus:ring-[#c73e2c]/20',
  ghost: 'bg-transparent text-[#6b7280] hover:bg-gray-100',
}

const buttonSizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  ...props
}) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-md
        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${buttonStyles[variant]}
        ${buttonSizes[size]}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  )
}

export default Button
