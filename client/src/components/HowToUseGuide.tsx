import { HOW_TO_USE_HINTS, HOW_TO_USE_STEPS } from '../constants/howToUse'
import { QuickTourButton } from './QuickTourButton'

export function HowToUseGuide() {
  return (
    <section
      className="app-how-to-guide no-print"
      aria-labelledby="how-to-use-heading"
      data-tour="how-to-use"
    >
      <div className="app-how-to-guide__header">
        <span className="app-how-to-guide__badge">Quick Guide</span>
        <h2 id="how-to-use-heading" className="app-how-to-guide__title">
          How to Use ACARA Unit Planner
        </h2>
        <p className="app-how-to-guide__lead">
          {
            'Build a 6–10 week term unit plan with curriculum descriptor links, weekly intents, formative checks, and summative assessment — not just a list of activities. Enter topic, year level, and pedagogy focus, then link up to four curriculum descriptors so each week stays syllabus-aligned. Generation costs 12 credits per term plan and 2 credits to refine a section; export docx, pdf, txt, or zip for accreditation folders. Use '
          }
          <strong className="font-semibold text-text">Ask</strong>
          {
            ' in the top bar for planning help — Ask will not write the unit itself — or use '
          }
          <strong className="font-semibold text-text">Refine</strong>
          {' on any section after generation.'}
        </p>
      </div>

      <ol className="app-how-to-guide__steps" aria-label="ACARA Unit Planner workflow">
        {HOW_TO_USE_STEPS.map((item) => (
          <li key={item.step} className="app-how-to-guide__step">
            <span className="app-how-to-guide__num" aria-hidden="true">
              {item.step}
            </span>
            <div className="app-how-to-guide__body">
              <p className="app-how-to-guide__step-title">{item.title}</p>
              <p className="app-how-to-guide__step-detail">{item.detail}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="app-how-to-guide__footer">
        <ul className="app-how-to-guide__hints" aria-label="Quick hints">
          {HOW_TO_USE_HINTS.map((hint) => (
            <li key={hint} className="app-how-to-guide__hint-pill">
              {hint}
            </li>
          ))}
          <li className="app-how-to-guide__tour-action">
            <QuickTourButton />
          </li>
        </ul>
      </div>
    </section>
  )
}
