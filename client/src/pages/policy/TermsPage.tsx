import { Link } from 'react-router-dom'
import { ROUTE_PRIVACY, ROUTE_SCHOOL_DATA } from '../../constants/routes'
import { PolicyShell } from './PolicyShell'

export function TermsPage() {
  return (
    <PolicyShell
      title="Terms of service"
      meta="ACARA Unit Planner · AppStax · Last updated: 1 August 2026"
      activePath="/terms"
    >
      <p>
        By using ACARA Unit Planner at <a href="https://acara.appstax.ai">acara.appstax.ai</a>, you
        agree to these terms. If you do not agree, do not use the service.
      </p>

      <h2>The service</h2>
      <p>
        ACARA Unit Planner helps teachers build 6–10 week term unit plans with curriculum descriptor
        links, weekly intents, and summative assessment outlines. AI output is a{' '}
        <strong>draft</strong> — you review and edit every week before use in class.
      </p>

      <h2>Accounts and credits</h2>
      <p>
        When billing is enabled, generating a term plan consumes 12 credits and refining a section
        consumes 2 credits via your EdStack account. Export and preview do not require credits.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Review all AI-generated content before teaching it.</li>
        <li>Do not upload confidential student-identifying information into unit context fields.</li>
        <li>Report concerning AI output via Flag this reply or apps@appstax.ai.</li>
      </ul>

      <h2>AI limitations</h2>
      <p>
        Generated units may be incomplete or unsuitable for your context. AppStax does not guarantee
        curriculum compliance with your school&apos;s moderation policies.
      </p>

      <h2>Liability</h2>
      <p>
        To the extent permitted by law, AppStax is not liable for indirect loss arising from use of
        this service.
      </p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of Queensland, Australia.</p>

      <p className="policy-page__external">
        Portfolio terms:{' '}
        <a href="https://edstack.appstax.ai/terms" target="_blank" rel="noopener noreferrer">
          EdStack terms
        </a>
        {' · '}
        <Link to={ROUTE_PRIVACY}>Privacy policy</Link>
        {' · '}
        <Link to={ROUTE_SCHOOL_DATA}>School data</Link>
      </p>
    </PolicyShell>
  )
}
