type LogoMarkProps = {
  size?: number
  className?: string
  emSize?: boolean
  bottomBar?: 'dark' | 'light'
}

export function LogoMark({
  size = 28,
  className = '',
  emSize = false,
  bottomBar = 'dark',
}: LogoMarkProps) {
  const bottomFill =
    bottomBar === 'light' ? 'var(--color-gray-300, #d4d4d8)' : 'var(--color-stack-slate, #18181b)'

  return (
    <svg
      width={emSize ? undefined : size}
      height={emSize ? undefined : size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={emSize ? { width: '1.556em', height: '1.556em' } : undefined}
      aria-hidden
    >
      <rect x="4" y="6" width="24" height="5" rx="2.5" fill="#0084FF" />
      <rect x="4" y="13.5" width="24" height="5" rx="2.5" fill="#22C55E" />
      <rect x="4" y="21" width="24" height="5" rx="2.5" fill={bottomFill} />
    </svg>
  )
}
