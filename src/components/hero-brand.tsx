import { LogoMark } from "./logo";

const chips = [
  {
    label: "Tech & appliances",
    dot: "bg-primary",
    position: "left-0 top-8",
  },
  {
    label: "Farm & livestock",
    dot: "bg-accent",
    position: "right-0 top-1/3",
  },
  {
    label: "WhatsApp orders",
    dot: "bg-whatsapp",
    position: "bottom-4 left-8",
  },
];

export function HeroBrand() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto hidden h-80 w-full max-w-md items-center justify-center lg:flex"
    >
      <div className="absolute size-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute size-64 rounded-full border border-primary/15" />
      <div className="absolute size-48 rounded-full border border-primary/20" />

      <div className="relative flex size-40 items-center justify-center rounded-[2rem] border border-border bg-card shadow-xl shadow-primary/10">
        <LogoMark className="size-24" />
      </div>

      {chips.map((chip) => (
        <span
          key={chip.label}
          className={`absolute ${chip.position} inline-flex items-center gap-2 rounded-full border border-border bg-card/90 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur`}
        >
          <span className={`size-2 rounded-full ${chip.dot}`} />
          {chip.label}
        </span>
      ))}
    </div>
  );
}
