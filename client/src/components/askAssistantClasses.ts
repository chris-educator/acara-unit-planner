/** Shared layout classes for header Ask the Assistant popovers. */
export const ASK_ASSISTANT_PANEL_CLASS = [
  'ask-assistant-panel',
  'z-[60] flex min-h-0 flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl',
  'fixed left-3 right-3',
  'top-[max(4.5rem,env(safe-area-inset-top,0px))]',
  'bottom-[max(0.75rem,env(safe-area-inset-bottom,0px))]',
  'sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:bottom-auto sm:left-auto',
  'sm:h-[min(36rem,calc(100dvh-5.5rem))] sm:w-[min(28rem,calc(100vw-2rem))]',
  'origin-top-right',
].join(' ')

export const ASK_ASSISTANT_BACKDROP_CLASS = [
  'ask-assistant-backdrop',
  'fixed inset-0 z-[55] cursor-pointer bg-black/40 backdrop-blur-[2px] sm:hidden',
].join(' ')
