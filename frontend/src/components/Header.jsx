import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";

const NAV = [
  { to: "/", label: "Hem" },
  { to: "/om-oss", label: "Om oss" },
  { to: "/tjanster", label: "Tjänster" },
  { to: "/referenser", label: "Referenser" },
  { to: "/nyheter", label: "Nyheter" },
  { to: "/hallbarhet", label: "Hållbarhet" },
  { to: "/kontakt", label: "Kontakt" },
];

const Logo = () => (
  <Link to="/" className="flex items-center" data-testid="header-logo">
    <img src="/images/logga.gif" alt="Ventilator – System för luftbehandling" className="h-9 w-auto" />
  </Link>
);

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      data-testid="site-header"
      className={`fixed inset-x-0 top-0 z-50 border-b border-vent-navy/10 bg-white transition-shadow duration-500 ${
        scrolled ? "shadow-[0_4px_24px_-8px_rgba(10,25,49,0.12)]" : ""
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Logo />
        <nav className="hidden items-center gap-8 lg:flex" data-testid="desktop-nav">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              data-testid={`nav-${item.label.toLowerCase().replace(" ", "-").replace("å", "a")}`}
              className={({ isActive }) =>
                `group relative text-sm font-medium tracking-wide transition-colors duration-300 ${
                  isActive ? "text-vent-navy" : "text-vent-navy/60 hover:text-vent-navy"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-px bg-vent-green transition-[width] duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
          <Link
            to="/kontakt"
            data-testid="header-cta-button"
            className="group ml-4 inline-flex items-center gap-2 bg-vent-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-vent-navy"
          >
            Kontakta oss
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </nav>
        <button
          className="text-vent-navy lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Meny"
          data-testid="mobile-menu-toggle"
        >
          {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden bg-white/95 backdrop-blur-xl lg:hidden"
            data-testid="mobile-nav"
          >
            <div className="flex flex-col gap-1 px-6 py-6">
              {NAV.map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <NavLink
                    to={item.to}
                    data-testid={`mobile-nav-${item.label.toLowerCase().replace(" ", "-").replace("å", "a")}`}
                    className={({ isActive }) =>
                      `block py-3 font-display text-3xl font-bold tracking-tight ${
                        isActive ? "text-vent-blue" : "text-vent-navy"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};
