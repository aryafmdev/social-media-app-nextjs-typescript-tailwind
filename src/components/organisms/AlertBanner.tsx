type Props = {
  label: string;
  variant: "success" | "danger";
  onClose?: () => void;
};

export default function AlertBanner({ label, variant, onClose }: Props) {
  const bg = variant === "success" ? "bg-[#079455]" : "bg-[#B41759]";
  return (
    <div className="border border-dashed border-primary-300 rounded-[5px] p-[16px] w-[323px]">
      <div className={`flex items-center justify-center gap-[8px] px-[12px] py-[8px] w-[291px] h-[40px] ${bg} rounded-[8px] relative`}>
        <span className="font-semibold text-sm tracking-[-0.02em] text-white flex-1">{label}</span>
        <button
          aria-label="close"
          className="w-4 h-4 text-white"
          onClick={onClose}
        >
          ×
        </button>
      </div>
    </div>
  );
}

