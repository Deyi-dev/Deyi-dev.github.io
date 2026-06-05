import { describe, it, expect } from 'vitest';
import { absoluteUrl, buildArticleJsonLd } from './seo';

const SITE = 'https://deyi.dev';

// ─── absoluteUrl ────────────────────────────────────────────────────────────

describe('absoluteUrl', () => {
  it('joins site origin with a root-relative path', () => {
    expect(absoluteUrl('/images/chain.png', SITE)).toBe('https://deyi.dev/images/chain.png');
  });

  it('joins a blog path', () => {
    expect(absoluteUrl('/blog/foo/', SITE)).toBe('https://deyi.dev/blog/foo/');
  });

  it('is unaffected by a trailing slash on the site', () => {
    expect(absoluteUrl('/about/', 'https://deyi.dev/')).toBe('https://deyi.dev/about/');
  });

  it('passes through an already-absolute URL', () => {
    expect(absoluteUrl('https://cdn.example.com/a.png', SITE)).toBe('https://cdn.example.com/a.png');
  });
});

// ─── buildArticleJsonLd ─────────────────────────────────────────────────────

describe('buildArticleJsonLd', () => {
  const input = {
    title: 'My Post',
    description: 'A summary.',
    url: 'https://deyi.dev/blog/my-post/',
    image: 'https://deyi.dev/images/x.png',
    date: new Date('2024-04-05T00:00:00Z'),
    author: 'Deyi Zou',
  };

  it('declares schema.org BlogPosting context and type', () => {
    const ld = buildArticleJsonLd(input);
    expect(ld['@context']).toBe('https://schema.org');
    expect(ld['@type']).toBe('BlogPosting');
  });

  it('maps headline, description and image', () => {
    const ld = buildArticleJsonLd(input);
    expect(ld.headline).toBe('My Post');
    expect(ld.description).toBe('A summary.');
    expect(ld.image).toBe('https://deyi.dev/images/x.png');
  });

  it('serialises the publish date as ISO 8601', () => {
    const ld = buildArticleJsonLd(input);
    expect(ld.datePublished).toBe('2024-04-05T00:00:00.000Z');
  });

  it('records the author as a Person', () => {
    const ld = buildArticleJsonLd(input) as any;
    expect(ld.author['@type']).toBe('Person');
    expect(ld.author.name).toBe('Deyi Zou');
  });

  it('points canonical url and mainEntityOfPage at the same URL', () => {
    const ld = buildArticleJsonLd(input) as any;
    expect(ld.url).toBe('https://deyi.dev/blog/my-post/');
    expect(ld.mainEntityOfPage['@id']).toBe('https://deyi.dev/blog/my-post/');
  });
});
