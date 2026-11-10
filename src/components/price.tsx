import { formatKes } from "@/lib/site";

export function Price({
  amountKes,
  compareAtKes,
  size = "md",
}: {
  amountKes: number;
  compareAtKes?: number | null;
  size?: "md" | "lg";
}) {
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2">
      <span
        className={
          size === "lg"
            ? "text-2xl font-semibold"
            : "text-base font-semibold"
        }
      >
        {formatKes(amountKes)}
      </span>
      {compareAtKes && compareAtKes > amountKes ? (
        <span className="text-sm text-muted-foreground line-through">
          {formatKes(compareAtKes)}
        </span>
      ) : null}
    </span>
  );
}
