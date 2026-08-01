import type { SVGProps } from 'react'
import { CLAUDE_HOME_URL, GEMINI_HOME_URL } from '../constants/branding'

type IconProps = SVGProps<SVGSVGElement>

function ClaudeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={14} height={14} aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M17.3041 3.541h-3.6723l6.7018 16.918H24Zm-10.6082 0L6.6959 3.541H0l6.7018 16.918h3.6722zm.301 8.4551L11.9955 6.0003l4.9986 5.9958z"
      />
    </svg>
  )
}

function GeminiIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={14} height={14} aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M12 2c.45 3.8 2.1 7.2 6.5 9.5C14.1 13.8 12.45 17.2 12 22c-.45-4.8-2.1-8.2-6.5-10.5C9.9 9.2 11.55 5.8 12 2z"
      />
    </svg>
  )
}

const badgeBase =
  'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold text-white no-underline shadow-sm transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'

export function AiProviderBadges() {
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="AI providers">
      <a
        href={CLAUDE_HOME_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`${badgeBase} bg-[#D97757] focus-visible:outline-[#D97757]`}
      >
        <ClaudeIcon className="shrink-0" />
        Powered by Claude
      </a>
      <a
        href={GEMINI_HOME_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`${badgeBase} bg-[#4285F4] focus-visible:outline-[#4285F4]`}
      >
        <GeminiIcon className="shrink-0" />
        Powered by Gemini
      </a>
    </div>
  )
}
