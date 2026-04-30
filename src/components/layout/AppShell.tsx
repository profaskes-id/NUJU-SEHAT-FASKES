import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

const AppShell: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-56 flex flex-col min-h-screen">
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AppShell
