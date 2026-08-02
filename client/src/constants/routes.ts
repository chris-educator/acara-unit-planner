export const ROUTE_HOME = '/'
export const ROUTE_LOGIN = '/login'
export const ROUTE_ACCOUNT = '/account'
export const ROUTE_PRIVACY = '/privacy'
export const ROUTE_TERMS = '/terms'
export const ROUTE_SCHOOL_DATA = '/school-data'

export const POLICY_LINKS = [
  { path: ROUTE_PRIVACY, label: 'Privacy policy' },
  { path: ROUTE_TERMS, label: 'Terms of service' },
  { path: ROUTE_SCHOOL_DATA, label: 'School data' },
] as const
