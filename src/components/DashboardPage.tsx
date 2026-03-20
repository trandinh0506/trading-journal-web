import React from 'react'
import Sidebar from '../components/Sidebar'
import MainContent from '../components/MainContent'

const DashboardPage: React.FC = () => {
  return (
    <div className="grid h-screen w-full grid-cols-5 overflow-hidden">
      <div className="col-span-1">
        <Sidebar />
      </div>

      <div className="col-span-4">
        <MainContent />
      </div>
    </div>
  )
}

export default DashboardPage
