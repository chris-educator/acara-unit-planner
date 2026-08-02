import { useOnboarding } from '../context/OnboardingContext'
import { useLockBodyScroll } from '../hooks/useLockBodyScroll'

export function WelcomeDialog() {
  const { welcomeOpen, dismissWelcome, startTour } = useOnboarding()
  useLockBodyScroll(welcomeOpen)

  if (!welcomeOpen) return null

  return (
    <div className="product-tour-welcome-root" role="presentation">
      <button
        type="button"
        className="product-tour-welcome-backdrop"
        aria-label="Close welcome for now"
        onClick={dismissWelcome}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-dialog-title"
        aria-describedby="welcome-dialog-desc"
        className="product-tour-welcome-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="product-tour-welcome-panel__eyebrow">First look</p>
        <h2 id="welcome-dialog-title" className="product-tour-welcome-panel__title">
          Welcome to{' '}
          <span className="text-text-muted">ACARA </span>
          <span className="text-blue">Unit Planner</span>
        </h2>
        <p id="welcome-dialog-desc" className="product-tour-welcome-panel__body">
          Build a 6–10 week term unit with curriculum links, weekly intents, and assessment ready
          for export. A short tour shows the main steps — or skip and explore on your own.
        </p>
        <div className="product-tour-welcome-panel__actions">
          <button
            type="button"
            onClick={dismissWelcome}
            className="ui-btn-secondary w-full sm:w-auto"
          >
            Maybe later
          </button>
          <button type="button" onClick={startTour} className="ui-btn-primary w-full sm:w-auto">
            Take a quick tour
          </button>
        </div>
      </div>
    </div>
  )
}
