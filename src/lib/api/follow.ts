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

export async function followUser(
  token: string,
  username: string
): Promise<{ following: boolean }> {
  const res = await fetch(`/api/follow/${username}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to follow');
  return { following: true };
}

export async function unfollowUser(
  token: string,
  username: string
): Promise<{ following: boolean }> {
  const res = await fetch(`/api/follow/${username}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to unfollow');
  return { following: false };
}

export async function getFollowers(
  username: string,
  page = 1,
  limit = 20,
  token?: string
): Promise<{
  items: {
    username: string;
    name?: string;
    avatarUrl?: string;
    isFollowedByMe?: boolean;
  }[];
}> {
  const headers: HeadersInit = token
    ? { Authorization: `Bearer ${token}` }
    : {};
  const res = await fetch(
    `/api/users/${username}/followers?page=${page}&limit=${limit}`,
    { headers, cache: 'no-store' }
  );
  if (!res.ok) throw new Error('Failed to get followers');
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
    (root && (root as Record<string, unknown>)['followers']) ||
    (root && (root as Record<string, unknown>)['users']) ||
    root;
  let arr: unknown[] = Array.isArray(direct)
    ? (direct as unknown[])
    : Array.isArray((direct as Record<string, unknown>)?.['items'])
      ? (((direct as Record<string, unknown>)['items'] as unknown[]) ?? [])
      : [];
  if (arr.length === 0) {
    arr =
      findFirstArrayDeep(root, ['items', 'followers', 'users', 'list']) ?? [];
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
      const isFollowedByMe =
        (o['isFollowedByMe'] as boolean) ??
        (o['followedByMe'] as boolean) ??
        (o['isFollowing'] as boolean) ??
        undefined;
      return { username, name, avatarUrl, isFollowedByMe };
    });
  return { items };
}

export async function getFollowing(
  username: string,
  page = 1,
  limit = 20,
  token?: string
): Promise<{
  items: {
    username: string;
    name?: string;
    avatarUrl?: string;
    isFollowedByMe?: boolean;
  }[];
}> {
  const headers: HeadersInit = token
    ? { Authorization: `Bearer ${token}` }
    : {};
  const res = await fetch(
    `/api/users/${username}/following?page=${page}&limit=${limit}`,
    { headers, cache: 'no-store' }
  );
  if (!res.ok) throw new Error('Failed to get following');
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
    (root && (root as Record<string, unknown>)['following']) ||
    (root && (root as Record<string, unknown>)['users']) ||
    root;
  let arr: unknown[] = Array.isArray(direct)
    ? (direct as unknown[])
    : Array.isArray((direct as Record<string, unknown>)?.['items'])
      ? (((direct as Record<string, unknown>)['items'] as unknown[]) ?? [])
      : [];
  if (arr.length === 0) {
    arr =
      findFirstArrayDeep(root, ['items', 'following', 'users', 'list']) ?? [];
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
      const isFollowedByMe =
        (o['isFollowedByMe'] as boolean) ??
        (o['followedByMe'] as boolean) ??
        (o['isFollowing'] as boolean) ??
        undefined;
      return { username, name, avatarUrl, isFollowedByMe };
    });
  return { items };
}

export async function getMyFollowers(
  token: string,
  page = 1,
  limit = 20
): Promise<{
  items: {
    username: string;
    name?: string;
    avatarUrl?: string;
    isFollowedByMe?: boolean;
  }[];
}> {
  const res = await fetch(`/api/me/followers?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to get my followers');
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
    (root && (root as Record<string, unknown>)['followers']) ||
    (root && (root as Record<string, unknown>)['users']) ||
    root;
  let arr: unknown[] = Array.isArray(direct)
    ? (direct as unknown[])
    : Array.isArray((direct as Record<string, unknown>)?.['items'])
      ? (((direct as Record<string, unknown>)['items'] as unknown[]) ?? [])
      : [];
  if (arr.length === 0) {
    arr =
      findFirstArrayDeep(root, ['items', 'followers', 'users', 'list']) ?? [];
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
      const isFollowedByMe =
        (o['isFollowedByMe'] as boolean) ??
        (o['followedByMe'] as boolean) ??
        (o['isFollowing'] as boolean) ??
        undefined;
      return { username, name, avatarUrl, isFollowedByMe };
    });
  return { items };
}

export async function getMyFollowing(
  token: string,
  page = 1,
  limit = 20
): Promise<{
  items: {
    username: string;
    name?: string;
    avatarUrl?: string;
    isFollowedByMe?: boolean;
  }[];
}> {
  const res = await fetch(`/api/me/following?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to get my following');
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
    (root && (root as Record<string, unknown>)['following']) ||
    (root && (root as Record<string, unknown>)['users']) ||
    root;
  let arr: unknown[] = Array.isArray(direct)
    ? (direct as unknown[])
    : Array.isArray((direct as Record<string, unknown>)?.['items'])
      ? (((direct as Record<string, unknown>)['items'] as unknown[]) ?? [])
      : [];
  if (arr.length === 0) {
    arr =
      findFirstArrayDeep(root, ['items', 'following', 'users', 'list']) ?? [];
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
      const isFollowedByMe = true;
      return { username, name, avatarUrl, isFollowedByMe };
    });
  return { items };
}
