"use client";
import dynamic from "next/dynamic";
const HeaderSmart = dynamic(
  () => import("../../../components/organisms/HeaderSmart"),
  { ssr: false }
);
import ProfileTemplate from "../../../components/templates/ProfileTemplate";
import PostCard from "../../../components/organisms/PostCard";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPost } from "../../../lib/api/posts";
import { getComments, addComment, deleteComment } from "../../../lib/api/comments";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import Input from "../../../components/atoms/Input";
import { Button } from "../../../components/ui/button";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const token = useSelector((s: RootState) => s.auth.token);
  const qc = useQueryClient();
  const post = useQuery({ queryKey: ["post", id], queryFn: () => getPost(id as string), enabled: !!id });
  const comments = useQuery({ queryKey: ["post", id, "comments", 1, 10], queryFn: () => getComments(id as string, 1, 10), enabled: !!id });
  const add = useMutation({ mutationFn: async (text: string) => addComment(token as string, id as string, text), onSuccess: () => qc.invalidateQueries({ queryKey: ["post", id, "comments", 1, 10] }) });
  const del = useMutation({ mutationFn: async (cid: string) => deleteComment(token as string, cid), onSuccess: () => qc.invalidateQueries({ queryKey: ["post", id, "comments", 1, 10] }) });
  return (
    <main className="min-h-screen bg-neutral-950">
      <HeaderSmart />
      <ProfileTemplate>
        {post.data && <PostCard variant="md" post={post.data} />}
        <div className="mt-2xl rounded-2xl bg-neutral-900 border border-neutral-800 p-3xl">
          <h3 className="text-neutral-25 font-semibold">Comments</h3>
          <div className="mt-xl flex flex-col gap-md">
            {comments.data?.items?.map((c) => (
              <div key={c.id} className="flex items-center justify-between">
                <div>
                  <span className="text-neutral-25 font-medium">{c.author.username}</span>
                  <p className="text-neutral-300">{c.text}</p>
                </div>
                {token && <Button onClick={() => del.mutate(c.id)}>Delete</Button>}
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
