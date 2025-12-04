import type { Post } from './posts';

export async function getFeed(token: string, page = 1, limit = 20): Promise<{ items: Post[] }> {
  const res = await fetch(`/api/feed?page=${page}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to get feed');
  return (await res.json()) as { items: Post[] };
}

