import { SITE, whatsappUrl } from "@/lib/site";

import { WhatsAppIcon } from "./icons";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappUrl(`Hi ${SITE.name}, I would like to place an order.`)}
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-4 right-4 z-50 inline-flex size-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lg transition-transform hover:scale-105 sm:bottom-6 sm:right-6"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
