import { Icon } from "@iconify/react";

export default function Fab() {
  return (
    <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-primary-200 text-neutral-25 flex items-center justify-center">
      <Icon icon="lucide:plus" className="text-2xl md:text-4xl" />
    </div>
  );
}

