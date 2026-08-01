import { APP_TITLE, APP_TITLE_MUTED, APP_TITLE_ACCENT } from '../constants/branding'

type AppTitleProps = {
  /** Home uses h1; nested document pages use a span so the page keeps a single h1. */
  as?: 'h1' | 'span'
}

export function AppTitle({ as = 'h1' }: AppTitleProps) {
  const Tag = as
  return (
    <Tag className="app-title" aria-label={APP_TITLE}>
      <span className="app-title__muted">{APP_TITLE_MUTED}</span>
      <span className="app-title__accent">{APP_TITLE_ACCENT}</span>
    </Tag>
  )
}
