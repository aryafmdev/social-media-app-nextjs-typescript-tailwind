export type Post = {
  id: string;
  imageUrl?: string;
  caption?: string;
  liked?: boolean;
  saved?: boolean;
  likesCount?: number;
  commentsCount?: number;
  author?: { username: string; name?: string; avatarUrl?: string };
  createdAt?: string;
};
export type PostDetail = Post;

export async function createPost(
  token: string,
  input: { image: File; caption?: string }
): Promise<Post> {
  const form = new FormData();
  form.append('image', input.image);
  if (input.caption) form.append('caption', input.caption);
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!res.ok) throw new Error('Failed to create post');
  return (await res.json()) as Post;
}

export async function getPost(id: string): Promise<PostDetail> {
  const res = await fetch(`/api/posts/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to get post');
  return (await res.json()) as PostDetail;
}

export async function deletePost(
  token: string,
  id: string
): Promise<{ ok: boolean }> {
  const res = await fetch(`/api/posts/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete post');
  return { ok: true };
}
