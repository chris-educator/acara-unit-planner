import { Link } from 'react-router-dom'
import { AiProviderBadges } from './AiProviderBadges'
import { ApiStatus } from './ApiStatus'
import { AppTitle } from './AppTitle'
import { Footer } from './Footer'
import { SiteTopBar } from './SiteTopBar'
import { SiteTopBarTools } from './SiteTopBarTools'
import { AskAssistant } from './AskAssistant'
import { APP_CONTENT_RAIL_CLASS } from '../constants/layout'
import { ROUTE_ACCOUNT, ROUTE_HOME, ROUTE_LOGIN } from '../constants/routes'
import { useAuth } from '../context/AuthContext'

type LayoutProps = {
  children: React.ReactNode
  /** Primary LLM readiness for Generate / Refine (`null` = still checking / hide banner). */
  apiReady: boolean | null
  /** Gemini readiness for Ask the Assistant. */
  assistantReady: boolean
  creditsCallout?: React.ReactNode
  /** `document` keeps SiteTopBar + Footer with a compact title for policy pages. */
  variant?: 'default' | 'document'
}

export function Layout({
  children,
  apiReady,
  assistantReady,
  creditsCallout,
  variant = 'default',
}: LayoutProps) {
  const { me, config, logout, loading: authLoading } = useAuth()
  const showBilling = config?.billing_enabled
  const signedIn = !authLoading && me?.authenticated === true
  const billingDegraded = Boolean(me?.billing_degraded)
  const isDocument = variant === 'document'

  return (
    <div
      id="top"
      className="flex min-h-screen min-h-[100dvh] w-full max-w-full flex-col bg-bg"
    >
      <SiteTopBar>
        <SiteTopBarTools
          askSlot={<AskAssistant apiReady={assistantReady} />}
          showBilling={showBilling}
          signedIn={signedIn}
          credits={me?.credits ?? 0}
          billingDegraded={billingDegraded}
          accountTo={ROUTE_ACCOUNT}
          loginTo={ROUTE_LOGIN}
          onLogout={() => void logout()}
        />
      </SiteTopBar>
      {billingDegraded && signedIn ? (
        <div className={`ui-callout-orange ${APP_CONTENT_RAIL_CLASS} pt-3`} role="status">
          Account services are temporarily unavailable. Your sign-in is still valid — credit balance
          and purchases may be delayed. Try again in a few minutes.
        </div>
      ) : null}
      {!isDocument && apiReady === false ? (
        <div className={`ui-callout ${APP_CONTENT_RAIL_CLASS} pt-3`} role="status">
          Term plan generation is not configured on this server. Contact your administrator.
        </div>
      ) : null}
      <header className="ui-header relative z-40 shrink-0 py-4">
        <div className={`${APP_CONTENT_RAIL_CLASS}${isDocument ? ' space-y-3' : ''}`}>
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <Link to={ROUTE_HOME} className="inline-block min-w-0 no-underline">
              <AppTitle as={isDocument ? 'span' : 'h1'} />
            </Link>
            {!isDocument ? (
              <div
                className="header-ai-cluster flex w-full flex-col gap-2 sm:ml-auto sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end"
                role="group"
                aria-label="AI status and providers"
              >
                <ApiStatus apiReady={apiReady} assistantReady={assistantReady} />
                <AiProviderBadges />
              </div>
            ) : null}
          </div>
          {isDocument ? (
            <p className="text-sm leading-relaxed text-text-muted">
              Legal and school-data pages for ACARA Unit Planner. Use{' '}
              <span className="ui-header__ask-text">Ask</span> in the top bar, or go back to the
              planner any time.
            </p>
          ) : null}
        </div>
      </header>
      <main className="relative z-0 flex min-h-0 flex-1 flex-col overflow-x-hidden">
        <div className="app-main-scroll flex-1 overflow-y-auto">
          {creditsCallout}
          <div className={`${APP_CONTENT_RAIL_CLASS} py-6 md:py-10`}>{children}</div>
        </div>
        <Footer />
      </main>
    </div>
  )
}
