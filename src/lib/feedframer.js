const ENDPOINT = 'https://feedframer.com/api/v1/me';

/** Fetch the Feedframer feed. Never throws: returns { posts, error }. */
export async function getFeed(apiKey, init = {}) {
  if (!apiKey || !apiKey.trim()) {
    return { posts: [], error: 'FEEDFRAMER_API_KEY is not set. Copy .env.example to .env and add your key.' };
  }
  try {
    const res = await fetch(`${ENDPOINT}?api_key=${encodeURIComponent(apiKey)}`, init);
    const body = await res.json().catch(() => null);
    if (!res.ok) {
      const detail = body?.errors?.[0]?.detail ?? `Feedframer returned HTTP ${res.status}.`;
      return { posts: [], error: detail };
    }
    return { username: body.username, status: body.status, posts: Array.isArray(body.posts) ? body.posts : [], error: null };
  } catch (e) {
    return { posts: [], error: `Could not reach Feedframer: ${e.message}` };
  }
}

/** Videos: mediaUrl is usually an .mp4, so use the thumbnail. */
export function imageSrc(post) {
  return post.mediaType === 'VIDEO' ? post.thumbnailUrl : post.mediaUrl;
}
