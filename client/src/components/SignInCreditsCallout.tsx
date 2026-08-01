import { Link } from 'react-router-dom'
import { SIGN_IN_CREDITS_CALLOUT_TEXT } from '../constants/branding'
import { APP_CONTENT_MAX_CLASS, APP_CONTENT_RAIL_CLASS } from '../constants/layout'
import { ROUTE_LOGIN } from '../constants/routes'
import { useAuth } from '../context/AuthContext'

type SignInCreditsCalloutProps = {
  maxWidthClass?: string
  linkSignIn?: boolean
  showCreditsWhenSignedIn?: boolean
  creditQuote?: string | null
  className?: string
  /** Full-width left-aligned banner (app home). Login keeps the default shrink-wrapped style. */
  fullWidth?: boolean
}

export function SignInCreditsCallout({
  maxWidthClass = APP_CONTENT_MAX_CLASS,
  linkSignIn = false,
  showCreditsWhenSignedIn = false,
  creditQuote = null,
  className = '',
  fullWidth = false,
}: SignInCreditsCalloutProps) {
  const { me, config, loading } = useAuth()
  const shellClass = fullWidth
    ? `flex w-full justify-start pt-4 ${APP_CONTENT_RAIL_CLASS} ${className}`.trim()
    : `mx-auto flex w-full justify-center px-4 pt-4 sm:px-6 ${maxWidthClass} ${className}`.trim()
  const calloutClass = fullWidth
    ? 'sign-in-credits-callout sign-in-credits-callout--full'
    : 'sign-in-credits-callout'

  if (loading || !config?.billing_enabled) {
    return null
  }

  if (me?.authenticated) {
    if (me.email_verified === false && config?.email_verification_enabled !== false) {
      return (
        <div className={shellClass}>
          <div
            className={
              fullWidth
                ? 'ui-callout w-full text-left text-sm'
                : 'ui-callout w-fit max-w-[calc(100vw-2rem)] text-sm'
            }
          >
            Verify your email to use credits — check your inbox for the link we sent when you signed up.
          </div>
        </div>
      )
    }
    if (!showCreditsWhenSignedIn) return null
    return (
      <div className={shellClass}>
        <div className={`${calloutClass} sign-in-credits-callout--balance`}>
          <span>
            <span className="sign-in-credits-callout__credits">{me.credits ?? 0} credits</span> available
            across all credit-based EdStack apps.
          </span>
          {creditQuote ? (
            <span className="sign-in-credits-callout__run">This run: {creditQuote}</span>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <div className={shellClass}>
      <div className={calloutClass}>
        {linkSignIn ? (
          <>
            <Link to={ROUTE_LOGIN} className="sign-in-credits-callout__link">
              Sign in
            </Link>
            {' — '}
            {SIGN_IN_CREDITS_CALLOUT_TEXT}
          </>
        ) : (
          SIGN_IN_CREDITS_CALLOUT_TEXT
        )}
      </div>
    </div>
  )
}
