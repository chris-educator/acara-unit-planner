import { LogoMark } from './LogoMark'

type LogoProps = {
  size?: number
  tone?: 'light' | 'dark'
  markBottomBar?: 'dark' | 'light'
}

export function Logo({ size = 28, tone = 'light', markBottomBar = 'dark' }: LogoProps) {
  const edColor = tone === 'dark' ? '#FAFAFA' : '#09090B'
  return (
    <div className="inline-flex items-center gap-2">
      <LogoMark size={size} bottomBar={markBottomBar} className="shrink-0" />
      <span className="font-heading text-lg font-extrabold tracking-tight">
        <span style={{ color: edColor }}>Ed</span>
        <span style={{ color: '#22C55E' }}>Stack</span>
      </span>
    </div>
  )
}
