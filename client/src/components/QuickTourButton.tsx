import { useOnboarding } from '../context/OnboardingContext'

/** Blue header CTA to replay the product tour. */
export function QuickTourButton() {
  const { replayTour } = useOnboarding()

  return (
    <button
      type="button"
      onClick={replayTour}
      className="quick-tour-btn"
      aria-label="Take a quick tour of ACARA Unit Planner"
    >
      Take a quick tour
    </button>
  )
}
