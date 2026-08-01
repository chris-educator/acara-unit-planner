import { AppTitle } from './AppTitle'
import { Footer } from './Footer'
import { SiteTopBar } from './SiteTopBar'
import { SiteTopBarTools } from './SiteTopBarTools'
import { AskAssistant } from './AskAssistant'
import { APP_INTRO_LINES, APP_TAGLINE } from '../constants/branding'
import { ROUTE_ACCOUNT, ROUTE_LOGIN } from '../constants/routes'
import { useAuth } from '../context/AuthContext'

type LayoutProps = {
  children: React.ReactNode
  /** Primary LLM readiness for Generate / Refine (`null` = still checking). */
  apiReady: boolean | null
  /** Gemini readiness for Ask the Assistant. */
  assistantReady: boolean
  creditsCallout?: React.ReactNode
}

export function Layout({ children, apiReady, assistantReady, creditsCallout }: LayoutProps) {
  const { me, config, logout, loading: authLoading } = useAuth()
  const showBilling = config?.billing_enabled
  const signedIn = !authLoading && me?.authenticated === true
  const billingDegraded = Boolean(me?.billing_degraded)

  return (
    <div
      id="top"
      className="flex min-h-screen min-h-[100dvh] w-full max-w-[100vw] flex-col bg-bg"
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
        <div
          className="ui-callout-orange mx-auto w-full max-w-6xl px-4 pt-3 sm:px-6 md:px-8"
          role="status"
        >
          Account services are temporarily unavailable. Your sign-in is still valid — credit balance
          and purchases may be delayed. Try again in a few minutes.
        </div>
      ) : null}
      {apiReady === false ? (
        <div className="ui-callout mx-auto w-full max-w-6xl px-4 pt-3 sm:px-6 md:px-8" role="status">
          Term plan generation is not configured on this server. Contact your administrator.
        </div>
      ) : null}
      <header className="ui-header relative z-40 shrink-0 py-4">
        <div className="mx-auto w-full min-w-0 max-w-6xl space-y-3 px-4 sm:px-6 md:px-8">
          <AppTitle />
          <p className="ui-header__lead max-w-full text-sm leading-relaxed text-text-muted">
            {APP_TAGLINE}{' '}
            <span className="ui-header__ask-text">Ask the Assistant</span>
            <span aria-hidden="true"> — </span>
            AI-powered agents built-in for clever help, deep reasoning, and fast responses — use{' '}
            <span className="ui-header__ask-text">Ask</span> in the top bar.
          </p>
          <div className="max-w-3xl space-y-2">
            {APP_INTRO_LINES.map((line) => (
              <p key={line} className="text-sm leading-relaxed text-text-muted">
                {line}
              </p>
            ))}
          </div>
        </div>
      </header>
      <main className="relative z-0 flex min-h-0 flex-1 flex-col overflow-x-hidden">
        <div className="flex-1 overflow-y-auto">
          {creditsCallout}
          <div className="mx-auto w-full min-w-0 max-w-6xl px-4 py-6 sm:px-6 md:px-8 md:py-10">
            {children}
          </div>
        </div>
        <Footer />
      </main>
    </div>
  )
}
