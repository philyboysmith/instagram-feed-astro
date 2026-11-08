# Live Instagram feed for Astro — replace a static InstaStrip with Feedframer

Keep your existing Astro layout and swap its static photos for live Instagram posts. We provide the JSON, refresh Instagram tokens on our servers and leave the HTML and CSS to you. No client-side widget dependency is required.

**Quick start:** connect an Instagram Business or Creator account at [Feedframer](https://feedframer.com/?utm_source=github&utm_medium=starter&utm_campaign=astro), copy `.env.example` to `.env`, set `FEEDFRAMER_API_KEY=YOUR_API_KEY`, then run:

```bash
npm install
npm run dev
```

For an existing site, put the following in `src/components/InstaStrip.astro` and import it into your page. Keep the key server-side (no `PUBLIC_` prefix).

```astro
---
type Post = {
  id: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  mediaUrl: string;
  thumbnailUrl: string | null;
  permalink: string;
  altText?: string | null;
};
const apiKey = import.meta.env.FEEDFRAMER_API_KEY;
let posts: Post[] = [];
if (apiKey) {
  try {
    const url = new URL('https://feedframer.com/api/v1/me');
    url.searchParams.set('api_key', apiKey);
    const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error('Feed unavailable');
    const feed = await response.json();
    if (!Array.isArray(feed.posts)) throw new Error('Unexpected feed response');
    posts = feed.posts.slice(0, 6);
    if (feed.status === 'invalid_token') {
      console.warn('Feedframer: reconnect Instagram in the dashboard. Showing stored posts.');
    }
  } catch {
    // Do not log request URLs: they contain the account API key.
    console.warn('Feedframer: unable to load Instagram posts.');
  }
}
const tiles = posts.flatMap((post) => {
  const src = post.mediaType === 'VIDEO' ? post.thumbnailUrl : post.mediaUrl;
  return src ? [{ ...post, src }] : [];
});
---
<section aria-label="Latest Instagram posts">
  {tiles.length > 0 ? (
    <div class="instagram-grid">
      {tiles.map((post) => (
        <a href={post.permalink} target="_blank" rel="noopener noreferrer"
           aria-label="View this post on Instagram">
          <img src={post.src} alt={post.altText ?? ''}
               width="400" height="400" loading="lazy" decoding="async" />
        </a>
      ))}
    </div>
  ) : <p>Our Instagram posts are temporarily unavailable.</p>}
</section>
<style>
  .instagram-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.75rem; }
  .instagram-grid img { display: block; width: 100%; height: auto; aspect-ratio: 1; object-fit: cover; }
  @media (min-width: 48rem) { .instagram-grid { grid-template-columns: repeat(6, minmax(0, 1fr)); } }
</style>
```

**Freshness matters:** static Astro fetches at build time. Schedule rebuilds to display new posts, or use an SSR adapter and make the containing page on-demand. Feedframer imports daily on Free and hourly on Premium; an API feed alone cannot refresh already-deployed HTML.

**A Behold alternative for custom Astro galleries:** Feedframer has unlimited API calls, no view metering, REST + GraphQL + RSS and Premium at $6/month. Behold also has JSON feeds and a no-code widget builder; Feedframer does not provide that builder. [Compare the trade-offs](https://feedframer.com/vs/behold).

## Why we built this

If you've tried putting an Instagram feed on an Astro site, you'll know the pain:

- **Instagram Basic Display was shut down in December 2024.** Lots of tutorials and packages still point at it, and they simply don't work any more.
- **Access tokens expire.** Instagram Graph API tokens last 60 days, and they can be cut short by a password change or a security check. Miss a refresh and your feed quietly stops updating.
- **The Graph API needs a Meta app, app review and a fair bit of plumbing** just to read your own posts.

Feedframer handles the Instagram side for you. You connect your account once, we refresh the token server-side, copy the media to our CDN, and you read your posts from one URL with an API key. This repo is the Astro end of that.

> Heads up: Instagram only allows this for **Business or Creator** accounts. Switching a personal account over is free and takes a minute in the Instagram app.

## How this starter works

`src/pages/index.astro` fetches the feed in the frontmatter at build time, so you get a fully static page and the key never reaches the browser. Rebuild on a schedule (a daily deploy hook works nicely) to pick up new posts, or add an SSR adapter if you'd rather fetch per request. Fetching lives in `src/lib/feedframer.js`.

It calls the Feedframer REST endpoint:

```
GET https://feedframer.com/api/v1/me?api_key=YOUR_API_KEY
```

and renders `posts[]`. For `VIDEO` posts we use `thumbnailUrl` for the image, because `mediaUrl` is usually an `.mp4`. Each tile links to the post's `permalink` on Instagram. The key is only ever used server-side, so it isn't shipped to the browser.

If `FEEDFRAMER_API_KEY` isn't set, or the request fails, the page still builds and shows a friendly message instead of crashing. Handy for CI. To check the build:

```bash
FEEDFRAMER_API_KEY=dummy npm run build
```

## Plans

- **Free:** your 6 most recent posts, unlimited API calls, REST JSON, GraphQL and RSS.
- **Premium ($6/month):** up to 100 posts per request, cursor pagination, hourly updates and responsive image sizes.

Full API reference: [feedframer.com/docs](https://feedframer.com/docs?utm_source=github&utm_medium=starter&utm_campaign=astro).

## Licence

MIT. See [LICENSE](LICENSE). Use it however you like.
