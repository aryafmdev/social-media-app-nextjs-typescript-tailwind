export async function followUser(token: string, username: string): Promise<{ following: boolean }> {
  const res = await fetch(`/api/follow/${username}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error('Failed to follow');
  return { following: true };
}

export async function unfollowUser(token: string, username: string): Promise<{ following: boolean }> {
  const res = await fetch(`/api/follow/${username}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error('Failed to unfollow');
  return { following: false };
}

export async function getFollowers(username: string, page = 1, limit = 20, token?: string): Promise<{ items: { username: string; name?: string }[] }> {
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`/api/users/${username}/followers?page=${page}&limit=${limit}`, { headers, cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to get followers');
  return (await res.json()) as { items: { username: string; name?: string }[] };
}

export async function getFollowing(username: string, page = 1, limit = 20, token?: string): Promise<{ items: { username: string; name?: string }[] }> {
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`/api/users/${username}/following?page=${page}&limit=${limit}`, { headers, cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to get following');
  return (await res.json()) as { items: { username: string; name?: string }[] };
}

export async function getMyFollowers(token: string, page = 1, limit = 20): Promise<{ items: { username: string; name?: string }[] }> {
  const res = await fetch(`/api/me/followers?page=${page}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to get my followers');
  return (await res.json()) as { items: { username: string; name?: string }[] };
}

export async function getMyFollowing(token: string, page = 1, limit = 20): Promise<{ items: { username: string; name?: string }[] }> {
  const res = await fetch(`/api/me/following?page=${page}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to get my following');
  return (await res.json()) as { items: { username: string; name?: string }[] };
}
