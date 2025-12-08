"use client";
import dynamic from "next/dynamic";
const HeaderSmart = dynamic(
  () => import("../../../components/organisms/HeaderSmart"),
  { ssr: false }
);
import ProfileTemplate from "../../../components/templates/ProfileTemplate";
import PostCard from "../../../components/organisms/PostCard";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPost, deletePost } from "../../../lib/api/posts";
import { getComments, addComment, deleteComment } from "../../../lib/api/comments";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import Input from "../../../components/atoms/Input";
import { Button } from "../../../components/ui/button";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const token = useSelector((s: RootState) => s.auth.token);
  const user = useSelector((s: RootState) => s.auth.user);
  const myUsername = (user?.username ?? "").trim();
  const qc = useQueryClient();
  const router = useRouter();
  const post = useQuery({ queryKey: ["post", id], queryFn: () => getPost(id as string), enabled: !!id });
  const comments = useQuery({ queryKey: ["post", id, "comments", 1, 10], queryFn: () => getComments(token ?? null, id as string, 1, 10), enabled: !!id });
  const add = useMutation({ mutationFn: async (text: string) => addComment(token as string, id as string, text), onSuccess: () => qc.invalidateQueries({ queryKey: ["post", id, "comments", 1, 10] }) });
  const del = useMutation({
    mutationFn: async (cid: string) => deleteComment(token as string, cid),
    onMutate: async (cid: string) => {
      qc.setQueryData<{ items: import("../../../lib/api/comments").Comment[] }>(
        ["post", id, "comments", 1, 10],
        (prev) => {
          const items = Array.isArray(prev?.items)
            ? prev!.items.filter((c) => c.id !== cid)
            : [];
          return { items };
        }
      );
      qc.setQueryData<import("../../../lib/api/posts").Post>(["post", id], (prev) => {
        if (!prev) return prev;
        const base = prev.commentsCount ?? 0;
        const next = base > 0 ? base - 1 : 0;
        return { ...prev, commentsCount: next };
      });
    },
    onError: () => {
      qc.invalidateQueries({ queryKey: ["post", id, "comments", 1, 10] });
      qc.invalidateQueries({ queryKey: ["post", id] });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["post", id, "comments", 1, 10] });
      qc.invalidateQueries({ queryKey: ["post", id] });
    },
  });
  const delPost = useMutation({
    mutationFn: async () => deletePost(token as string, id as string),
    onMutate: async () => {
      qc.setQueryData<import("../../../lib/api/posts").Post>(["post", id], (prev) => prev ? { ...prev } : prev);
    },
    onError: () => {
      qc.invalidateQueries({ queryKey: ["post", id] });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["post", id] });
      qc.invalidateQueries({ queryKey: ["feed"] });
      qc.invalidateQueries({ queryKey: ["me", "saved"] });
      router.replace("/");
    },
  });
  return (
    <main className="min-h-screen bg-neutral-950">
      <HeaderSmart />
      <ProfileTemplate>
        {post.data && <PostCard variant="md" post={post.data} />}
        {token && post.data?.author?.username === myUsername && (
          <div className="mt-xl flex justify-end">
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={() => {
                if (delPost.isPending) return;
                if (typeof window !== "undefined") {
                  const ok = window.confirm("Delete this post?");
                  if (!ok) return;
                }
                delPost.mutate();
              }}
            >
              Delete Post
            </Button>
          </div>
        )}
        <div className="mt-2xl rounded-2xl bg-neutral-900 border border-neutral-800 p-3xl">
          <h3 className="text-neutral-25 font-semibold">Comments</h3>
          <div className="mt-xl flex flex-col gap-md">
            {comments.data?.items?.map((c) => (
              <div key={c.id} className="flex items-center justify-between">
                <div>
                  <span className="text-neutral-25 font-medium">{c.author.username}</span>
                  <p className="text-neutral-300">{c.text}</p>
                </div>
                {token && (c.author.username === myUsername || post.data?.author?.username === myUsername) && (
                  <Button variant="destructive" className="cursor-pointer" size="sm" onClick={() => del.mutate(c.id)}>
                    Delete
                  </Button>
                )}
              </div>
            ))}
          </div>
          {token && (
            <form
              className="mt-xl flex items-center gap-md"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const text = String(fd.get("text") || "");
                if (text) add.mutate(text);
                (e.currentTarget as HTMLFormElement).reset();
              }}
            >
              <Input name="text" placeholder="Add a comment" />
              <Button type="submit">Send</Button>
            </form>
          )}
        </div>
      </ProfileTemplate>
    </main>
  );
}
