import { NavLink, Link } from "react-router-dom";
import { ApiBadge } from "./ApiBadge";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/cn";

const NAV = [
  { to: "/cities", label: "Cities" },
  { to: "/events", label: "Events" },
  { to: "/organizations", label: "Organizations" },
  { to: "/venues", label: "Venues" },
  { to: "/categories", label: "Categories" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span aria-hidden>📅</span>
          <span>terminschleuder</span>
          <span className="text-xs font-normal text-slate-400">demo</span>
        </Link>

        <nav className="ml-2 flex flex-wrap items-center gap-1 text-sm">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "rounded-md px-2.5 py-1.5 transition-colors",
                  isActive
                    ? "bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ApiBadge />
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                "rounded-md px-2.5 py-1.5 text-sm transition-colors",
                isActive
                  ? "bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
              )
            }
            title="API settings"
          >
            ⚙ Settings
          </NavLink>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}