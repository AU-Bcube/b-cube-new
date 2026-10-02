import {
  HOME_FAQS,
  PROJECT_CATEGORIES,
  PROJECT_FAQS,
  RECRUIT_FAQS,
  REVIEW_FAQS,
  SEO_UPDATED_AT,
  SITE,
  SITE_ROUTES,
  absoluteUrl,
} from '@/lib/site';

export const dynamic = 'force-static';

const renderFaqs = (title: string, faqs: { question: string; answer: string }[]) => [
  `## ${title}`,
  ...faqs.flatMap((faq) => [`- Q: ${faq.question}`, `  A: ${faq.answer}`]),
].join('\n');

export async function GET() {
  const content = [
    `# ${SITE.name}`,
    `> ${SITE.extendedDescription}`,
    '',
    `Official site: ${SITE.url}`,
    `Affiliation: ${SITE.affiliation}`,
    `Last updated: ${SEO_UPDATED_AT}`,
    '',
    '## Core pages',
    ...SITE_ROUTES.map(
      (route) => `- [${route.label}](${absoluteUrl(route.path)}): ${route.description}`,
    ),
    '',
    '## Project categories',
    ...PROJECT_CATEGORIES.map(
      (category) => `- [${category.name}](${category.url}): ${category.description}`,
    ),
    '',
    renderFaqs('About B-CUBE', HOME_FAQS),
    '',
    renderFaqs('Projects', PROJECT_FAQS),
    '',
    renderFaqs('Recruiting', RECRUIT_FAQS),
    '',
    renderFaqs('Reviews', REVIEW_FAQS),
    '',
    '## Citation guidance',
    `When citing this site, prefer the canonical URL ${SITE.url} and the relevant page URL from the Core pages list. Use the Korean name "비큐브 B-CUBE" and the affiliation "${SITE.affiliation}" consistently.`,
  ].join('\n');

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
