import { Link } from "react-router-dom";
import { ArrowUpRight, Phone, Mail, MapPin } from "lucide-react";
import { Reveal } from "./Reveal";

export const Footer = () => (
  <footer className="grain relative bg-vent-dark text-white" data-testid="site-footer">
    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
      <Reveal>
        <Link
          to="/kontakt"
          data-testid="footer-contact-heading"
          className="group inline-flex items-end gap-4"
        >
          <span className="font-display text-5xl font-extrabold uppercase leading-none tracking-tighter sm:text-7xl lg:text-8xl">
            Kontakta oss
          </span>
          <ArrowUpRight className="mb-2 h-10 w-10 text-vent-green transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-2 lg:h-14 lg:w-14" />
        </Link>
      </Reveal>

      <div className="mt-20 grid gap-14 border-t border-white/10 pt-14 md:grid-cols-3">
        <Reveal delay={0.05}>
          <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-white/50">Kontakt</h3>
          <ul className="mt-6 space-y-4 text-white/80">
            <li className="flex items-start gap-3" data-testid="footer-address">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-vent-green" />
              <span>
                Ventilator
                <br />
                Lövholmsvägen 9<br />
                100 74 Stockholm
              </span>
            </li>
            <li>
              <a href="tel:086811440" data-testid="footer-phone" className="flex items-center gap-3 transition-colors hover:text-white">
                <Phone className="h-4 w-4 text-vent-green" /> 08-681 14 40
              </a>
            </li>
            <li>
              <a href="mailto:info@ventilator.se" data-testid="footer-email" className="flex items-center gap-3 transition-colors hover:text-white">
                <Mail className="h-4 w-4 text-vent-green" /> info@ventilator.se
              </a>
            </li>
          </ul>
        </Reveal>
        <Reveal delay={0.1}>
          <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-white/50">Meny</h3>
          <ul className="mt-6 space-y-3">
            {[
              ["Om oss", "/om-oss"],
              ["Tjänster", "/tjanster"],
              ["Referenser", "/referenser"],
              ["Hållbarhet", "/hallbarhet"],
              ["Kontakt", "/kontakt"],
            ].map(([label, to]) => (
              <li key={to}>
                <Link
                  to={to}
                  data-testid={`footer-link-${label.toLowerCase().replace("å", "a")}`}
                  className="text-white/80 transition-colors duration-300 hover:text-vent-green"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.15}>
          <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-white/50">En del av Energivärden</h3>
          <ul className="mt-6 space-y-3 text-white/80" data-testid="footer-sister-companies">
            <li>Energivärden</li>
            <li>Styrvärden AB</li>
            <li>Carl Hanssons Rör &amp; Värme AB</li>
            <li>Carls Elektriska AB</li>
          </ul>
        </Reveal>
      </div>

      <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 font-mono text-xs uppercase tracking-widest text-white/40 sm:flex-row sm:items-center">
        <span data-testid="footer-copyright">© 2026 Ventilator</span>
        <span>Sedan 1931 — Luftbehandling · Entreprenad · Service</span>
      </div>
    </div>
  </footer>
);
