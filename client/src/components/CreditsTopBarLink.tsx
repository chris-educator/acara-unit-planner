import { Link } from 'react-router-dom'

type CreditsTopBarLinkProps = {
  credits: number
  billingDegraded?: boolean
  to: string
}

export function CreditsTopBarLink({
  credits,
  billingDegraded = false,
  to,
}: CreditsTopBarLinkProps) {
  const label = billingDegraded ? '…' : credits
  return (
    <Link
      to={to}
      className="site-top-bar__action site-top-bar__credits shrink-0"
      title={billingDegraded ? 'Credits temporarily unavailable' : `Credits: ${credits}`}
    >
      Credits {label}
    </Link>
  )
}
