export type UserPublic = {
  username: string;
  name?: string;
  avatarUrl?: string;
  bio?: string;
  stats?: { post: number; followers: number; following: number; likes: number };
  isFollowedByMe?: boolean;
};
export type UserSummary = {
  username: string;
  name?: string;
  avatarUrl?: string;
};
export type PublicPost = { id: string; imageUrl?: string; caption?: string };

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

function findFirstNumberDeep(
  src: unknown,
  keys: string[],
  fallback = 0
): number {
  if (!src || typeof src !== 'object') return fallback;
  const stack: Record<string, unknown>[] = [src as Record<string, unknown>];
  const seen = new Set<object>();
  while (stack.length) {
    const cur = stack.pop()!;
    if (seen.has(cur)) continue;
    seen.add(cur);
    for (const k of keys) {
      const v = (cur as Record<string, unknown>)[k];
      if (typeof v === 'number' && Number.isFinite(v)) return v;
      if (typeof v === 'string') {
        const n = Number(v);
        if (!Number.isNaN(n)) return n;
      }
    }
    for (const v of Object.values(cur)) {
      if (v && typeof v === 'object') stack.push(v as Record<string, unknown>);
    }
  }
  return fallback;
}

function findFirstBooleanDeep(
  src: unknown,
  keys: string[]
): boolean | undefined {
  if (!src || typeof src !== 'object') return undefined;
  const stack: Record<string, unknown>[] = [src as Record<string, unknown>];
  const seen = new Set<object>();
  while (stack.length) {
    const cur = stack.pop()!;
    if (seen.has(cur)) continue;
    seen.add(cur);
    for (const k of keys) {
      const v = (cur as Record<string, unknown>)[k];
      if (typeof v === 'boolean') return v;
      if (typeof v === 'number') return v !== 0;
      if (typeof v === 'string') {
        const t = v.trim().toLowerCase();
        if (t === 'true' || t === '1') return true;
        if (t === 'false' || t === '0') return false;
      }
    }
    for (const v of Object.values(cur)) {
      if (v && typeof v === 'object') stack.push(v as Record<string, unknown>);
    }
  }
  return undefined;
}

function normalizeUserPublic(raw: Record<string, unknown>): UserPublic {
  const username =
    findFirstStringDeep(raw, ['username', 'user_name', 'handle']) || '';
  const name = findFirstStringDeep(raw, ['name', 'fullName', 'displayName']);
  const avatarUrl = findFirstStringDeep(raw, [
    'avatarUrl',
    'avatar_url',
    'image',
    'photo',
    'profilePicture',
    'profile_picture',
  ]);
  const bio = findFirstStringDeep(raw, ['bio', 'about', 'description']);
  const stats = (() => {
    const post = findFirstNumberDeep(
      raw,
      [
        'post',
        'posts',
        'postCount',
        'postsCount',
        'images',
        'imageCount',
        'photos',
        'photoCount',
        'totalPosts',
      ],
      0
    );
    const followers = findFirstNumberDeep(
      raw,
      ['followers', 'followersCount', 'followers_count'],
      0
    );
    const following = findFirstNumberDeep(
      raw,
      ['following', 'followingCount', 'following_count'],
      0
    );
    const likes = findFirstNumberDeep(
      raw,
      ['likes', 'likesCount', 'likes_count', 'totalLikes'],
      0
    );
    if (post || followers || following || likes)
      return { post, followers, following, likes };
    return undefined;
  })();
  const isFollowedByMe = findFirstBooleanDeep(raw, [
    'isFollowedByMe',
    'followedByMe',
    'is_followed_by_me',
  ]);
  const out = { username, name, avatarUrl, bio, stats } as UserPublic;
  if (isFollowedByMe !== undefined) (out as UserPublic & { isFollowedByMe?: boolean }).isFollowedByMe = isFollowedByMe;
  return out;
}

