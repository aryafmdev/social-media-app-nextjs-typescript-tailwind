export type Me = {
  name: string;
  username: string;
  email?: string;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
  stats?: { post: number; followers: number; following: number; likes: number };
};

export type UpdateMeInput = {
  name?: string;
  username?: string;
  phone?: string;
  bio?: string;
  avatar?: File | null;
  avatarUrl?: string;
};

function pickFirstString(
  obj: Record<string, unknown> | undefined,
  keys: string[],
  fallback?: string
): string | undefined {
  if (!obj) return fallback;
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === 'string' && v.trim().length > 0) return v;
  }
  return fallback;
}

function toNumber(x: unknown, fallback = 0): number {
  if (typeof x === 'number' && Number.isFinite(x)) return x;
  if (typeof x === 'string') {
    const n = Number(x);
    if (!Number.isNaN(n)) return n;
  }
  return fallback;
}

function parseMe(raw: Record<string, unknown>): Me {
  const data =
    typeof raw.data === 'object' && raw.data !== null
      ? (raw.data as Record<string, unknown>)
      : raw;
  const user =
    typeof data.user === 'object' && data.user !== null
      ? (data.user as Record<string, unknown>)
      : data;

  const name = pickFirstString(user, [
    'name',
    'fullName',
    'full_name',
    'displayName',
    'display_name',
    'nama',
  ]);
  const username = pickFirstString(user, ['username', 'user_name', 'handle']);
  const email = pickFirstString(user, ['email']);
  const phone = pickFirstString(user, [
    'phone',
    'phoneNumber',
    'phone_number',
    'no_hp',
  ]);
  const bio = pickFirstString(user, ['bio', 'about', 'description']);
  const avatarUrl = pickFirstString(user, [
    'avatarUrl',
    'avatar_url',
    'avatar',
    'profile_image_url',
    'image',
    'photo',
    'profilePicture',
  ]);

  const statsSrc =
    typeof user.stats === 'object' && user.stats !== null
      ? (user.stats as Record<string, unknown>)
      : typeof data.stats === 'object' && data.stats !== null
        ? (data.stats as Record<string, unknown>)
        : undefined;

  const stats = statsSrc
    ? {
        post: toNumber(statsSrc.post ?? statsSrc.posts),
        followers: toNumber(statsSrc.followers),
        following: toNumber(statsSrc.following),
        likes: toNumber(statsSrc.likes),
      }
    : undefined;

  return {
    name: name ?? '',
    username: username ?? '',
    email,
    phone,
    bio,
    avatarUrl,
    stats,
  };
}

export async function getMe(token: string): Promise<Me> {
  const res = await fetch(`/api/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch me');
  const raw = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  return parseMe(raw);
}

export async function patchMe(
  token: string,
  input: UpdateMeInput
): Promise<Me> {
  if (input.avatar) {
    const fd = new FormData();
    if (input.name) fd.append('name', input.name);
    if (input.username) fd.append('username', input.username);
    if (input.phone) fd.append('phone', input.phone);
    if (input.bio) fd.append('bio', input.bio);
    fd.append('avatar', input.avatar);
    const res = await fetch(`/api/me`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  }
  const res = await fetch(`/api/me`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      name: input.name,
      username: input.username,
      phone: input.phone,
      bio: input.bio,
      avatarUrl: input.avatarUrl,
    }),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
}

export type MyPost = { id: string; imageUrl?: string; createdAt?: string };

export async function getMyPosts(
  token: string,
  page = 1,
  limit = 20
): Promise<{ items: MyPost[]; page: number; total: number }> {
  const res = await fetch(`/api/me/posts?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch my posts');
  return res.json();
}
