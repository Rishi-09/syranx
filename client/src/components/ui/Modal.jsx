"use client";

export default function Modal({ open, onClose, children, className = "" }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-200 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`glass-panel w-full max-w-sm rounded-2xl p-6 shadow-lg animate-scale-in ${className}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
}
