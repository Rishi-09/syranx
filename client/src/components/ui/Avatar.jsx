const SIZES = {
  sm: "h-7 w-7 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-12 w-12 text-base",
};

export default function Avatar({ kind = "ai", name = "", size = "md", className = "" }) {
  if (kind === "user") {
    return (
      <div
        className={`flex items-center justify-center rounded-full font-semibold text-accent-ink bg-linear-to-br from-accent-soft to-accent-strong shrink-0 ${SIZES[size]} ${className}`}
      >
        {name?.trim()?.charAt(0)?.toUpperCase() || (
          <i className="fa-solid fa-user text-[0.75em]" />
        )}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-surface-3 border border-border text-accent shrink-0 ${SIZES[size]} ${className}`}
    >
      <i className="fa-solid fa-robot text-[0.8em]" />
    </div>
  );
}
