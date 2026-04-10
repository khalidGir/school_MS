import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar, { CollapsedSidebar, ExpandedSidebar } from './Sidebar'
import Header from './Header'

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(() => window.innerWidth >= 1200)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1200)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setIsDesktop(width >= 1200)
      if (width < 1200) {
        setSidebarExpanded(false)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile/Tablet overlay sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Desktop sidebar */}
      {isDesktop && (
        sidebarExpanded ? (
          <ExpandedSidebar onCollapse={() => setSidebarExpanded(false)} />
        ) : (
          <CollapsedSidebar onExpand={() => setSidebarExpanded(true)} />
        )
      )}

      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isDesktop ? (sidebarExpanded ? 'ml-[260px]' : 'ml-[72px]') : 'ml-0'
      }`}>
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 w-full p-4 sm:p-6 lg:max-w-[1440px] lg:mx-auto" role="main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
