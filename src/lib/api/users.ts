export type UserPublic = {
  username: string;
  name?: string;
  avatarUrl?: string;
  bio?: string;
};
export type UserSummary = {
  username: string;
  name?: string;
  avatarUrl?: string;
};
export type PublicPost = { id: string; imageUrl?: string; caption?: string };

export async function getUser(username: string): Promise<UserPublic> {
  const res = await fetch(`/api/users/${username}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch user');
  return (await res.json()) as UserPublic;
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
  return (await res.json()) as { items: PublicPost[] };
}

export async function getUserLikes(
  username: string,
  page = 1,
  limit = 20
): Promise<{ items: PublicPost[] }> {
  const res = await fetch(
    `/api/users/${username}/likes?page=${page}&limit=${limit}`,
    { cache: 'no-store' }
  );
  if (!res.ok) throw new Error('Failed to fetch likes');
  return (await res.json()) as { items: PublicPost[] };
}

export async function searchUsers(
  q: string,
  page = 1,
  limit = 20
): Promise<{ items: UserSummary[] }> {
  const res = await fetch(
    `/api/users/search?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`,
    { cache: 'no-store' }
  );
  if (!res.ok) throw new Error('Failed to search users');
  return (await res.json()) as { items: UserSummary[] };
}
