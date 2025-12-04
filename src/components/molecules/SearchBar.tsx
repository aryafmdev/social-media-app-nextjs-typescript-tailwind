export default function SearchBar({ placeholder = "Search" }: { placeholder?: string }) {
  return (
    <div className="flex items-center gap-[16px] px-[16px] w-full h-[64px] bg-black">
      <span className="text-neutral-400">🔍</span>
      <input
        className="flex-1 rounded-full bg-neutral-900 text-neutral-25 placeholder:text-neutral-500 px-md py-sm outline-none"
        placeholder={placeholder}
      />
    </div>
  );
}

