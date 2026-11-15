interface TabButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  size?: "md" | "sm";
}

const SIZE_CLASSES = {
  md: "rounded-2xl px-5 py-2.5 text-sm md:px-7 md:py-3 md:text-base",
  sm: "min-w-23 rounded-[11px] px-4.5 py-2.25 text-[11px] leading-[17px]",
};

export default function TabButton({
  label,
  selected,
  onClick,
  size = "md",
}: TabButtonProps) {
  return (
    <button
      data-no-grid
      className={`flex items-center justify-center border font-semibold backdrop-blur-sm transition-all duration-300 ${SIZE_CLASSES[size]} ${
        selected
          ? "border-primary-light/30 bg-[rgba(81,140,255,0.08)] text-primary-light shadow-[0_0_16px_rgba(81,140,255,0.08)]"
          : "border-white/6 bg-white/3 text-white/50 hover:border-primary-light/20 hover:bg-white/6 hover:text-white/80"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
