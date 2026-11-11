"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { UserIcon } from "./icons";

type SessionUser = {
  name: string;
  email: string;
  role: string;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function UserMenu() {
  const [user, setUser] = useState<SessionUser | null | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    let active = true;

    fetch("/api/auth/me", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { user: SessionUser | null }) => {
        if (active) {
          setUser(data.user);
        }
      })
      .catch(() => {
        if (active) {
          setUser(null);
        }
      });

    return () => {
      active = false;
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (user === undefined) {
    return (
      <span
        aria-hidden="true"
        className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground sm:size-10"
      >
        <UserIcon className="size-5" />
      </span>
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        aria-label="Sign in"
        className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:size-auto sm:gap-2 sm:px-3"
      >
        <UserIcon className="size-5" />
        <span className="hidden text-sm font-medium sm:inline">Sign in</span>
      </Link>
    );
  }

  const isAdmin = user.role === "ADMIN" || user.role === "STAFF";

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label="Account menu"
        aria-expanded={open}
        aria-controls="user-menu"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-9 items-center justify-center rounded-lg text-sm font-semibold text-foreground transition-colors hover:bg-muted sm:size-10"
      >
        {initials(user.name)}
      </button>

      {open ? (
        <div
          id="user-menu"
          className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-card shadow-lg"
        >
          <div className="border-b border-border px-4 py-3">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>

          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm hover:bg-muted"
          >
            My account
          </Link>

          {isAdmin ? (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm font-medium text-primary hover:bg-muted"
            >
              Admin dashboard
            </Link>
          ) : null}

          <form action="/api/auth/logout" method="post">
            <button
              type="submit"
              className="w-full border-t border-border px-4 py-2.5 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Sign out
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
