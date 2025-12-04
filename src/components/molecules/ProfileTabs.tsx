import { Icon } from "@iconify/react";

export type ProfileTab = "gallery" | "saved";

export default function ProfileTabs({ active, onChange }: { active: ProfileTab; onChange: (t: ProfileTab) => void }) {
  return (
    <div className="mt-2xl">
      <div className="flex items-center gap-3xl text-neutral-25">
        <button onClick={() => onChange("gallery")} className={`flex items-center gap-sm ${active === "gallery" ? "font-semibold" : "text-neutral-400"}`}>
          <Icon icon="lucide:layout-grid" />
          <span>Gallery</span>
        </button>
        <button onClick={() => onChange("saved")} className={`flex items-center gap-sm ${active === "saved" ? "font-semibold" : "text-neutral-400"}`}>
          <Icon icon="lucide:bookmark" />
          <span>Saved</span>
        </button>
      </div>
      <div className="mt-sm h-px bg-neutral-800" />
      <div className={`h-1 bg-neutral-25 w-24 ${active === "saved" ? "ml-32" : "ml-0"}`} />
    </div>
  );
}

