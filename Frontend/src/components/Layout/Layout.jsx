import Header from './Header'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

export default function Layout({ children, user, onLogout, currentPath, showSidebar = true }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={onLogout} />
      <div className="flex">
        {showSidebar && user && (
          <Sidebar user={user} currentPath={currentPath} />
        )}
        <main className={`flex-1 ${showSidebar && user ? 'ml-0' : ''}`}>
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

