import { SITE, absoluteUrl, type FaqItem } from '@/lib/site';

export const ORGANIZATION_ID = `${absoluteUrl('/')}#organization`;
export const WEBSITE_ID = `${absoluteUrl('/')}#website`;

type BreadcrumbItem = {
  name: string;
  path: string;
};

type PageNodeParams = {
  type?: 'WebPage' | 'CollectionPage';
  path: string;
  name: string;
  description: string;
  mainEntity?: unknown;
  potentialAction?: unknown;
};

type ItemListItem = {
  name: string;
  description: string;
  url: string;
};

export function createJsonLdGraph(nodes: Array<Record<string, unknown>>) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  };
}

export function createPageNode({
  type = 'WebPage',
  path,
  name,
  description,
  mainEntity,
  potentialAction,
}: PageNodeParams) {
  return {
    '@type': type,
    '@id': `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name,
    description,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORGANIZATION_ID },
    inLanguage: SITE.language,
    ...(mainEntity ? { mainEntity } : {}),
    ...(potentialAction ? { potentialAction } : {}),
  };
}

export function createBreadcrumbNode(items: BreadcrumbItem[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function createFaqNode(path: string, faqs: FaqItem[]) {
  return {
    '@type': 'FAQPage',
    '@id': `${absoluteUrl(path)}#faq`,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function createItemListNode(
  path: string,
  name: string,
  items: ItemListItem[],
) {
  return {
    '@type': 'ItemList',
    '@id': `${absoluteUrl(path)}#itemlist`,
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        name: item.name,
        description: item.description,
        url: item.url,
      },
    })),
  };
}
