import { useLocation } from 'react-router-dom'
import {
  ROUTE_ACCOUNT,
  ROUTE_HOME,
  ROUTE_LOGIN,
  ROUTE_PRIVACY,
  ROUTE_SCHOOL_DATA,
  ROUTE_TERMS,
} from '../constants/routes'
import { PageMeta } from '../seo/PageMeta'
import { PAGE_SEO } from '../seo/siteMeta'

export function SeoRoute() {
  const { pathname } = useLocation()

  if (pathname === ROUTE_HOME) {
    return <PageMeta seo={PAGE_SEO.home} includeDiscoverySchema />
  }
  if (pathname === ROUTE_LOGIN) {
    return <PageMeta seo={PAGE_SEO.login} />
  }
  if (pathname === ROUTE_ACCOUNT) {
    return <PageMeta seo={PAGE_SEO.account} />
  }
  if (pathname === ROUTE_PRIVACY) {
    return <PageMeta seo={PAGE_SEO.privacy} />
  }
  if (pathname === ROUTE_TERMS) {
    return <PageMeta seo={PAGE_SEO.terms} />
  }
  if (pathname === ROUTE_SCHOOL_DATA) {
    return <PageMeta seo={PAGE_SEO.schoolData} />
  }

  return <PageMeta seo={PAGE_SEO.home} includeDiscoverySchema />
}
