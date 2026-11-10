"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const baseItems = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/zones", label: "Delivery zones" },
  { href: "/admin/account", label: "Account" },
];

export function AdminNav({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const pathname = usePathname();
  const items = isSuperAdmin
    ? [...baseItems, { href: "/admin/admins", label: "Admins" }]
    : baseItems;

  return (
    <nav className="no-scrollbar flex gap-1 overflow-x-auto md:block md:space-y-1 md:overflow-visible">
      {items.map((item) => {
        const active =
          "exact" in item && item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`block whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium ${
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
