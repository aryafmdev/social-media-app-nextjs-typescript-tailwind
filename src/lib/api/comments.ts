export type Comment = { id: string; text: string; author: { username: string; name?: string }; createdAt?: string };

export async function getComments(postId: string, page = 1, limit = 10): Promise<{ items: Comment[] }> {
  const res = await fetch(`/api/posts/${postId}/comments?page=${page}&limit=${limit}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to get comments');
  return (await res.json()) as { items: Comment[] };
}

export async function addComment(token: string, postId: string, text: string): Promise<Comment> {
  const res = await fetch(`/api/posts/${postId}/comments`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ text }) });
  if (!res.ok) throw new Error('Failed to add comment');
  return (await res.json()) as Comment;
}

export async function deleteComment(token: string, commentId: string): Promise<{ ok: boolean }> {
  const res = await fetch(`/api/comments/${commentId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error('Failed to delete comment');
  return { ok: true };
}

