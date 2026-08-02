import type { ReactNode } from 'react'
import { CreditsTopBarLink } from './CreditsTopBarLink'
import { EdStackThemeSwitch } from './EdStackThemeSwitch'
import { SignInTopBarLink } from './SignInTopBarLink'
import { SignOutButton } from './SignOutButton'
import { ShareMenu } from './ShareMenu'

type SiteTopBarToolsProps = {
  showAsk?: boolean
  /** Pass `<AskAssistant apiReady={…} />` from each app that ships Ask. */
  askSlot?: ReactNode
  showBilling?: boolean
  signedIn?: boolean
  credits?: number
  billingDegraded?: boolean
  accountTo?: string
  loginTo?: string
  onLogout?: () => void
  shareTriggerAriaLabel?: string
  /** Rendered before Share / theme (e.g. skin picker). */
  primaryBeforeTheme?: ReactNode
  /** Rendered before Ask. */
  secondaryBeforeAsk?: ReactNode
}

/**
 * EdStack top-bar controls in three clusters:
 * Ask · Account (Credits / Sign) · Utility (Share / Theme).
 * Mobile: logo left · icon controls right-aligned on one row.
 */
export function SiteTopBarTools({
  showAsk = true,
  askSlot = null,
  showBilling = false,
  signedIn = false,
  credits = 0,
  billingDegraded = false,
  accountTo = '/account',
  loginTo = '/login',
  onLogout,
  shareTriggerAriaLabel,
  primaryBeforeTheme,
  secondaryBeforeAsk,
}: SiteTopBarToolsProps) {
  const askControl = showAsk ? askSlot : null
  const hasAskCluster = Boolean(askControl || secondaryBeforeAsk)

  const accountControls = showBilling ? (
    <div className="site-top-bar__cluster site-top-bar__cluster--account">
      {signedIn ? (
        <CreditsTopBarLink
          credits={credits}
          billingDegraded={billingDegraded}
          to={accountTo}
        />
      ) : (
        <SignInTopBarLink to={loginTo} />
      )}
      {signedIn && onLogout ? <SignOutButton onClick={onLogout} /> : null}
    </div>
  ) : null

  return (
    <>
      {hasAskCluster ? (
        <div className="site-top-bar__group-secondary">
          {secondaryBeforeAsk}
          {askControl}
        </div>
      ) : null}
      <div className="site-top-bar__group-primary">
        {accountControls}
        <div className="site-top-bar__cluster site-top-bar__cluster--utility">
          {primaryBeforeTheme}
          <ShareMenu triggerAriaLabel={shareTriggerAriaLabel} />
          <EdStackThemeSwitch />
        </div>
      </div>
    </>
  )
}
