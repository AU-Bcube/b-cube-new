interface TabButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function TabButton({ label, selected, onClick }: TabButtonProps) {
  return (
    <button
      className={`flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 md:px-7 md:py-3 md:text-base ${
        selected
          ? "bg-primary-light text-white shadow-lg shadow-primary-light/20"
          : "border border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:bg-white/[0.06] hover:text-white/90"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
