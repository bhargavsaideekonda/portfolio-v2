import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter-tight'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import '@fontsource-variable/jetbrains-mono'
import './styles.css'
import { initScroll } from './lib/scroll'
import App from './App.jsx'

initScroll()
createRoot(document.getElementById('root')).render(<App />)
