"use client";
import MenuItem from "../atoms/MenuItem";
import Fab from "../atoms/Fab";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { loadAuth } from "../../lib/authStorage";

export default function MenuBar() {
  const router = useRouter();
  const pathname = usePathname();
  const token = useSelector((s: RootState) => s.auth.token);
  const saved = typeof window !== "undefined" ? loadAuth() : undefined;

  const isLoggedIn = token || saved?.token;

  return (
    <div className="rounded-full bg-neutral-950 border border-neutral-800 w-[clamp(345px,25vw,360px)] h-[clamp(64px, 58px + 1.527vw, 80px)] px-5xl py-md flex items-center justify-between">
      <button onClick={() => router.push("/")}><MenuItem icon="solar:home-2-bold" label="Home" active={pathname === "/"} /></button>
      <Fab onClick={() => router.push(isLoggedIn ? '/posts/new' : '/login')} />
      <button onClick={() => router.push(isLoggedIn ? "/profile" : "/login")}><MenuItem icon="typcn:user" label="Profile" active={pathname === "/profile"} /></button>
    </div>
  );
}
