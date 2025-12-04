import { Icon } from "@iconify/react";

export default function Fab() {
  return (
    <div className="size-11 md:size-12 rounded-full bg-primary-200 text-neutral-25 flex items-center justify-center cursor-pointer">
      <Icon icon="lucide:plus" className="text-2xl" />
    </div>
  );
}

