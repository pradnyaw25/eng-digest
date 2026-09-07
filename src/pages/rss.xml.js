import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const issues = (await getCollection('issues', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'The Weekend Engineering Digest',
    description:
      'A weekly five-minute read on distributed systems, architecture, AI infrastructure, and platform engineering.',
    site: context.site,
    items: issues.map((issue) => ({
      title: issue.data.title,
      description: issue.data.dek,
      pubDate: issue.data.date,
      link: `/issues/${issue.id}`,
    })),
    customData: '<language>en-us</language>',
  });
}
