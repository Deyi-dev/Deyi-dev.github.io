export interface FeedPostInput {
  slug: string;
  data: { title: string; description: string; date: Date; draft?: boolean };
}

export interface FeedItem {
  title: string;
  description: string;
  pubDate: Date;
  link: string;
}

/** Published posts, newest first, mapped to RSS feed items. */
export function postsToFeedItems(posts: FeedPostInput[]): FeedItem[] {
  return posts
    .filter(p => !p.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .map(p => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.date,
      link: `/blog/${p.slug}/`,
    }));
}
