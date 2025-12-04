export type Me = {
  name: string;
  username: string;
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

export async function getMe(token: string): Promise<Me> {
  const res = await fetch(`/api/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch me");
  return res.json();
}

export async function patchMe(token: string, input: UpdateMeInput): Promise<Me> {
  if (input.avatar) {
    const fd = new FormData();
    if (input.name) fd.append("name", input.name);
    if (input.username) fd.append("username", input.username);
    if (input.phone) fd.append("phone", input.phone);
    if (input.bio) fd.append("bio", input.bio);
    fd.append("avatar", input.avatar);
    const res = await fetch(`/api/me`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    if (!res.ok) throw new Error("Failed to update profile");
    return res.json();
  }
  const res = await fetch(`/api/me`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({
      name: input.name,
      username: input.username,
      phone: input.phone,
      bio: input.bio,
      avatarUrl: input.avatarUrl,
    }),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
}

export type MyPost = { id: string; imageUrl?: string; createdAt?: string };

export async function getMyPosts(token: string, page = 1, limit = 20): Promise<{ items: MyPost[]; page: number; total: number }>
{
  const res = await fetch(`/api/me/posts?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch my posts");
  return res.json();
}

