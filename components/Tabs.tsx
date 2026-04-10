import { useState } from 'react'

const Tabs = ({ 
  tabs, 
  defaultTab = 0, 
  onChange,
  variant = 'underline'
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab)

  const handleTabClick = (index) => {
    setActiveTab(index)
    onChange?.(tabs[index], index)
  }

  const renderUnderlineVariant = () => (
    <div className="border-b border-gray-200">
      <nav className="flex gap-4 sm:gap-6 overflow-x-auto -mb-px pb-px" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {tabs.map((tab, index) => (
          <button
            key={tab.id || index}
            onClick={() => handleTabClick(index)}
            className={`py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap min-h-[44px] flex items-center ${
              activeTab === index
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.icon && <tab.icon className="w-4 h-4 mr-2 inline flex-shrink-0" />}
            {tab.label}
            {tab.count !== undefined && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === index
                  ? 'bg-primary/10 text-primary'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  )

  const renderPillsVariant = () => (
    <div className="flex gap-2 bg-gray-100 p-1 rounded-lg overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {tabs.map((tab, index) => (
        <button
          key={tab.id || index}
          onClick={() => handleTabClick(index)}
          className={`px-3 sm:px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap min-h-[44px] ${
            activeTab === index
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.icon && <tab.icon className="w-4 h-4 mr-1.5 inline flex-shrink-0" />}
          {tab.label}
        </button>
      ))}
    </div>
  )

  const renderButtonsVariant = () => (
    <div className="flex gap-2 sm:gap-3 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {tabs.map((tab, index) => (
        <button
          key={tab.id || index}
          onClick={() => handleTabClick(index)}
          className={`px-3 sm:px-4 py-2 text-sm font-medium rounded-md border transition-colors whitespace-nowrap min-h-[44px] ${
            activeTab === index
              ? 'border-primary bg-primary text-white'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {tab.icon && <tab.icon className="w-4 h-4 mr-1.5 inline flex-shrink-0" />}
          {tab.label}
        </button>
      ))}
    </div>
  )

  const activeContent = tabs[activeTab]?.content

  return (
    <div>
      <div className={variant === 'underline' ? '' : 'mb-4'}>
        {variant === 'underline' && renderUnderlineVariant()}
        {variant === 'pills' && renderPillsVariant()}
        {variant === 'buttons' && renderButtonsVariant()}
      </div>
      {activeContent && (
        <div className="py-4">
          {typeof activeContent === 'function' ? activeContent() : activeContent}
        </div>
      )}
    </div>
  )
}

export default Tabs
