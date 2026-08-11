import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Reveal, MaskedLine, ClipReveal } from "@/components/Reveal";
import { Marquee } from "@/components/Marquee";

export default function OmOss() {
  return (
    <div data-testid="om-oss-page">
      {/* HERO */}
      <section className="grain relative flex min-h-[70svh] items-end overflow-hidden bg-vent-dark" data-testid="om-oss-hero">
        <div className="absolute inset-0 bg-gradient-to-t from-vent-dark via-vent-dark/60 to-vent-dark/40" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-44 lg:px-10">
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.35em] text-vent-green">Om oss</p>
          <h1 className="font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tighter text-white sm:text-7xl lg:text-8xl" data-testid="om-oss-heading">
            <MaskedLine delay={0.15}>Vår vision</MaskedLine>
          </h1>
          <MaskedLine delay={0.5}>
            <p className="mt-8 max-w-2xl text-base text-white/70 md:text-lg" data-testid="om-oss-vision">
              Vårt bemötande, kunskap och kvalitet skapar långsiktiga relationer.
            </p>
          </MaskedLine>
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-40">
        <div className="grid gap-16 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-3xl font-bold leading-snug tracking-tight text-vent-navy sm:text-4xl" data-testid="om-oss-intro-heading">
              Inget företag överlever och fortsätter utvecklas i över åttio år utan starka idéer, hög teknisk kompetens och stora ambitioner.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-6 text-base leading-relaxed text-vent-navy/70">
              <p>
                Nöjda och återkommande kunder har alltid varit ryggraden i Ventilators verksamhet. Att påstå att vi alltid arbetar långsiktigt känns därför inte som någon överdrift.
              </p>
              <p>
                Ventilator grundades 1931 och har sitt ursprung i Sven Romdahls idé om mekanisk bostadsventilation. Denna form av kontrollerad ventilation revolutionerade och rationaliserade bostadsbyggandet i Sverige.
              </p>
              <p>
                I dag är Ventilator ett modernt, ledande företag med specialkompetens inom ny luftbehandlingsteknik – med kompletta lösningar från total- och utförandeentreprenader till service, underhåll, utredningar, energioptimering och OVK.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* HISTORY IMAGES */}
      <section className="mx-auto max-w-7xl px-6 pb-28 lg:px-10" data-testid="history-section">
        <div className="grid gap-10 md:grid-cols-2">
          <ClipReveal
            src="https://ventilator.se/wp-content/uploads/sites/2/2021/02/VentilatorOm-osssvetsare-720x480.png"
            alt="Svetsare hos Ventilator"
            className="aspect-[3/2]"
            testId="history-image-1"
          />
          <ClipReveal
            src="https://ventilator.se/wp-content/uploads/sites/2/2021/02/xx-720x480.jpg"
            alt="Ventilator genom åren"
            className="aspect-[3/2] md:mt-20"
            testId="history-image-2"
          />
        </div>
        <Reveal className="mt-16 grid gap-10 border-t border-vent-navy/10 pt-16 sm:grid-cols-3">
          {[
            ["1931", "Grundat på Sven Romdahls idé om mekanisk bostadsventilation"],
            ["80+", "År av framgångsrikt arbete med entreprenader och service"],
            ["4", "Grundstenar: Långsiktighet, hållbarhet, tekniskt kunnande, gemenskap"],
          ].map(([num, label]) => (
            <div key={num} data-testid={`history-stat-${num}`}>
              <span className="font-display text-6xl font-extrabold tracking-tighter text-vent-blue">{num}</span>
              <p className="mt-3 text-sm leading-relaxed text-vent-navy/60">{label}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <Marquee dark items={["Långsiktighet", "Hållbarhet", "Tekniskt kunnande", "Gemenskap"]} />

      {/* ENERGIVARDEN + HELHETSGREPP */}
      <section className="grain bg-vent-dark py-28 lg:py-40" data-testid="energivarden-section">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:px-10">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-vent-green">Samverkande entreprenader</p>
            <h2 className="mt-6 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              En del av Energivärden
            </h2>
            <p className="mt-6 text-base leading-relaxed text-white/70">
              Ventilator ingår i företagsgruppen Energivärden tillsammans med Styrvärden AB, Carl Hanssons Rör &amp; Värme AB samt Carls Elektriska AB. Tillsammans genomför vi samordnade entreprenader där vi tar ansvar för samtliga installationer i ert projekt.
            </p>
            <ul className="mt-10 space-y-3 font-mono text-sm uppercase tracking-widest text-white/60" data-testid="sister-companies-list">
              <li className="border-b border-white/10 pb-3">Styrvärden AB</li>
              <li className="border-b border-white/10 pb-3">Carl Hanssons Rör &amp; Värme AB</li>
              <li className="border-b border-white/10 pb-3">Carls Elektriska AB</li>
            </ul>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-vent-green">Helhetsgrepp</p>
            <h2 className="mt-6 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Genom hela fastighetens livscykel
            </h2>
            <p className="mt-6 text-base leading-relaxed text-white/70">
              Ventilator är specialister inom luftbehandling och verksamheten vilar på två inriktningar – entreprenad och service. Vi utför allt från projektering och projekteringsstöd i tidiga skeden till service och underhåll i befintliga byggnader.
            </p>
            <Link
              to="/tjanster"
              data-testid="om-oss-services-cta"
              className="group mt-10 inline-flex items-center gap-2 bg-vent-blue px-7 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-colors duration-300 hover:bg-vent-green"
            >
              Se våra tjänster
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
