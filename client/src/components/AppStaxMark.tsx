/** AppStax AS monogram — compact mark for sign-out and branded chrome. */

type AppStaxMarkProps = {
  size?: number
  className?: string
}

export function AppStaxMark({ size = 20, className = '' }: AppStaxMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      className={className}
      aria-hidden
    >
      <rect x="96" y="142" width="320" height="52" rx="26" fill="#0084FF" />
      <rect x="96" y="206" width="320" height="52" rx="26" fill="#22C55E" />
      <rect x="96" y="270" width="320" height="52" rx="26" fill="#D4D4D8" />
      <path
        fill="url(#appstaxMarkGrad)"
        stroke="#FFFFFF"
        strokeWidth="10"
        strokeLinejoin="round"
        paintOrder="stroke fill"
        fillRule="evenodd"
        d="M172 302 L222 212 L272 302 Z M198 266 H246 V281 H198 V266 Z"
      />
      <path
        fill="url(#appstaxMarkGrad)"
        stroke="#FFFFFF"
        strokeWidth="10"
        strokeLinejoin="round"
        paintOrder="stroke fill"
        d="M256 220 C310 216 322 246 288 254 C326 260 328 298 284 304 C240 310 246 270 280 266 C316 260 312 232 266 228 C250 226 252 220 256 220 Z"
      />
      <defs>
        <linearGradient id="appstaxMarkGrad" x1="160" y1="200" x2="352" y2="310" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0084FF" />
          <stop offset="100%" stopColor="#22C55E" />
        </linearGradient>
      </defs>
    </svg>
  )
}
