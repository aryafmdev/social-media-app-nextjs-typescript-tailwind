import { Icon } from "@iconify/react";

type Props = {
  icon: string;
  label: string;
  active?: boolean;
};

export default function MenuItem({ icon, label, active }: Props) {
  return (
    <div className="flex items-center gap-md">
      <div className={`w-8 h-8 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${active ? "bg-primary-200 text-neutral-25" : "bg-neutral-900 text-neutral-25"}`}>
        <Icon icon={icon} className="md:text-2xl" />
      </div>
      <span className={`font-semibold ${active ? "text-primary-200" : "text-neutral-25"} text-sm md:text-display-xs`}>{label}</span>
    </div>
  );
}

