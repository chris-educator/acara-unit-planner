import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AppAssistantChat } from './AppAssistantChat'
import { AskChatIcon } from './AskChatIcon'
import { ASK_ASSISTANT_BACKDROP_CLASS, ASK_ASSISTANT_PANEL_CLASS } from './askAssistantClasses'
import { useFocusTrap } from '../utils/focusTrap'

type AskAssistantProps = {
  apiReady: boolean
  subtitle?: string
  welcomeMessage?: string
  inputPlaceholder?: string
}

function useMobileAskLayout() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const onChange = () => setIsMobile(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return isMobile
}

export function AskAssistant({
  apiReady,
  subtitle = 'Setup, curriculum links, Refine, and export.',
  welcomeMessage,
  inputPlaceholder,
}: AskAssistantProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const isMobileLayout = useMobileAskLayout()

  const close = useCallback(() => setOpen(false), [])

  useFocusTrap(panelRef, open, close)

  useEffect(() => {
    if (!open || !isMobileLayout) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open, isMobileLayout])

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (containerRef.current?.contains(target)) return
      if (panelRef.current?.contains(target)) return
      setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
    }
  }, [open])

  const popout = open ? (
    <>
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close Ask Ed"
        className={ASK_ASSISTANT_BACKDROP_CLASS}
        onClick={close}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ask-assistant-title"
        aria-describedby="ask-assistant-subtitle"
        tabIndex={-1}
        className={ASK_ASSISTANT_PANEL_CLASS}
      >
        <div className="ask-assistant-panel__header flex shrink-0 items-start justify-between gap-3 border-b border-border px-4 py-3.5 sm:px-5">
          <div className="min-w-0 flex-1">
            <h3 id="ask-assistant-title" className="ui-section-heading mb-1">
              Ed the Assistant
            </h3>
            <p id="ask-assistant-subtitle" className="text-xs leading-snug text-text-muted">
              {subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close Ask Ed"
            className="ask-assistant-close shrink-0 rounded-lg p-2 text-text-muted transition-colors hover:bg-surface-raised hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 py-3 sm:px-5 sm:py-4">
          <AppAssistantChat
            apiReady={apiReady}
            welcomeMessage={welcomeMessage}
            inputPlaceholder={inputPlaceholder}
          />
        </div>
      </div>
    </>
  ) : null

  return (
    <div
      ref={containerRef}
      className="site-top-bar__ask relative shrink-0 sm:shrink-0"
      data-tour="ask-assistant"
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Ask Ed"
        aria-expanded={open}
        aria-haspopup="dialog"
        className={[
          'site-top-bar__action site-top-bar__ask-btn w-full sm:w-auto',
          open ? 'site-top-bar__ask-btn--open' : '',
        ].join(' ')}
      >
        <AskChatIcon className="h-4 w-4 shrink-0" />
        <span className="site-top-bar__ask-btn-label">Ask Ed</span>
      </button>

      {popout && (isMobileLayout ? createPortal(popout, document.body) : popout)}
    </div>
  )
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}
