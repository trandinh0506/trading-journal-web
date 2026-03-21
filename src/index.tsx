import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import 'tailwindcss/tailwind.css'
import App from './components/App'
import './i18n'

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
