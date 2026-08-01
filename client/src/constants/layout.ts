/**
 * Shared horizontal content rail for ACARA Unit Planner chrome
 * (top bar, header, main, footer, callouts, account/login shells).
 * Matches EdStack marketing rail (1180px).
 */
export const APP_CONTENT_MAX_CLASS = 'max-w-[1180px]'

export const APP_CONTENT_PAD_CLASS = 'px-4 sm:px-6 md:px-8'

/** Centered full-width column: max width + horizontal padding. */
export const APP_CONTENT_RAIL_CLASS =
  `mx-auto w-full min-w-0 ${APP_CONTENT_MAX_CLASS} ${APP_CONTENT_PAD_CLASS}` as const
