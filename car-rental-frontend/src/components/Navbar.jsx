import { useState } from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Ballina" },
  { to: "/cars", label: "Makinat" },
  { to: "/admin", label: "Admin" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-ink text-mist">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <NavLink to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber text-ink font-display font-bold">
            A
          </span>
          <span className="font-display text-xl tracking-tight">Auto Lana</span>
        </NavLink>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `font-body text-sm transition-colors ${
                  isActive ? "text-amber" : "text-mist/80 hover:text-mist"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to="/cars"
            className="rounded-full bg-amber px-4 py-2 text-sm font-semibold text-ink transition hover:bg-amber-dark"
          >
            Rezervo tani
          </NavLink>
        </nav>

        <button
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label="Hap menunë"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span className={`h-0.5 w-6 bg-mist transition ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-6 bg-mist transition ${open ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-6 bg-mist transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-ink-line px-5 pb-4 md:hidden">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm ${
                  isActive ? "bg-ink-soft text-amber" : "text-mist/80"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
