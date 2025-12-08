"use client";
import dynamic from "next/dynamic";
const HeaderNoSSR = dynamic(
  () => import("../../../components/organisms/Header"),
  { ssr: false }
);
import ProfileTemplate from "../../../components/templates/ProfileTemplate";
const AddPostFormNoSSR = dynamic(
  () => import("../../../components/molecules/AddPostForm"),
  { ssr: false }
);
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadAuth } from "../../../lib/authStorage";

export default function NewPostPage() {
  const token = useSelector((s: RootState) => s.auth.token);
  const router = useRouter();
  useEffect(() => {
    const saved = loadAuth();
    if (!token && !saved?.token) router.replace('/login');
  }, [token, router]);
  return (
    <main className="min-h-screen bg-neutral-950">
      <HeaderNoSSR variant='mobile-edit-profile' title='Add Post' />
      <ProfileTemplate>
        <AddPostFormNoSSR />
      </ProfileTemplate>
    </main>
  );
}
