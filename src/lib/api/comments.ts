export type Comment = { id: string; text: string; author: { username: string; name?: string }; createdAt?: string };

function pickString(x: unknown): string | undefined {
  return typeof x === 'string' ? x : undefined;
}

function normalizeComment(raw: Record<string, unknown>): Comment {
  const idRaw = raw['id'] ?? raw['commentId'] ?? raw['id_comment'] ?? raw['uuid'];
  const id = typeof idRaw === 'string' ? idRaw : String(idRaw ?? '');
  const textCandidate = raw['text'] ?? raw['comment'] ?? raw['content'] ?? raw['body'];
  const text = typeof textCandidate === 'string' ? textCandidate : '';
  const createdAtCandidate = raw['createdAt'] ?? raw['created_at'] ?? raw['timestamp'] ?? raw['time'];
  const createdAt = pickString(createdAtCandidate);
  const authorRoot = (raw['author'] ?? raw['user'] ?? raw['owner']) as unknown;
  const authorObj = authorRoot && typeof authorRoot === 'object' ? (authorRoot as Record<string, unknown>) : {};
  const username = pickString(authorObj['username']) ?? pickString(raw['username']) ?? '';
  const name = pickString(authorObj['name']) ?? pickString(raw['name']);
  return { id, text, author: { username, name }, createdAt };
}

export async function getComments(token: string | null, postId: string, page = 1, limit = 10): Promise<{ items: Comment[] }> {
  const res = await fetch(`/api/posts/${postId}/comments?page=${page}&limit=${limit}`, { cache: 'no-store', headers: token ? { Authorization: `Bearer ${token}` } : undefined });
  if (!res.ok) throw new Error('Failed to get comments');
  const json = (await res.json().catch(() => ({}))) as unknown;
  const root = (json && (json as Record<string, unknown>)['data']) || json;
  const itemsUnknown =
    (root && (root as Record<string, unknown>)['items']) ||
    (root && (root as Record<string, unknown>)['comments']) ||
    root;
  const arr: unknown[] = Array.isArray(itemsUnknown)
    ? itemsUnknown
    : Array.isArray((itemsUnknown as Record<string, unknown>)?.['items'])
      ? (((itemsUnknown as Record<string, unknown>)['items'] as unknown[]) ?? [])
      : [];
  const items: Comment[] = arr
    .filter((it) => it && typeof it === 'object')
    .map((it) => normalizeComment(it as Record<string, unknown>));
  return { items };
}

export async function addComment(token: string, postId: string, text: string): Promise<Comment> {
  const res = await fetch(`/api/posts/${postId}/comments`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ text }) });
  if (!res.ok) throw new Error('Failed to add comment');
  const raw = await res.json().catch(() => ({} as Record<string, unknown>));
  const root = (raw && (raw as Record<string, unknown>)['data']) || raw;
  const obj = root && typeof root === 'object' ? (root as Record<string, unknown>) : {};
  return normalizeComment(obj);
}

export async function deleteComment(token: string, commentId: string): Promise<{ ok: boolean }> {
  const res = await fetch(`/api/comments/${commentId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error('Failed to delete comment');
  return { ok: true };
}
