# Instagram feed for Astro without the Instagram API headache

A small Astro starter that shows your latest Instagram posts as a grid, using the [Feedframer](https://feedframer.com/?utm_source=github&utm_medium=starter&utm_campaign=astro) API. No Meta developer app, no access tokens to babysit, no cron job to refresh them.

## Why we built this

If you've tried putting an Instagram feed on a Astro site, you'll know the pain:

- **Instagram Basic Display was shut down in December 2024.** Lots of tutorials and packages still point at it, and they simply don't work any more.
- **Access tokens expire.** Instagram Graph API tokens last 60 days, and they can be cut short by a password change or a security check. Miss a refresh and your feed quietly stops updating.
- **The Graph API needs a Meta app, app review and a fair bit of plumbing** just to read your own posts.

Feedframer handles the Instagram side for you. You connect your account once, we refresh the token server-side, copy the media to our CDN, and you read your posts from one URL with an API key. This repo is the Astro end of that.

> Heads up: Instagram only allows this for **Business or Creator** accounts. Switching a personal account over is free and takes a minute in the Instagram app.

## Setup in 3 steps

1. **[Get a free API key](https://feedframer.com/?utm_source=github&utm_medium=starter&utm_campaign=astro)**: sign up, connect your Instagram Business or Creator account and copy the API key from your dashboard.
2. **Add it to your environment:**

   ```bash
   cp .env.example .env
   # then set FEEDFRAMER_API_KEY=your_key
   ```

3. **Run it:**

   ```bash
   npm install
   npm run dev
   ```

That's it. You should see your latest posts in a grid.

## How it works

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
