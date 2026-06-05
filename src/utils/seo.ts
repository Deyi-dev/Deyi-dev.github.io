/** Resolve a (possibly root-relative) path against the site origin. */
export function absoluteUrl(path: string, site: string): string {
  return new URL(path, site).href;
}

export interface ArticleSeo {
  title: string;
  description: string;
  url: string;
  image: string;
  date: Date;
  author: string;
}

/** schema.org BlogPosting JSON-LD for an article page. */
export function buildArticleJsonLd(a: ArticleSeo): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: a.title,
    description: a.description,
    image: a.image,
    datePublished: a.date.toISOString(),
    author: { '@type': 'Person', name: a.author },
    mainEntityOfPage: { '@type': 'WebPage', '@id': a.url },
    url: a.url,
  };
}
