"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/reports", label: "Report Management" },
    { href: "/admin/suggestions", label: "Suggestions" },
    { href: "/admin/news", label: "News" },
    { href: "/admin/clubs", label: "Club Sections" },
    { href: "/admin/teachers", label: "Teachers" },
    { href: "/admin/users", label: "User Roles" },
  ];

  return (
    <nav className="bg-navy-700">
      <div className="container mx-auto px-4 flex items-center gap-6 text-sm font-medium">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`py-3 border-b-2 transition-colors ${
                isActive
                  ? "border-white text-white"
                  : "border-transparent text-white/70 hover:border-white/50 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

