export default function TypingIndicator() {
  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-2xl border border-border bg-surface-2 px-4 py-3"
      role="status"
      aria-label="Syranx is thinking"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-accent"
          style={{ animation: "dot-bounce 1.2s ease-in-out infinite", animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}
