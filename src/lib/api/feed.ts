import type { Post } from './posts';

function toNumber(v: unknown, fallback = 0): number {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string') {
    const n = Number(v);
    if (!Number.isNaN(n)) return n;
  }
  return fallback;
}

function normalizePost(raw: Record<string, unknown>): Post {
  const idRaw = (raw['id'] ?? raw['postId']) as unknown;
  const id = typeof idRaw === 'string' ? idRaw : String(idRaw ?? '');
  const imageUrlCandidate = (raw['imageUrl'] ??
    raw['image_url'] ??
    raw['image'] ??
    raw['photo'] ??
    raw['url']) as unknown;
  const imageUrl =
    typeof imageUrlCandidate === 'string' ? imageUrlCandidate : undefined;
  const captionCandidate = (raw['caption'] ??
    raw['text'] ??
    raw['description']) as unknown;
  const caption =
    typeof captionCandidate === 'string' ? captionCandidate : undefined;
  const likedCandidate = (raw['liked'] ?? raw['isLiked']) as unknown;
  const liked =
    typeof likedCandidate === 'boolean' ? likedCandidate : undefined;
  const savedCandidate = (raw['saved'] ?? raw['isSaved']) as unknown;
  const saved =
    typeof savedCandidate === 'boolean' ? savedCandidate : undefined;
  const likesCount = toNumber(raw['likesCount'] ?? raw['likes']);
  const commentsCount = toNumber(raw['commentsCount'] ?? raw['comments']);
  return { id, imageUrl, caption, liked, saved, likesCount, commentsCount };
}

export async function getFeed(
  token: string,
  page = 1,
  limit = 20
): Promise<{ items: Post[] }> {
  const res = await fetch(`/api/feed?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to get feed');
  const json = (await res.json().catch(() => ({}))) as
    | Record<string, unknown>
    | { items: unknown };
  const root =
    (typeof json === 'object' &&
      json &&
      (json as Record<string, unknown>)['data']) ||
    json;
  const itemsUnknown =
    (root && (root as Record<string, unknown>)['items']) ||
    (root && (root as Record<string, unknown>)['posts']) ||
    root;
  const arr: unknown[] = Array.isArray(itemsUnknown)
    ? itemsUnknown
    : Array.isArray((itemsUnknown as Record<string, unknown>)?.['items'])
      ? (((itemsUnknown as Record<string, unknown>)['items'] as unknown[]) ??
        [])
      : [];
  const items: Post[] = arr
    .filter((it) => it && typeof it === 'object')
    .map((it) => normalizePost(it as Record<string, unknown>));
  return { items };
}
