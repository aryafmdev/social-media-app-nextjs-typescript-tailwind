import type { Post } from './posts';

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

function findFirstArrayDeep(
  src: unknown,
  keys: string[]
): unknown[] | undefined {
  if (!src || typeof src !== 'object') return undefined;
  const stack: Record<string, unknown>[] = [src as Record<string, unknown>];
  const seen = new Set<object>();
  while (stack.length) {
    const cur = stack.pop()!;
    if (seen.has(cur)) continue;
    seen.add(cur);
    for (const k of keys) {
      const v = (cur as Record<string, unknown>)[k];
      if (Array.isArray(v)) return v as unknown[];
    }
    for (const v of Object.values(cur)) {
      if (Array.isArray(v)) return v as unknown[];
      if (v && typeof v === 'object') stack.push(v as Record<string, unknown>);
    }
  }
  return undefined;
}

export async function likePost(
  token: string,
  id: string
): Promise<{ liked: boolean }> {
  const res = await fetch(`/api/posts/${id}/like`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to like');
  return { liked: true };
}

export async function unlikePost(
  token: string,
  id: string
): Promise<{ liked: boolean }> {
  const res = await fetch(`/api/posts/${id}/like`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to unlike');
  return { liked: false };
}

export async function getPostLikes(
  id: string,
  page = 1,
  limit = 20,
  token?: string
): Promise<{
  items: {
    username: string;
    name?: string;
    isMe?: boolean;
    isFollowedByMe?: boolean;
    followsMe?: boolean;
    avatarUrl?: string;
  }[];
}> {
  const headers: HeadersInit = token
    ? { Authorization: `Bearer ${token}` }
    : {};
  const res = await fetch(
    `/api/posts/${id}/likes?page=${page}&limit=${limit}`,
    { headers, cache: 'no-store' }
  );
  if (!res.ok) throw new Error('Failed to get likes');
  const json = (await res.json().catch(() => ({}))) as
    | Record<string, unknown>
    | { items: unknown };
  const root =
    (typeof json === 'object' &&
      json &&
      (json as Record<string, unknown>)['data']) ||
    json;
  const direct =
    (root && (root as Record<string, unknown>)['items']) ||
    (root && (root as Record<string, unknown>)['likes']) ||
    (root && (root as Record<string, unknown>)['likers']) ||
    (root && (root as Record<string, unknown>)['users']) ||
    (root && (root as Record<string, unknown>)['likedBy']) ||
    (root && (root as Record<string, unknown>)['liked_by']) ||
    root;
  let arr: unknown[] = Array.isArray(direct)
    ? (direct as unknown[])
    : Array.isArray((direct as Record<string, unknown>)?.['items'])
      ? (((direct as Record<string, unknown>)['items'] as unknown[]) ?? [])
      : [];
  if (arr.length === 0) {
    arr =
      findFirstArrayDeep(root, [
        'items',
        'likes',
        'likers',
        'users',
        'likedBy',
        'liked_by',
      ]) ?? [];
  }
  const items = arr
    .filter((it) => it && typeof it === 'object')
    .map((it) => {
      const o = it as Record<string, unknown>;
      const username =
        findFirstStringDeep(o, ['username', 'user_name', 'handle']) || '';
      const name = findFirstStringDeep(o, ['name', 'fullName', 'displayName']);
      const avatarUrl = findFirstStringDeep(o, [
        'avatarUrl',
        'avatar_url',
        'image',
        'photo',
        'profilePicture',
        'profile_picture',
      ]);
      const isMe = (o['isMe'] as boolean) ?? undefined;
      const isFollowedByMe =
        (o['isFollowedByMe'] as boolean) ??
        (o['followedByMe'] as boolean) ??
        undefined;
      const followsMe = (o['followsMe'] as boolean) ?? undefined;
      return { username, name, avatarUrl, isMe, isFollowedByMe, followsMe };
    });
  return { items };
}

export async function getMyLiked(
  token: string,
  page = 1,
  limit = 20
): Promise<{ items: Post[] }> {
  const res = await fetch(`/api/me/likes?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to get my liked posts');
  return (await res.json()) as { items: Post[] };
}
