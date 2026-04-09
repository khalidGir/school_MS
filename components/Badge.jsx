const variants = {
  default: 'bg-gray-100 text-gray-700',
  primary: 'bg-primary/10 text-primary',
  success: 'bg-[#e8f5e9] text-[#2c7a4d]',
  warning: 'bg-[#fef4e6] text-[#b45309]',
  danger: 'bg-[#fee2e2] text-[#c73e2c]',
  info: 'bg-[#e6f0fa] text-primary',
}

const Badge = ({ 
  children, 
  variant = 'default', 
  icon: Icon,
  className = '' 
}) => {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </span>
  )
}

export default Badge
