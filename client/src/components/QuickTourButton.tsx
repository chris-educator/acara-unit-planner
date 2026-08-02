import { useOnboarding } from '../context/OnboardingContext'

/** Blue Quick guide CTA to start or replay the product tour. */
export function QuickTourButton({ className = '' }: { className?: string }) {
  const { replayTour } = useOnboarding()

  return (
    <button
      type="button"
      onClick={replayTour}
      className={`quick-tour-btn${className ? ` ${className}` : ''}`}
      aria-label="Take a Quick Tour"
    >
      Take a Quick Tour
    </button>
  )
}
