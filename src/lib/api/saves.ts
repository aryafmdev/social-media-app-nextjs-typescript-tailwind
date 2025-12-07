import type { Post } from './posts';

function toNumber(v: unknown, fallback = 0): number {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (Array.isArray(v)) return v.length;
  if (typeof v === 'string') {
    const n = Number(v);
    if (!Number.isNaN(n)) return n;
  }
  return fallback;
}

function findFirstStringDeep(src: unknown, keys: string[]): string | undefined {
  if (!src || typeof src !== 'object') return undefined;
  const stack: Record<string, unknown>[] = [src as Record<string, unknown>];
  const seen = new Set<object>();
  while (stack.length) {
    const cur = stack.pop()!;
    if (seen.has(cur)) continue;
    seen.add(cur);
    for (const k of keys) {
      const v = (cur as Record<string, unknown>)[k];
      if (typeof v === 'string' && v.trim().length > 0) return v;
    }
    for (const v of Object.values(cur)) {
      if (v && typeof v === 'object') stack.push(v as Record<string, unknown>);
    }
  }
  return undefined;
}

function normalizePost(raw: Record<string, unknown>): Post {
  const idRaw = (raw['id'] ?? raw['postId']) as unknown;
  const id = typeof idRaw === 'string' ? idRaw : String(idRaw ?? '');
  const imageUrlCandidate = (raw['imageUrl'] ?? raw['image_url'] ?? raw['image'] ?? raw['photo'] ?? raw['url']) as unknown;
  const imageUrl = typeof imageUrlCandidate === 'string' ? imageUrlCandidate : undefined;
  const captionCandidate = (raw['caption'] ?? raw['text'] ?? raw['description']) as unknown;
  const caption = typeof captionCandidate === 'string' ? captionCandidate : undefined;
  const likedCandidate = (raw['liked'] ?? raw['isLiked'] ?? raw['likedByMe'] ?? raw['isLikedByMe'] ?? raw['liked_by_me']) as unknown;
  const liked = (() => {
    if (typeof likedCandidate === 'boolean') return likedCandidate;
    const likesList = raw['likes'] as unknown;
    if (Array.isArray(likesList)) {
      for (const it of likesList) {
        if (it && typeof it === 'object' && (it as Record<string, unknown>)['isMe'] === true) return true;
      }
    }
    return undefined;
  })();
  const savedCandidate = (raw['saved'] ?? raw['isSaved']) as unknown;
  const saved = typeof savedCandidate === 'boolean' ? savedCandidate : undefined;
  const likesCount = toNumber((raw as Record<string, unknown>)['likesCount'] ?? (raw as Record<string, unknown>)['likeCount'] ?? (raw as Record<string, unknown>)['totalLikes'] ?? (raw as Record<string, unknown>)['likes_total'] ?? raw['likes']);
  const commentsCount = toNumber((raw as Record<string, unknown>)['commentsCount'] ?? (raw as Record<string, unknown>)['comments'] ?? (raw as Record<string, unknown>)['commentCount'] ?? (raw as Record<string, unknown>)['totalComments'] ?? (raw as Record<string, unknown>)['comments_total']);
  const createdAtCandidate = (raw['createdAt'] ?? raw['created_at'] ?? raw['timestamp'] ?? raw['postedAt']) as unknown;
  const createdAt = typeof createdAtCandidate === 'string' ? createdAtCandidate : undefined;
  const authorCandidate = (raw['author'] ?? raw['user'] ?? raw['owner'] ?? raw['createdBy'] ?? raw['created_by'] ?? raw['postedBy'] ?? raw['posted_by']) as unknown;
  const authorRoot = authorCandidate && typeof authorCandidate === 'object' ? (authorCandidate as Record<string, unknown>) : raw;
  const authorUsername = findFirstStringDeep(authorRoot, ['username', 'user_name', 'handle']) || (typeof raw['username'] === 'string' ? raw['username'] : undefined);
  const authorName = findFirstStringDeep(authorRoot, ['name', 'fullName', 'displayName']) || (typeof raw['name'] === 'string' ? raw['name'] : undefined);
  const authorAvatar = findFirstStringDeep(authorRoot, ['avatarUrl', 'avatar_url', 'image', 'photo', 'profilePicture', 'profile_picture']);
  const author: Post['author'] | undefined = (() => {
    if (authorUsername || authorName || authorAvatar)
      return { username: (authorUsername ?? authorName ?? '').trim(), name: authorName, avatarUrl: authorAvatar };
    return undefined;
  })();
  return { id, imageUrl, caption, liked, saved, likesCount, commentsCount, createdAt, author };
}

export async function savePost(token: string, id: string): Promise<{ saved: boolean }> {
  const res = await fetch(`/api/posts/${id}/save`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error('Failed to save');
  return { saved: true };
}

export async function unsavePost(token: string, id: string): Promise<{ saved: boolean }> {
  const res = await fetch(`/api/posts/${id}/save`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error('Failed to unsave');
  return { saved: false };
}

export async function getMySaved(token: string, page = 1, limit = 20): Promise<{ items: Post[] }> {
  const res = await fetch(`/api/me/saved?page=${page}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to get saved posts');
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown> | { items: unknown };
  const root = (typeof json === 'object' && json && (json as Record<string, unknown>)['data']) || json;
  const itemsUnknown = (root && (root as Record<string, unknown>)['items']) || (root && (root as Record<string, unknown>)['posts']) || root;
  const arr: unknown[] = Array.isArray(itemsUnknown)
    ? itemsUnknown
    : Array.isArray((itemsUnknown as Record<string, unknown>)?.['items'])
      ? (((itemsUnknown as Record<string, unknown>)['items'] as unknown[]) ?? [])
      : [];
  const items: Post[] = arr
    .filter((it) => it && typeof it === 'object')
    .map((it) => normalizePost(it as Record<string, unknown>));
  return { items };
}
