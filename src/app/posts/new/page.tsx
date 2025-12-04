"use client";
import HeaderSmart from "../../../components/organisms/HeaderSmart";
import ProfileTemplate from "../../../components/templates/ProfileTemplate";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { createPost } from "../../../lib/api/posts";
import Input from "../../../components/atoms/Input";
import { Button } from "../../../components/ui/button";
import { useRouter } from "next/navigation";

const schema = z.object({ image: z.custom<FileList>(), caption: z.string().optional() });
type FormValues = z.infer<typeof schema>;

export default function NewPostPage() {
  const token = useSelector((s: RootState) => s.auth.token) as string;
  const router = useRouter();
  const form = useForm<FormValues>({ resolver: zodResolver(schema) });
  const mut = useMutation({
    mutationFn: async (v: FormValues) => {
      const file = v.image?.[0] as File;
      return createPost(token, { image: file, caption: v.caption });
    },
    onSuccess: () => router.push("/"),
  });
  return (
    <main className="min-h-screen bg-neutral-950">
      <HeaderSmart />
      <ProfileTemplate>
        <form className="rounded-2xl bg-neutral-900 border border-neutral-800 p-3xl flex flex-col gap-xl" onSubmit={form.handleSubmit((v) => mut.mutate(v))}>
          <div className="flex flex-col gap-xs">
            <label className="text-neutral-25">Image</label>
            <input type="file" accept="image/png,image/jpeg,image/webp" {...form.register("image")} />
          </div>
          <div className="flex flex-col gap-xs">
            <label className="text-neutral-25">Caption</label>
            <Input placeholder="Write a caption" {...form.register("caption")} />
          </div>
          <Button type="submit">Upload</Button>
        </form>
      </ProfileTemplate>
    </main>
  );
}

