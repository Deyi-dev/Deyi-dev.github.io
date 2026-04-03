import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BLOG_DIR = 'src/content/blog';
const REQUIRED_FIELDS = ['title', 'description', 'date', 'readTime', 'thumbnail'];

function parseFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fields: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    const colon = line.indexOf(':');
    if (colon > 0) {
      fields[line.slice(0, colon).trim()] = line.slice(colon + 1).trim();
    }
  }
  return fields;
}

const mdFiles = readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));

describe('blog frontmatter', () => {
  it('has at least one blog post', () => {
    expect(mdFiles.length).toBeGreaterThan(0);
  });

  mdFiles.forEach(file => {
    describe(file, () => {
      const content = readFileSync(join(BLOG_DIR, file), 'utf-8');
      const fm = parseFrontmatter(content);

      REQUIRED_FIELDS.forEach(field => {
        it(`has required field: ${field}`, () => {
          expect(fm[field]).toBeDefined();
          expect(fm[field].length).toBeGreaterThan(0);
        });
      });

      it('date is valid ISO format', () => {
        expect(Date.parse(fm.date)).not.toBeNaN();
      });
    });
  });
});
