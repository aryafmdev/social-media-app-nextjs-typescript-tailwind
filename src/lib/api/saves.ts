import type { Post } from './posts';

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
  return (await res.json()) as { items: Post[] };
}

