import { SITE, whatsappUrl } from "@/lib/site";

const highlights = [
  {
    title: "100% genuine products",
    body: "Every device is sourced from trusted suppliers and checked before delivery.",
  },
  {
    title: "Nairobi & nationwide",
    body: "Same-day delivery in Nairobi where possible, courier to all counties.",
  },
  {
    title: "Order on WhatsApp",
    body: "Build your cart and send us the order in one tap. We confirm and deliver.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <span className="text-lg font-semibold tracking-tight text-primary">
            {SITE.name}
          </span>
          <a
            href={whatsappUrl(`Hi ${SITE.name}, I have a question.`)}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Chat on WhatsApp
          </a>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-accent-100 px-3 py-1 text-xs font-medium text-accent-700">
              Now delivering across Kenya
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
              {SITE.tagline}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Phones, TVs, laptops, audio and accessories — at honest prices in
              Kenyan Shillings. Order online or send your cart straight to our
              WhatsApp.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={whatsappUrl(
                  `Hi ${SITE.name}, I would like to place an order.`,
                )}
                className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Order on WhatsApp
              </a>
              <a
                href="#how-it-works"
                className="rounded-lg border border-border px-5 py-3 text-sm font-semibold hover:bg-muted"
              >
                How it works
              </a>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="border-t border-border bg-muted/60"
        >
          <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-14 sm:grid-cols-3 sm:px-6">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-border bg-card p-6"
              >
                <h2 className="font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <h2 className="text-2xl font-semibold">Catalog coming soon</h2>
            <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
              We are stocking the shelves. In the meantime, tell us what you are
              looking for on WhatsApp and we will source it for you.
            </p>
            <a
              href={whatsappUrl(
                `Hi ${SITE.name}, I am looking for the following product: `,
              )}
              className="mt-6 inline-block rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
            >
              Ask about a product
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>&copy; {SITE.name}. All rights reserved.</span>
          <a href={whatsappUrl()} className="hover:text-foreground">
            {SITE.whatsappDisplay}
          </a>
        </div>
      </footer>
    </div>
  );
}
