import { Link } from 'react-router-dom'
import { ROUTE_PRIVACY, ROUTE_TERMS } from '../../constants/routes'
import { PolicyShell } from './PolicyShell'

export function SchoolDataPage() {
  return (
    <PolicyShell
      title="School data handling"
      meta="ACARA Unit Planner · AppStax · For schools · Last updated: 1 August 2026"
      activePath="/school-data"
    >
      <p>
        ACARA Unit Planner does not store generated units on AppStax servers. Contact{' '}
        <a href="mailto:apps@appstax.ai">apps@appstax.ai</a> for contractual questions. This page is
        a practical summary for school leaders — see also the{' '}
        <Link to={ROUTE_PRIVACY}>Privacy policy</Link>.
      </p>

      <h2>Data inventory</h2>
      <div className="policy-page__table-wrap">
        <table className="policy-page__table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Where stored</th>
              <th>Retention</th>
              <th>Who can access</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Unit configuration + generated unit</td>
              <td>Browser local storage</td>
              <td>Until cleared by user</td>
              <td>Teacher on that device</td>
            </tr>
            <tr>
              <td>Per-request AI payload</td>
              <td>Sent to third-party AI providers</td>
              <td>Not in AppStax DB</td>
              <td>Teacher; providers under their policies</td>
            </tr>
            <tr>
              <td>Assistant chat (optional)</td>
              <td>Processed by AI services per message; not stored by AppStax</td>
              <td>Not in AppStax DB</td>
              <td>Teacher; providers under their policies</td>
            </tr>
            <tr>
              <td>Exported ZIP/DOCX/PDF/TXT</td>
              <td>Downloaded to teacher device</td>
              <td>User-controlled</td>
              <td>User</td>
            </tr>
            <tr>
              <td>Teacher account (when billing on)</td>
              <td>EdStack billing service</td>
              <td>Account lifetime</td>
              <td>User; AppStax for billing support</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>What we do not do</h2>
      <ul>
        <li>No server-side unit storage in v1.</li>
        <li>No student accounts or student work uploads.</li>
        <li>No advertising or profiling.</li>
      </ul>

      <h2>Sub-processors</h2>
      <p>
        <strong>Third-party AI providers</strong> — unit generation, refinement, and assistant chat
        (for example Anthropic and Google).
      </p>
      <p>
        <strong>EdStack billing</strong> — accounts and credits when enabled (
        <a href="https://account.appstax.ai">account.appstax.ai</a>).
      </p>

      <h2>Teacher responsibility</h2>
      <p>
        Teachers remain responsible for reviewing AI output before classroom use and for complying
        with their school&apos;s privacy and AI-use policy.
      </p>

      <p className="policy-page__external">
        Portfolio summary:{' '}
        <a href="https://edstack.appstax.ai/school-data" target="_blank" rel="noopener noreferrer">
          EdStack school data
        </a>
        {' · '}
        <Link to={ROUTE_TERMS}>Terms of service</Link>
      </p>
    </PolicyShell>
  )
}
