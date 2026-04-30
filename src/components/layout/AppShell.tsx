import React from 'react'
import { Outlet, Link } from 'react-router-dom'

const AppShell: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-indigo-600">NUJU SEHAT</h1>
        </div>
        <nav className="mt-4">
          <Link
            to="/dokter"
            className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
          >
            Dokter
          </Link>
          {/* Add more links here */}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <span className="text-gray-600">Dashboard</span>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700">Logout</button>
          </div>
        </header>
        <div className="p-6 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AppShell
