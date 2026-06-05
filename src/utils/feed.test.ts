import { describe, it, expect } from 'vitest';
import { postsToFeedItems } from './feed';

type P = Parameters<typeof postsToFeedItems>[0][number];

function post(slug: string, date: string, draft = false): P {
  return {
    slug,
    data: { title: `T:${slug}`, description: `D:${slug}`, date: new Date(date), draft },
  };
}

describe('postsToFeedItems', () => {
  it('excludes drafts', () => {
    const items = postsToFeedItems([
      post('a', '2024-01-01'),
      post('b', '2024-02-01', true),
    ]);
    expect(items.map(i => i.title)).toEqual(['T:a']);
  });

  it('sorts newest first', () => {
    const items = postsToFeedItems([
      post('old', '2024-01-01'),
      post('new', '2024-03-01'),
      post('mid', '2024-02-01'),
    ]);
    expect(items.map(i => i.link)).toEqual(['/blog/new/', '/blog/mid/', '/blog/old/']);
  });

  it('maps title, description, pubDate and a trailing-slash link', () => {
    const [item] = postsToFeedItems([post('hello', '2024-04-05')]);
    expect(item.title).toBe('T:hello');
    expect(item.description).toBe('D:hello');
    expect(item.link).toBe('/blog/hello/');
    expect(item.pubDate).toEqual(new Date('2024-04-05'));
  });
});
