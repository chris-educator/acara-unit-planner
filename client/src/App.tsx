import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import AppMain from './AppMain'
import { SeoRoute } from './components/SeoRoute'
import {
  ROUTE_ACCOUNT,
  ROUTE_HOME,
  ROUTE_LOGIN,
  ROUTE_PRIVACY,
  ROUTE_SCHOOL_DATA,
  ROUTE_TERMS,
} from './constants/routes'
import { AccountPage } from './pages/AccountPage'
import { LoginPage } from './pages/LoginPage'
import { PrivacyPage } from './pages/policy/PrivacyPage'
import { SchoolDataPage } from './pages/policy/SchoolDataPage'
import { TermsPage } from './pages/policy/TermsPage'

function LegacyAppRedirect() {
  const { pathname } = useLocation()
  const next = pathname.replace(/^\/app\/?/, '/') || '/'
  return <Navigate to={next} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <SeoRoute />
      <Routes>
        <Route path={ROUTE_HOME} element={<AppMain />} />
        <Route path={ROUTE_LOGIN} element={<LoginPage />} />
        <Route path={ROUTE_ACCOUNT} element={<AccountPage />} />
        <Route path={ROUTE_PRIVACY} element={<PrivacyPage />} />
        <Route path={ROUTE_TERMS} element={<TermsPage />} />
        <Route path={ROUTE_SCHOOL_DATA} element={<SchoolDataPage />} />
        <Route path="/privacy.html" element={<Navigate to={ROUTE_PRIVACY} replace />} />
        <Route path="/terms.html" element={<Navigate to={ROUTE_TERMS} replace />} />
        <Route path="/teacher-data.html" element={<Navigate to={ROUTE_SCHOOL_DATA} replace />} />
        <Route path="/app/*" element={<LegacyAppRedirect />} />
        <Route path="*" element={<Navigate to={ROUTE_HOME} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