export async function getUser(username: string): Promise<UserPublic> {
  const res = await fetch(`/api/users/${username}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch user');
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  const root =
    (json && (json['data'] as Record<string, unknown>)) ||
    (json['user'] as Record<string, unknown>) ||
    json;
  const obj = root && typeof root === 'object' ? root : {};
  return normalizeUserPublic(obj);
}

export async function getUserPosts(
  username: string,
  page = 1,
  limit = 20
): Promise<{ items: PublicPost[] }> {
  const res = await fetch(
    `/api/users/${username}/posts?page=${page}&limit=${limit}`,
    { cache: 'no-store' }
  );
  if (!res.ok) throw new Error('Failed to fetch posts');
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
  const items: PublicPost[] = arr
    .filter((it) => it && typeof it === 'object')
    .map((raw) => {
      const o = raw as Record<string, unknown>;
      const p = (o['post'] ?? o['item'] ?? o['content']) as unknown;
      const src =
        p && typeof p === 'object' ? (p as Record<string, unknown>) : o;
      const idCandidate = (src['id'] ?? o['postId'] ?? o['id']) as unknown;
      const id =
        typeof idCandidate === 'string'
          ? idCandidate
          : String(idCandidate ?? '');
      const mediaCandidate = (src['media'] ??
        src['images'] ??
        src['photos']) as unknown;
      const firstMediaUrl =
        Array.isArray(mediaCandidate) && mediaCandidate.length
          ? typeof mediaCandidate[0] === 'string'
            ? (mediaCandidate[0] as string)
            : ((mediaCandidate[0] as Record<string, unknown>)['url'] ??
              (mediaCandidate[0] as Record<string, unknown>)['src'])
          : undefined;
      const imageUrlCandidate = (src['imageUrl'] ??
        src['image_url'] ??
        src['image'] ??
        src['photo'] ??
        src['url'] ??
        firstMediaUrl) as unknown;
      const imageUrl =
        typeof imageUrlCandidate === 'string'
          ? imageUrlCandidate
          : findFirstStringDeep(src, [
              'imageUrl',
              'image_url',
              'image',
              'photo',
              'thumbnailUrl',
              'thumbnail',
              'thumb',
              'cover',
              'poster',
              'url',
            ]) ||
            findFirstStringDeep(o, [
              'imageUrl',
              'image_url',
              'image',
              'photo',
              'thumbnailUrl',
              'thumbnail',
              'thumb',
              'cover',
              'poster',
              'url',
            ]) ||
            undefined;
      const captionCandidate = (src['caption'] ??
        src['text'] ??
        src['description']) as unknown;
      const caption =
        typeof captionCandidate === 'string'
          ? captionCandidate
          : findFirstStringDeep(src, ['caption', 'text', 'description']) ||
            findFirstStringDeep(o, ['caption', 'text', 'description']) ||
            undefined;
      return { id, imageUrl, caption };
    });
  return { items };
}

export async function getUserLikes(
  username: string,
  page = 1,
  limit = 20,
  token?: string
): Promise<{ items: PublicPost[] }> {
  const res = await fetch(
    `/api/users/${username}/likes?page=${page}&limit=${limit}`,
    {
      cache: 'no-store',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }
  );
  if (!res.ok) throw new Error('Failed to fetch likes');
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
    (root && (root as Record<string, unknown>)['likes']) ||
    root;
  const arr: unknown[] = Array.isArray(itemsUnknown)
    ? itemsUnknown
    : Array.isArray((itemsUnknown as Record<string, unknown>)?.['items'])
      ? (((itemsUnknown as Record<string, unknown>)['items'] as unknown[]) ??
        [])
      : [];
  const items: PublicPost[] = arr
    .filter((it) => it && typeof it === 'object')
    .map((raw) => {
      const o = raw as Record<string, unknown>;
      const p = (o['post'] ?? o['item'] ?? o['content']) as unknown;
      const src =
        p && typeof p === 'object' ? (p as Record<string, unknown>) : o;
      const idCandidate = (src['id'] ?? o['postId'] ?? o['id']) as unknown;
      const id =
        typeof idCandidate === 'string'
          ? idCandidate
          : String(idCandidate ?? '');
      const mediaCandidate = (src['media'] ??
        src['images'] ??
        src['photos']) as unknown;
      const firstMediaUrl =
        Array.isArray(mediaCandidate) && mediaCandidate.length
          ? typeof mediaCandidate[0] === 'string'
            ? (mediaCandidate[0] as string)
            : ((mediaCandidate[0] as Record<string, unknown>)['url'] ??
              (mediaCandidate[0] as Record<string, unknown>)['src'])
          : undefined;
      const imageUrlCandidate = (src['imageUrl'] ??
        src['image_url'] ??
        src['image'] ??
        src['photo'] ??
        src['url'] ??
        firstMediaUrl) as unknown;
      const imageUrl =
        typeof imageUrlCandidate === 'string'
          ? imageUrlCandidate
          : findFirstStringDeep(src, [
              'imageUrl',
              'image_url',
              'image',
              'photo',
              'thumbnailUrl',
              'thumbnail',
              'thumb',
              'cover',
              'poster',
              'url',
            ]) ||
            findFirstStringDeep(o, [
              'imageUrl',
              'image_url',
              'image',
              'photo',
              'thumbnailUrl',
              'thumbnail',
              'thumb',
              'cover',
              'poster',
              'url',
            ]) ||
            undefined;
      const captionCandidate = (src['caption'] ??
        src['text'] ??
        src['description']) as unknown;
      const caption =
        typeof captionCandidate === 'string'
          ? captionCandidate
          : findFirstStringDeep(src, ['caption', 'text', 'description']) ||
            findFirstStringDeep(o, ['caption', 'text', 'description']) ||
            undefined;
      return { id, imageUrl, caption };
    });
  return { items };
}

export async function searchUsers(
  q: string,
  page?: number,
  limit?: number
): Promise<{ items: UserSummary[] }>;
export async function searchUsers(
  q: string,
  page?: number,
  limit?: number,
  token?: string
): Promise<{ items: UserSummary[] }>;
export async function searchUsers(
  q: string,
  page = 1,
  limit = 20,
  token?: string
): Promise<{ items: UserSummary[] }> {
  const res = await fetch(
    `/api/users/search?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`,
    {
      cache: 'no-store',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }
  );
  if (!res.ok) throw new Error('Failed to search users');
  return (await res.json()) as { items: UserSummary[] };
}
