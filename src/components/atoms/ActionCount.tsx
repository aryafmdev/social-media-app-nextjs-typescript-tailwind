import { Icon } from "@iconify/react";

export default function ActionCount({ icon, count }: { icon: string; count: number }) {
  return (
    <div className="flex items-center gap-sm text-neutral-25">
      <Icon icon={icon} />
      <span>{count}</span>
    </div>
  );
}

