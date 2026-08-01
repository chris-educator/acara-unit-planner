import { Link } from 'react-router-dom'
import { ROUTE_SCHOOL_DATA, ROUTE_TERMS } from '../../constants/routes'
import { PolicyShell } from './PolicyShell'

export function PrivacyPage() {
  return (
    <PolicyShell
      title="Privacy Policy"
      meta="ACARA Unit Planner · AppStax · Last updated: 1 August 2026"
      activePath="/privacy"
    >
      <p>
        ACARA Unit Planner (<a href="https://acara.appstax.ai">acara.appstax.ai</a>) is a
        teacher-facing EdStack app published by AppStax. This policy describes how we handle
        information when you configure units, generate or refine term plans, use Ask the Assistant,
        or sign in for EdStack credits.
      </p>

      <h2>What you submit</h2>
      <p>
        You may enter unit configuration (topic, year level, subject, pedagogy focus, class
        context), optional curriculum descriptor picks, and use AI to generate or refine term plans.
        You may also chat with the in-app Assistant for workflow help.
      </p>

      <h2>What we store</h2>
      <ul>
        <li>
          <strong>Generated unit and draft</strong> — saved in your browser&apos;s local storage
          until you clear it. Not stored on AppStax servers.
        </li>
        <li>
          <strong>Generation and refinement</strong> — your configuration is sent to third-party AI
          providers for that request only; we do not keep a server-side copy.
        </li>
        <li>
          <strong>Ask the Assistant</strong> — chat messages are processed by AI services per
          request; we do not store chat history on AppStax servers.
        </li>
        <li>
          <strong>Teacher account</strong> — when billing is enabled, sign-in uses the shared EdStack
          billing service (<a href="https://account.appstax.ai">account.appstax.ai</a>). We store
          your email and credit balance there.
        </li>
      </ul>

      <h2>AI processing</h2>
      <p>
        Unit configuration and assistant messages are sent to{' '}
        <strong>third-party AI providers</strong> (for example Anthropic and Google) under their own
        terms. We do not use your content to train AppStax models.
      </p>

      <h2>Cookies</h2>
      <p>
        When billing is enabled, a secure session cookie keeps you signed in. No advertising
        cookies. Optional Sentry error monitoring may collect technical error data — not your unit
        content.
      </p>

      <h2>Schools</h2>
      <p>
        See our <Link to={ROUTE_SCHOOL_DATA}>School Data</Link> handling summary. Use{' '}
        <strong>Flag this reply</strong> in the Assistant, or email{' '}
        <a href="mailto:apps@appstax.ai">apps@appstax.ai</a>, about concerning AI output.
      </p>

      <h2>Your choices</h2>
      <p>
        Avoid student-identifying detail in class context fields. Sign out on shared devices. For
        account questions, data export, or deletion requests, contact us — account data is managed
        through EdStack billing (<a href="https://account.appstax.ai">account.appstax.ai</a>).
      </p>

      <h2>Australian Privacy Act</h2>
      <p>
        AppStax handles personal information in accordance with the Australian Privacy Act 1988
        (Cth) and the Australian Privacy Principles (APPs). You may access or correct your account
        information by contacting us.
      </p>

      <p className="policy-page__external">
        Portfolio policy:{' '}
        <a href="https://edstack.appstax.ai/privacy" target="_blank" rel="noopener noreferrer">
          EdStack Privacy
        </a>
        {' · '}
        <Link to={ROUTE_TERMS}>Terms of Service</Link>
      </p>
    </PolicyShell>
  )
}
