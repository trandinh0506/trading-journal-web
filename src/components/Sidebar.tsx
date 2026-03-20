import React from 'react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

const Sidebar: React.FC = () => {
  const { t } = useTranslation()

  return (
    <aside className="flex h-full flex-col border-r border-slate-800 bg-slate-900 p-4 text-white">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-blue-400">Trading Journal</h2>
      </div>

      <nav className="flex-1 space-y-2 text-xl">
        <a href="#" className="block rounded p-2 hover:bg-slate-800">
          {t('sidebar.dashboard')}
        </a>
        <a href="#" className="block rounded p-2 hover:bg-slate-800">
          {t('sidebar.history')}
        </a>
        <a href="#" className="block rounded p-2 hover:bg-slate-800">
          {t('sidebar.analytics')}
        </a>
      </nav>

      <div className="mt-auto border-t border-slate-800 pt-4">
        <p className="mb-2 text-xs uppercase text-gray-500">
          {t('sidebar.settings')}
        </p>
        <LanguageSwitcher />
      </div>
    </aside>
  )
}

export default Sidebar
