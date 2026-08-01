import { BROWSER_TAB_TITLE, APP_TITLE } from '../constants/branding'

export const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') ??
  'https://acara.appstax.ai'

export const SITE_NAME = APP_TITLE

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.svg`
export const DEFAULT_OG_IMAGE_ALT = 'ACARA Unit Planner — term unit planning for teachers'
export const DEFAULT_DESCRIPTION =
  'Build 6–10 week term unit plans with curriculum descriptor links, weekly intents, and summative assessment export.'

export const SEO_KEYWORDS = [
  'ACARA unit planner',
  'term planning',
  'curriculum descriptors',
  'teacher accreditation',
  'EdStack',
  'acara.appstax.ai',
].join(', ')

export interface PageSeo {
  title: string
  description: string
  path: string
  keywords?: string
  ogImage?: string
  ogImageAlt?: string
  canonicalPath?: string
  index?: boolean
}

export const PAGE_SEO = {
  home: {
    title: BROWSER_TAB_TITLE,
    description: DEFAULT_DESCRIPTION,
    path: '/',
    keywords: SEO_KEYWORDS,
  },
  login: {
    title: `Sign in | ${SITE_NAME}`,
    description: 'Sign in for EdStack credits to generate term unit plans.',
    path: '/login',
    index: false,
  },
  account: {
    title: `Account | ${SITE_NAME}`,
    description: 'Manage your EdStack credits for ACARA Unit Planner.',
    path: '/account',
    index: false,
  },
  privacy: {
    title: `Privacy Policy | ${SITE_NAME}`,
    description:
      'How ACARA Unit Planner handles teacher data, AI processing, and EdStack accounts.',
    path: '/privacy',
    keywords: SEO_KEYWORDS,
  },
  terms: {
    title: `Terms of Service | ${SITE_NAME}`,
    description:
      'Terms for using ACARA Unit Planner: accounts, credits, acceptable use, and AI limitations.',
    path: '/terms',
    keywords: SEO_KEYWORDS,
  },
  schoolData: {
    title: `School Data Handling | ${SITE_NAME}`,
    description:
      'School-facing summary of how ACARA Unit Planner handles teacher and classroom planning data.',
    path: '/school-data',
    keywords: SEO_KEYWORDS,
  },
} as const satisfies Record<string, PageSeo>

export function webSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    inLanguage: 'en-AU',
  }
}

export function softwareApplicationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    audience: { '@type': 'Audience', audienceType: 'Teachers' },
  }
}

export function webPageJsonLd(seo: PageSeo) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: seo.title,
    description: seo.description,
    url: `${SITE_URL}${seo.path}`,
    inLanguage: 'en-AU',
  }
}
