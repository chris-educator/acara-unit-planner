import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import { AuthProvider } from './context/AuthContext'
import { OnboardingProvider } from './context/OnboardingContext'
import { ThemeProvider } from './context/ThemeContext'
import { initSentry } from './monitoring/sentry'
import { BROWSER_TAB_TITLE } from './constants/branding'
import './index.css'
import { registerServiceWorker } from './utils/registerServiceWorker'
import { initReloadScrollTop } from './utils/reloadScrollTop'

initReloadScrollTop()
initSentry()

document.title = BROWSER_TAB_TITLE

void registerServiceWorker()
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <OnboardingProvider>
            <App />
          </OnboardingProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
)
