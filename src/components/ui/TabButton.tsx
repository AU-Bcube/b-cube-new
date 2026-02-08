interface TabButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function TabButton({ label, selected, onClick }: TabButtonProps) {
  return (
    <button
      className={`flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-200 md:px-6 md:py-3 md:text-base ${
        selected
          ? "bg-on-surface text-surface"
          : "border border-border bg-surface-light text-muted hover:border-on-surface-dim/30 hover:text-on-surface-dim"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
