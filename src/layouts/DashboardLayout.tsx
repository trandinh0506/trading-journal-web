import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/Sidebar'

const DashboardLayout: React.FC = () => {
  return (
    <div className="grid h-screen w-full grid-cols-[20%_80%] overflow-hidden bg-slate-950">
      <div className="h-full">
        <Sidebar />
      </div>

      <div className="h-full overflow-y-auto">
        <Outlet />
      </div>
    </div>
  )
}

export default DashboardLayout
