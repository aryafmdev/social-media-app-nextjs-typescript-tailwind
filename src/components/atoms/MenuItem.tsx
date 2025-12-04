import { Icon } from "@iconify/react";

type Props = {
  icon: string;
  label: string;
  active?: boolean;
};

export default function MenuItem({ icon, label, active }: Props) {
  return (
    <div className="flex flex-col items-center">
      <div className={` rounded-xl flex items-center justify-center ${active ? "text-primary-200 " : "bg-neutral-900 text-neutral-25"}`}>
        <Icon icon={icon} className="text-2xl md:text-3xl cursor-pointer" />
      </div>
      <span className={`cursor-pointer ${active ? "text-primary-200 font-bold" : "text-neutral-25 font-regular"} text-xs md:text-md`}>{label}</span>
    </div>
  );
}

