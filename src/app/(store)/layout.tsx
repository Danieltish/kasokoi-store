import type { ReactNode } from "react";

import { CartProvider } from "@/components/cart-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppFloat } from "@/components/whatsapp-float";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <SiteHeader />
      <main className="flex-1 pb-16 sm:pb-0">{children}</main>
      <SiteFooter />
      <WhatsAppFloat />
    </CartProvider>
  );
}
