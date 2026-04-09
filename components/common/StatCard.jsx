import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, MinusIcon } from '@heroicons/react/24/outline'

export default function StatCard({
  label,
  value,
  icon: Icon,
  bgColor = 'bg-primary/10',
  color = 'text-primary',
  trend,
  trendLabel,
  className = '',
}) {
  const getTrendInfo = () => {
    if (!trend) return null
    const isPositive = trend.startsWith('+')
    const isNegative = trend.startsWith('-')
    
    if (!isPositive && !isNegative) return null
    
    return {
      Icon: isPositive ? ArrowTrendingUpIcon : ArrowTrendingDownIcon,
      colorClass: isPositive ? 'text-[#2c7a4d]' : 'text-[#c73e2c]',
    }
  }

  const trendInfo = getTrendInfo()

  return (
    <div className={`card ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        {Icon && (
          <div className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center`}>
            <Icon className={`w-4 h-4 ${color}`} />
          </div>
        )}
      </div>
      <div className="flex items-end justify-between">
        <p className="text-[28px] font-semibold leading-9 text-gray-900">{value}</p>
        {trendInfo && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendInfo.colorClass}`}>
            <trendInfo.Icon className="w-4 h-4" />
            {trend}
          </div>
        )}
      </div>
      {trendLabel && (
        <p className="text-xs text-gray-400 mt-1">{trendLabel}</p>
      )}
    </div>
  )
}
