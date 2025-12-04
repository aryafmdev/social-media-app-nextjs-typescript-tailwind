import type { Post } from './posts';

export async function likePost(token: string, id: string): Promise<{ liked: boolean }> {
  const res = await fetch(`/api/posts/${id}/like`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error('Failed to like');
  return { liked: true };
}

export async function unlikePost(token: string, id: string): Promise<{ liked: boolean }> {
  const res = await fetch(`/api/posts/${id}/like`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error('Failed to unlike');
  return { liked: false };
}

export async function getPostLikes(id: string, page = 1, limit = 20, token?: string): Promise<{ items: { username: string; name?: string; isMe?: boolean; isFollowedByMe?: boolean; followsMe?: boolean }[] }> {
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`/api/posts/${id}/likes?page=${page}&limit=${limit}`, { headers, cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to get likes');
  return (await res.json()) as { items: { username: string; name?: string; isMe?: boolean; isFollowedByMe?: boolean; followsMe?: boolean }[] };
}

export async function getMyLiked(token: string, page = 1, limit = 20): Promise<{ items: Post[] }> {
  const res = await fetch(`/api/me/likes?page=${page}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to get my liked posts');
  return (await res.json()) as { items: Post[] };
}

