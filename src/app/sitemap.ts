import type { MetadataRoute } from 'next';
import { SEO_UPDATED_AT, SITE_ROUTES, absoluteUrl } from '@/lib/site';

const lastModified = new Date(`${SEO_UPDATED_AT}T00:00:00+09:00`);

const routes = [
  ...SITE_ROUTES,
  {
    path: '/llms.txt',
    priority: 0.4,
    changeFrequency: 'monthly',
  },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
