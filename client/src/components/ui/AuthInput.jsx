export default function AuthInput({ icon, className = "", ...props }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint">
        <i className={`fa-solid ${icon}`} />
      </span>
      <input
        {...props}
        className={`w-full rounded-xl border border-border bg-surface-3/50 py-2.5 pl-10 pr-3.5 text-sm text-ink placeholder:text-ink-faint outline-none transition-all duration-200 ease-out focus:border-accent/50 focus:bg-surface-3 focus:shadow-accent ${className}`}
      />
    </div>
  );
}
