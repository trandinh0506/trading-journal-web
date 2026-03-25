import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  History,
  BarChart3,
  Key,
  Settings
} from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'

const Sidebar: React.FC = () => {
  const { t } = useTranslation()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const navItems = [
    {
      path: '/',
      label: t('sidebar.dashboard'),
      icon: <LayoutDashboard size={20} />
    },
    {
      path: '/history',
      label: t('sidebar.history'),
      icon: <History size={20} />
    },
    {
      path: '/analytics',
      label: t('sidebar.analytics'),
      icon: <BarChart3 size={20} />
    },
    {
      path: '/api-settings',
      label: t('sidebar.api_keys'),
      icon: <Key size={20} />
    }
  ]

  return (
    <aside className="flex h-full flex-col border-r border-slate-800 bg-slate-900 p-4 text-white">
      <div className="mb-10 px-2">
        <h2 className="text-xl font-bold italic tracking-tight text-blue-500">
          TRADING<span className="text-slate-100">JOURNAL</span>
        </h2>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto border-t border-slate-800 pt-6">
        <div className="mb-3 flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <Settings size={14} />
          {t('sidebar.settings')}
        </div>
        <div className="px-2">
          <LanguageSwitcher />
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
