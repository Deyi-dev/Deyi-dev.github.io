import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

// These assert the real build output (the wiring that unit tests can't see).
// jsdom env gives us DOMParser to query <head> like a browser would, no clicks.

const ARTICLE = 'dist/blog/langchain-considered-harmful/index.html';
const HOME = 'dist/index.html';

function read(path: string): string {
  return readFileSync(path, 'utf-8');
}
function doc(path: string): Document {
  return new DOMParser().parseFromString(read(path), 'text/html');
}
function content(d: Document, selector: string): string | null {
  return d.querySelector(selector)?.getAttribute('content') ?? null;
}
function href(d: Document, selector: string): string | null {
  return d.querySelector(selector)?.getAttribute('href') ?? null;
}

beforeAll(() => {
  if (!existsSync(HOME)) execSync('npm run build', { stdio: 'ignore' });
}, 120_000);

// ─── RSS feed ───────────────────────────────────────────────────────────────

describe('feed.xml', () => {
  it('is generated', () => {
    expect(existsSync('dist/feed.xml')).toBe(true);
  });

  it('carries the channel title', () => {
    expect(read('dist/feed.xml')).toContain('Workshop');
  });

  it('links every item as an absolute, trailing-slash blog URL', () => {
    const links = [...read('dist/feed.xml').matchAll(/<link>(https:\/\/deyi\.dev\/blog\/[^<]+)<\/link>/g)]
      .map(m => m[1]);
    expect(links.length).toBeGreaterThan(0);
    links.forEach(l => expect(l.endsWith('/')).toBe(true));
  });
});

// ─── sitemap / robots / CNAME ─────────────────────────────────────────────────

describe('sitemap & robots', () => {
  it('emits a sitemap index and a sitemap', () => {
    expect(existsSync('dist/sitemap-index.xml')).toBe(true);
    expect(existsSync('dist/sitemap-0.xml')).toBe(true);
  });

  it('lists site URLs in the sitemap', () => {
    expect(read('dist/sitemap-0.xml')).toContain('https://deyi.dev/blog/');
  });

  it('robots.txt allows crawling and points at the sitemap', () => {
    const robots = read('dist/robots.txt');
    expect(robots).toContain('User-agent: *');
    expect(robots).toContain('Sitemap: https://deyi.dev/sitemap-index.xml');
  });

  it('pins the custom domain via CNAME', () => {
    expect(read('dist/CNAME').trim()).toBe('deyi.dev');
  });
});

// ─── article page <head> ──────────────────────────────────────────────────────

describe('article page head', () => {
  const CANON = 'https://deyi.dev/blog/langchain-considered-harmful/';
  const IMG = 'https://deyi.dev/images/chain.png';

  it('has a description from frontmatter', () => {
    expect(content(doc(ARTICLE), 'meta[name="description"]')).toBe('When abstractions fight back.');
  });

  it('declares a canonical URL', () => {
    expect(href(doc(ARTICLE), 'link[rel="canonical"]')).toBe(CANON);
  });

  it('emits Open Graph article tags with an absolute image', () => {
    const d = doc(ARTICLE);
    expect(content(d, 'meta[property="og:type"]')).toBe('article');
    expect(content(d, 'meta[property="og:url"]')).toBe(CANON);
    expect(content(d, 'meta[property="og:image"]')).toBe(IMG);
    expect(content(d, 'meta[property="article:published_time"]')).toBe('2024-04-05T00:00:00.000Z');
  });

  it('emits a large-image Twitter card', () => {
    const d = doc(ARTICLE);
    expect(content(d, 'meta[name="twitter:card"]')).toBe('summary_large_image');
    expect(content(d, 'meta[name="twitter:image"]')).toBe(IMG);
  });

  it('embeds valid BlogPosting JSON-LD pointing at the canonical URL', () => {
    const raw = doc(ARTICLE).querySelector('script[type="application/ld+json"]')?.textContent ?? '';
    const ld = JSON.parse(raw);
    expect(ld['@type']).toBe('BlogPosting');
    expect(ld.headline).toContain('LangChain');
    expect(ld.url).toBe(CANON);
    expect(ld.image).toBe(IMG);
    expect(ld.author.name).toBe('Deyi Zou');
  });
});

// ─── home page <head> (BaseLayout) ────────────────────────────────────────────

describe('home page head', () => {
  it('has a non-empty default description', () => {
    expect((content(doc(HOME), 'meta[name="description"]') ?? '').length).toBeGreaterThan(0);
  });

  it('declares the home canonical URL', () => {
    expect(href(doc(HOME), 'link[rel="canonical"]')).toBe('https://deyi.dev/');
  });

  it('advertises the RSS feed via an alternate link', () => {
    expect(href(doc(HOME), 'link[rel="alternate"][type="application/rss+xml"]')).toBe('/feed.xml');
  });

  it('has an absolute og:image', () => {
    expect(content(doc(HOME), 'meta[property="og:image"]')).toMatch(/^https:\/\/deyi\.dev\//);
  });
});
