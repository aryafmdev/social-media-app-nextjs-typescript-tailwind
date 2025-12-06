import { Icon } from "@iconify/react";

export default function Fab({ onClick }: { onClick?: () => void }) {
  return (
    <div
      className="size-11 md:size-12 rounded-full bg-primary-300 text-neutral-25 flex items-center justify-center cursor-pointer"
      onClick={onClick}
      role="button"
      aria-label="Add Post"
    >
      <Icon icon="lucide:plus" className="text-2xl" />
    </div>
  );
}
