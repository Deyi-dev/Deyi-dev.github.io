import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { postsToFeedItems } from '../utils/feed';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog');
  return rss({
    title: "Deyi's Workshop",
    description: 'Notes on AI engineering, agents, and building things.',
    site: context.site!,
    items: postsToFeedItems(posts),
  });
}
