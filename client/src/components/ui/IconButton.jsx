const VARIANTS = {
  ghost: "bg-surface-3/70 text-ink border border-border hover:bg-surface-3 hover:border-border-strong",
  solid:
    "bg-linear-to-br from-accent-soft to-accent-strong text-accent-ink shadow-accent hover:brightness-105",
  danger: "bg-danger-soft text-danger border border-danger/30 hover:bg-danger/15",
  subtle: "text-ink-muted hover:text-ink hover:bg-white/5",
};

const SIZES = {
  sm: "h-8 min-w-8 px-2 text-sm",
  md: "h-10 min-w-10 px-3 text-base",
  lg: "h-11 min-w-11 px-4 text-base",
};

export default function IconButton({
  children,
  variant = "ghost",
  size = "md",
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 ease-out active:scale-95 disabled:opacity-40 disabled:pointer-events-none ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
