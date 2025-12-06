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

// removed: pickFirstString (unused)

function findFirstStringDeep(src: unknown, keys: string[]): string | undefined {
  if (!src || typeof src !== 'object') return undefined;
  const stack: Record<string, unknown>[] = [src as Record<string, unknown>];
  const seen = new Set<object>();
  while (stack.length) {
    const cur = stack.pop()!;
    if (seen.has(cur)) continue;
    seen.add(cur);
    for (const k of keys) {
      const v = cur[k];
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
      const v = cur[k];
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

// removed: toNumber (unused)

function parseMe(raw: Record<string, unknown>): Me {
  const root =
    typeof raw.data === 'object' && raw.data !== null
      ? (raw.data as Record<string, unknown>)
      : raw;

  const name =
    findFirstStringDeep(root, [
      'name',
      'fullName',
      'full_name',
      'displayName',
      'display_name',
      'nama',
      'nama_lengkap',
    ]) ?? '';
  const username =
    findFirstStringDeep(root, ['username', 'user_name', 'handle']) ?? '';
  const email = findFirstStringDeep(root, ['email']);
  const phone = findFirstStringDeep(root, [
    'phone',
    'phoneNumber',
    'phone_number',
    'no_hp',
    'tel',
  ]);
  const bio = findFirstStringDeep(root, ['bio', 'about', 'description']);
  const avatarUrl = findFirstStringDeep(root, [
    'avatarUrl',
    'avatar_url',
    'avatar',
    'profile_image_url',
    'image',
    'photo',
    'profilePicture',
    'profile_picture',
  ]);

  const stats: Me['stats'] | undefined = (() => {
    const post = findFirstNumberDeep(root, ['post', 'posts']);
    const followers = findFirstNumberDeep(root, ['followers']);
    const following = findFirstNumberDeep(root, ['following']);
    const likes = findFirstNumberDeep(root, ['likes']);
    if (post || followers || following || likes)
      return { post, followers, following, likes };
    return undefined;
  })();

  return { name, username, email, phone, bio, avatarUrl, stats };
}

export async function getMe(token: string): Promise<Me> {
  try {
    const res = await fetch(`/api/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch me');
    const raw = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    return parseMe(raw);
  } catch {
    if (typeof window !== 'undefined') {
      const saved = loadAuth();
      const u = saved?.user;
      return {
        name: u?.name ?? '',
        username: u?.username ?? '',
        email: u?.email,
        phone: u?.phone,
        bio: '',
        avatarUrl: undefined,
        stats: undefined,
      };
    }
    return {
      name: '',
      username: '',
      email: undefined,
      phone: undefined,
      bio: '',
      avatarUrl: undefined,
      stats: undefined,
    };
  }
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
    const raw = await res.json().catch(() => ({}) as Record<string, unknown>);
    return parseMe(raw as Record<string, unknown>);
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
  const raw = await res.json().catch(() => ({}) as Record<string, unknown>);
  return parseMe(raw as Record<string, unknown>);
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
import { loadAuth } from '../authStorage';
