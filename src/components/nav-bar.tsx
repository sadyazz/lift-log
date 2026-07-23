"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Dumbbell, ListChecks, History } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "home", icon: Home },
  { href: "/plans", label: "plans", icon: Dumbbell },
  { href: "/exercises", label: "exercises", icon: ListChecks },
  { href: "/history", label: "history", icon: History },
];

export function NavBar() {
  const pathname = usePathname();

  const activeIndex = NAV_ITEMS.findIndex(
    ({ href }) => pathname === href || (href !== "/" && pathname.startsWith(href))
  );

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex justify-center pb-[max(env(safe-area-inset-bottom),1rem)] pt-2">
      <div className="relative grid grid-cols-4 rounded-full border border-border bg-background/95 p-2 shadow-lg backdrop-blur">
        <div
          className="absolute inset-y-2 left-2 w-[calc((100%-1rem)/4)] rounded-full bg-primary transition-transform duration-300 ease-out"
          style={{ transform: `translateX(${Math.max(activeIndex, 0) * 100}%)` }}
        />
        {NAV_ITEMS.map(({ href, label, icon: Icon }, index) => {
          const isActive = index === activeIndex;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative z-10 flex flex-col items-center gap-0.5 rounded-full px-4 py-1.5 text-xs font-medium transition-colors duration-300",
                isActive
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="size-5" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
