import type { MetadataRoute } from 'next';
import { SITE, absoluteUrl } from '@/lib/site';

const BLOCKED_PATHS = ['/admin', '/admin/', '/api', '/api/'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: BLOCKED_PATHS,
      },
      {
        userAgent: 'Yeti',
        allow: '/',
        disallow: BLOCKED_PATHS,
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: SITE.url,
  };
}
