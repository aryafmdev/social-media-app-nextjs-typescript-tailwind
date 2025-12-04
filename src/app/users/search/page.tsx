"use client";
import HeaderSmart from "../../../components/organisms/HeaderSmart";
import ProfileTemplate from "../../../components/templates/ProfileTemplate";
import Input from "../../../components/atoms/Input";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchUsers } from "../../../lib/api/users";

export default function UsersSearchPage() {
  const [q, setQ] = useState("");
  const res = useQuery({ queryKey: ["users", "search", q, 1, 20], queryFn: () => searchUsers(q, 1, 20), enabled: q.length > 0 });
  return (
    <main className="min-h-screen bg-neutral-950">
      <HeaderSmart />
      <ProfileTemplate>
        <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-3xl">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users" />
        </div>
        <div className="mt-2xl flex flex-col gap-md">
          {res.data?.items?.map((u) => (
            <a key={u.username} href={`/users/${u.username}`} className="rounded-xl bg-neutral-900 border border-neutral-800 p-xl flex items-center gap-md">
              <span className="text-neutral-25 font-semibold">{u.name ?? u.username}</span>
            </a>
          ))}
        </div>
      </ProfileTemplate>
    </main>
  );
}

