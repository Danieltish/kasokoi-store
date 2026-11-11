export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect x="2" y="2" width="36" height="36" rx="11" fill="#2563eb" />
      <path
        d="M13 11.5v17M13 20l9-8.5M13 20l9 8.5"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="29.5" cy="11.5" r="3" fill="#fbbf24" />
    </svg>
  );
}

export function Logo({
  className = "",
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark className="size-7 shrink-0 sm:size-9" />
      {showWordmark ? (
        <span className="text-sm font-semibold tracking-tight sm:text-lg">
          <span className="text-foreground">Kasokoi</span>{" "}
          <span className="text-primary">Store</span>
        </span>
      ) : null}
    </span>
  );
}
