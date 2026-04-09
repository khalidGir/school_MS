import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar, { CollapsedSidebar, ExpandedSidebar } from './Sidebar'
import Header from './Header'

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1200)
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1200)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1200)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1200)
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 1200) {
        setSidebarExpanded(false)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const getSidebarMargin = () => {
    if (isMobile) return 'ml-0'
    if (isTablet) return 'ml-[72px]'
    return sidebarExpanded ? 'ml-[260px]' : 'ml-[72px]'
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {isDesktop && (
        sidebarExpanded ? (
          <ExpandedSidebar onCollapse={() => setSidebarExpanded(false)} />
        ) : (
          <CollapsedSidebar onExpand={() => setSidebarExpanded(true)} />
        )
      )}

      <div className={`flex-1 flex flex-col transition-all duration-300 ${getSidebarMargin()}`}>
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 max-w-[1440px] w-full mx-auto p-6" role="main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
