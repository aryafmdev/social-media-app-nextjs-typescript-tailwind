"use client";
import HeaderSmart from "../../../../components/organisms/HeaderSmart";
import ProfileTemplate from "../../../../components/templates/ProfileTemplate";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getFollowers } from "../../../../lib/api/follow";

export default function FollowersPage() {
  const { username } = useParams<{ username: string }>();
  const res = useQuery({ queryKey: ["followers", username, 1, 20], queryFn: () => getFollowers(username as string, 1, 20), enabled: !!username });
  return (
    <main className="min-h-screen bg-neutral-950">
      <HeaderSmart />
      <ProfileTemplate>
        <div className="flex flex-col gap-md">
          {res.data?.items?.map((u) => (
            <a key={u.username} href={`/users/${u.username}`} className="rounded-xl bg-neutral-900 border border-neutral-800 p-xl">
              <span className="text-neutral-25 font-semibold">{u.name ?? u.username}</span>
            </a>
          ))}
        </div>
      </ProfileTemplate>
    </main>
  );
}

