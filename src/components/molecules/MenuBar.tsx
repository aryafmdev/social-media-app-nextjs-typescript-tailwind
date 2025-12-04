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
    <div className="rounded-full bg-neutral-900 border border-neutral-800 w-[clamp(320px,90vw,360px)] md:w-[680px] px-5xl md:px-8xl py-xl md:py-2xl flex items-center justify-between">
      <button onClick={() => router.push("/")}><MenuItem icon="lucide:home" label="Home" active /></button>
      <Fab />
      <button onClick={() => router.push(token || saved?.token ? "/profile" : "/login")}><MenuItem icon="lucide:user" label="Profile" /></button>
    </div>
  );
}
