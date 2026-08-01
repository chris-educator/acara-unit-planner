import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { fetchHealth } from '../../api/client'
import { BackToAppLink } from '../../components/BackToAppLink'
import { Layout } from '../../components/Layout'
import { APPSTAX_SUPPORT_EMAIL } from '../../constants/branding'
import { POLICY_LINKS } from '../../constants/routes'

type PolicyPath = (typeof POLICY_LINKS)[number]['path']

type PolicyShellProps = {
  title: string
  meta: string
  activePath: PolicyPath
  children: ReactNode
}

export function PolicyShell({ title, meta, activePath, children }: PolicyShellProps) {
  const [assistantReady, setAssistantReady] = useState(false)

  useEffect(() => {
    fetchHealth()
      .then((health) => {
        setAssistantReady(
          Boolean(health.assistant_ready ?? health.gemini_configured ?? health.anthropic_configured),
        )
      })
      .catch(() => setAssistantReady(false))
  }, [])

  return (
    <Layout apiReady={null} assistantReady={assistantReady} variant="document">
      <div className="mb-5">
        <BackToAppLink variant="primary" />
      </div>
      <article className="policy-page">
        <header className="policy-page__header">
          <p className="policy-page__eyebrow">
            <a
              href="https://edstack.appstax.ai"
              className="policy-page__home-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              EdStack
            </a>
          </p>
          <h1 className="policy-page__title">{title}</h1>
          <p className="policy-page__meta">{meta}</p>
        </header>

        <div className="policy-page__body">{children}</div>

        <footer className="policy-page__footer">
          <p>
            Questions:{' '}
            <a href={`mailto:${APPSTAX_SUPPORT_EMAIL}`}>{APPSTAX_SUPPORT_EMAIL}</a>
          </p>
          <p className="policy-page__related">
            See also:{' '}
            {POLICY_LINKS.map((link, index) => (
              <span key={link.path}>
                {index > 0 && ' · '}
                {link.path === activePath ? (
                  <span>{link.label}</span>
                ) : (
                  <Link to={link.path}>{link.label}</Link>
                )}
              </span>
            ))}
          </p>
        </footer>
      </article>
    </Layout>
  )
}
