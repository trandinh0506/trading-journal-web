import React from 'react'
import { useTranslation } from 'react-i18next'

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation()

  const changeLanguage = (lng: 'vi' | 'en'): void => {
    i18n.changeLanguage(lng)
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => changeLanguage('vi')}
        className={`rounded px-3 py-1 text-sm ${
          i18n.language === 'vi'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-gray-300'
        }`}
      >
        VN
      </button>
      <button
        onClick={() => changeLanguage('en')}
        className={`rounded px-3 py-1 text-sm ${
          i18n.language === 'en'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-gray-300'
        }`}
      >
        EN
      </button>
    </div>
  )
}

export default LanguageSwitcher
