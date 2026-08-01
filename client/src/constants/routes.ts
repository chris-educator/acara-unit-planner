export const ROUTE_HOME = '/'
export const ROUTE_LOGIN = '/login'
export const ROUTE_ACCOUNT = '/account'
export const ROUTE_PRIVACY = '/privacy'
export const ROUTE_TERMS = '/terms'
export const ROUTE_SCHOOL_DATA = '/school-data'

export const POLICY_LINKS = [
  { path: ROUTE_PRIVACY, label: 'Privacy Policy' },
  { path: ROUTE_TERMS, label: 'Terms of Service' },
  { path: ROUTE_SCHOOL_DATA, label: 'School Data' },
] as const
