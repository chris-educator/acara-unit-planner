import type { ReactNode } from 'react'
import { EDSTACK_HOME_URL } from '../constants/branding'
import { APP_CONTENT_RAIL_CLASS } from '../constants/layout'
import { EdStackLogo } from './EdStackLogo'

type SiteTopBarProps = {
  children: ReactNode
  innerClassName?: string
}

export function SiteTopBar({
  children,
  innerClassName = `site-top-bar__inner ${APP_CONTENT_RAIL_CLASS}`,
}: SiteTopBarProps) {
  return (
    <div className="site-top-bar shrink-0">
      <div className={innerClassName}>
        <a
          href={EDSTACK_HOME_URL}
          className="site-top-bar__logo inline-flex w-fit shrink-0"
          aria-label="EdStack Home"
        >
          <EdStackLogo tone="dark" />
        </a>
        <div className="site-top-bar__actions site-top-bar__tools">{children}</div>
      </div>
    </div>
  )
}
