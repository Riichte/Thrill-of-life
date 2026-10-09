import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/dashboard', '/profile', '/auth/'] },
    sitemap: 'https://www.thrill-of-life.com/sitemap.xml',
  }
}