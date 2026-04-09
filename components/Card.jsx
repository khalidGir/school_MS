const Card = ({ 
  children, 
  className = '', 
  padding = true,
  hover = false,
  onClick 
}) => {
  return (
    <div 
      className={`card ${padding ? 'p-5' : ''} ${hover ? 'hover:shadow-md transition-shadow cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

const StatCard = ({ 
  label, 
  value, 
  icon: Icon, 
  bgColor = 'bg-primary/10', 
  color = 'text-primary',
  trend,
  trendLabel,
  className = '' 
}) => {
  return (
    <Card className={className}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        {Icon && (
          <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
        )}
      </div>
      <p className="text-2xl font-semibold text-gray-900 mb-1">{value}</p>
      {trend && (
        <p className={`text-xs font-medium ${trend > 0 ? 'text-[#2c7a4d]' : 'text-[#c73e2c]'}`}>
          {trend > 0 ? '+' : ''}{trend}% {trendLabel || 'from last month'}
        </p>
      )}
    </Card>
  )
}

Card.Stat = StatCard

export default Card
