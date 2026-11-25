// Placeholder tiles shown when FEEDFRAMER_API_KEY is not set, so the starter
// (and its public demo) renders a grid out of the box. These are not real posts.
export const sampleFeed = {
  username: null,
  status: 'sample',
  error: null,
  posts: Array.from({ length: 6 }, (_, i) => ({
    id: `sample-${i + 1}`,
    mediaType: 'IMAGE',
    mediaUrl: `/sample/post-${i + 1}.svg`,
    thumbnailUrl: null,
    permalink: 'https://feedframer.com/?utm_source=github&utm_medium=starter&utm_campaign=astro-demo',
    altText: `Sample post ${i + 1} (placeholder)`,
  })),
};
