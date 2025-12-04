"use client";
import MenuItem from "../atoms/MenuItem";
import Fab from "../atoms/Fab";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { loadAuth } from "../../lib/authStorage";

export default function MenuBar() {
  const router = useRouter();
  const token = useSelector((s: RootState) => s.auth.token);
  const saved = typeof window !== "undefined" ? loadAuth() : undefined;
  return (
    <div className="rounded-full bg-neutral-900 border border-neutral-800 w-[clamp(345px,25vw,360px)] h-[clamp(64px, 58px + 1.527vw, 80px)] px-5xl py-md flex items-center justify-between">
      <button onClick={() => router.push("/")}><MenuItem icon="solar:home-2-bold" label="Home" active /></button>
      <Fab />
      <button onClick={() => router.push(token || saved?.token ? "/profile" : "/login")}><MenuItem icon="typcn:user" label="Profile" /></button>
    </div>
  );
}
