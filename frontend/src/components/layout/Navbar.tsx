import { NavLink } from "react-router-dom";
import { User } from "lucide-react";
import { cn } from "../../lib/cn";
import { useAuth } from "../../hooks/useAuth";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/transacoes", label: "Transações" },
  { to: "/categorias", label: "Categorias" },
];

export function Navbar() {
  const { user } = useAuth();

  const initials = user?.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="app-navbar-inner relative flex items-center justify-between px-10 max-sm:px-4">
        <NavLink to="/" aria-label="Financy - Dashboard">
          <img src="/Logo.png" alt="Financy" className="h-5 w-auto" />
        </NavLink>

        <nav className="absolute left-1/2 flex -translate-x-1/2 items-center gap-6 max-sm:static max-sm:translate-x-0 max-sm:gap-3">
          {links.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "text-xs transition-colors hover:text-brand-base",
                  isActive ? "font-semibold text-brand-base" : "font-normal text-gray-600"
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <NavLink
          to="/perfil"
          className="app-navbar-avatar flex items-center justify-center rounded-full bg-gray-300 font-medium text-gray-700"
          aria-label="Perfil"
        >
          {initials || <User size={14} />}
        </NavLink>
      </div>
    </header>
  );
}
