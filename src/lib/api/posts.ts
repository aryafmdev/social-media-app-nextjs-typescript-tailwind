export type Post = {
  id: string;
  imageUrl?: string;
  caption?: string;
  liked?: boolean;
  saved?: boolean;
  likesCount?: number;
  commentsCount?: number;
  author?: { username: string; name?: string; avatarUrl?: string };
  createdAt?: string;
};
export type PostDetail = Post;

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

function normalizePostDetail(raw: Record<string, unknown>): PostDetail {
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
  const likedCandidate = (raw['liked'] ??
    raw['isLiked'] ??
    raw['likedByMe'] ??
    raw['isLikedByMe'] ??
    raw['liked_by_me']) as unknown;
  const liked = (() => {
    if (typeof likedCandidate === 'boolean') return likedCandidate;
    const likesList = raw['likes'] as unknown;
    if (Array.isArray(likesList)) {
      for (const it of likesList) {
        if (
          it &&
          typeof it === 'object' &&
          (it as Record<string, unknown>)['isMe'] === true
        )
          return true;
      }
    }
    return undefined;
  })();
  const savedCandidate = (raw['saved'] ?? raw['isSaved']) as unknown;
  const saved =
    typeof savedCandidate === 'boolean' ? savedCandidate : undefined;
  const likesCount = toNumber(
    (raw as Record<string, unknown>)['likesCount'] ??
      (raw as Record<string, unknown>)['likeCount'] ??
      (raw as Record<string, unknown>)['totalLikes'] ??
      (raw as Record<string, unknown>)['likes_total'] ??
      raw['likes']
  );
  const commentsCount = toNumber(
    raw['commentsCount'] ??
      raw['comments'] ??
      (raw as Record<string, unknown>)['commentCount']
  );
  const createdAtCandidate = (raw['createdAt'] ??
    raw['created_at'] ??
    raw['timestamp'] ??
    raw['postedAt']) as unknown;
  const createdAt =
    typeof createdAtCandidate === 'string' ? createdAtCandidate : undefined;
  const authorCandidate = (raw['author'] ??
    raw['user'] ??
    raw['owner'] ??
    raw['createdBy'] ??
    raw['created_by'] ??
    raw['postedBy'] ??
    raw['posted_by']) as unknown;
  const authorRoot =
    authorCandidate && typeof authorCandidate === 'object'
      ? (authorCandidate as Record<string, unknown>)
      : raw;
  const authorUsername =
    findFirstStringDeep(authorRoot, ['username', 'user_name', 'handle']) ||
    (typeof raw['username'] === 'string' ? raw['username'] : undefined);
  const authorName =
    findFirstStringDeep(authorRoot, ['name', 'fullName', 'displayName']) ||
    (typeof raw['name'] === 'string' ? raw['name'] : undefined);
  const authorAvatar = findFirstStringDeep(authorRoot, [
    'avatarUrl',
    'avatar_url',
    'image',
    'photo',
    'profilePicture',
    'profile_picture',
  ]);
  const author: Post['author'] | undefined = (() => {
    if (authorUsername || authorName || authorAvatar)
      return {
        username: (authorUsername ?? authorName ?? '').trim(),
        name: authorName,
        avatarUrl: authorAvatar,
      };
    return undefined;
  })();
  return {
    id,
    imageUrl,
    caption,
    liked,
    saved,
    likesCount,
    commentsCount,
    createdAt,
    author,
  };
}

export async function createPost(
  token: string,
  input: { image: File; caption?: string }
): Promise<Post> {
  const form = new FormData();
  form.append('image', input.image);
  if (input.caption) form.append('caption', input.caption);
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!res.ok) throw new Error('Failed to create post');
  return (await res.json()) as Post;
}

export async function getPost(id: string): Promise<PostDetail> {
  const res = await fetch(`/api/posts/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to get post');
  const raw = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  const root = (raw && (raw as Record<string, unknown>)['data']) || raw;
  const obj =
    root && typeof root === 'object' ? (root as Record<string, unknown>) : {};
  return normalizePostDetail(obj);
}

export async function deletePost(
  token: string,
  id: string
): Promise<{ ok: boolean }> {
  const res = await fetch(`/api/posts/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete post');
  return { ok: true };
}
