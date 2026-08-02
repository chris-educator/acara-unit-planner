import type { MouseEvent, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  appstaxBugReportMailto,
  appstaxCopyrightLine,
} from '../constants/branding'
import { APP_CONTENT_RAIL_CLASS } from '../constants/layout'
import { ROUTE_PRIVACY, ROUTE_SCHOOL_DATA, ROUTE_TERMS } from '../constants/routes'
import { useOnboarding } from '../context/OnboardingContext'
import { AppstaxMailtoLink } from './AppstaxMailtoLink'

function scrollToTop(e: MouseEvent<HTMLAnchorElement>) {
  e.preventDefault()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const footerLinkClass =
  'text-[#d4d4d8] underline-offset-2 hover:text-[#fafafa] hover:underline'

function FooterTourLink({ className }: { className: string }) {
  const { replayTour } = useOnboarding()
  return (
    <button type="button" onClick={replayTour} className={`footer-tour-link ${className}`}>
      Take a tour
    </button>
  )
}

type FooterProps = {
  /** Optional extra line(s) below legal links (app-specific). */
  extra?: ReactNode
}

export function Footer({ extra }: FooterProps) {
  return (
    <footer className="mt-auto shrink-0 border-t border-white/6 bg-[#09090b]">
      <div className={`${APP_CONTENT_RAIL_CLASS} py-4`}>
        <p className="text-center text-xs font-medium text-[#fafafa]">
          <a
            href="#top"
            onClick={scrollToTop}
            className="inline transition-colors hover:text-[#22c55e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22c55e]"
          >
            {appstaxCopyrightLine()} · Powered by AI
          </a>
        </p>
        <p className="mx-auto mt-1 text-center text-[11px] text-[#a1a1aa]">
          <Link to={ROUTE_PRIVACY} className={footerLinkClass}>
            Privacy policy
          </Link>
          <span aria-hidden="true"> · </span>
          <AppstaxMailtoLink href={appstaxBugReportMailto()} className={footerLinkClass}>
            Report a bug
          </AppstaxMailtoLink>
          <span aria-hidden="true"> · </span>
          <Link to={ROUTE_SCHOOL_DATA} className={footerLinkClass}>
            School data
          </Link>
          <span aria-hidden="true"> · </span>
          <FooterTourLink className={footerLinkClass} />
          <span aria-hidden="true"> · </span>
          <Link to={ROUTE_TERMS} className={footerLinkClass}>
            Terms of service
          </Link>
        </p>
        {extra}
      </div>
    </footer>
  )
}
