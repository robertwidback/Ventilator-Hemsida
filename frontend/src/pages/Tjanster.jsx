import { Link } from "react-router-dom";
import { ArrowUpRight, Wind, Wrench, DraftingCompass, Leaf, ClipboardCheck, Network } from "lucide-react";
import { Reveal, MaskedLine, ClipReveal } from "@/components/Reveal";

const SERVICES = [
  {
    n: "01",
    icon: Wind,
    title: "Entreprenad",
    text: "Vi installerar i alla typer av byggnader på både utförande- och totalentreprenad och i samverkansprojekt. Våra erfarna projektledare och egna montörer säkerställer kvaliteten i alla led.",
  },
  {
    n: "02",
    icon: Wrench,
    title: "Service",
    text: "Servicekontrakt genom en snabb och flexibel serviceorganisation med inriktning på ventilation, klimat och styr & regler. Ronderingar, planerat underhåll, felanmälningar och akuta åtgärder.",
  },
  {
    n: "03",
    icon: DraftingCompass,
    title: "Projektering",
    text: "Egen teknisk enhet för systemkompetens och projektering. Experthjälp inom energibesparing, kostnadsuppfattningar, systemlösningar i tidiga skeden och konstruktion.",
  },
  {
    n: "04",
    icon: Leaf,
    title: "Energioptimering",
    text: "Dagens fokus på klimatfrågor gör det extra inspirerande att jobba i en bransch där energibesparing står högt på agendan. Vi optimerar befintliga anläggningar för lägre energiförbrukning.",
  },
  {
    n: "05",
    icon: ClipboardCheck,
    title: "OVK",
    text: "Ventilator utför den obligatoriska ventilationskontrollen för att säkerställa ett tillfredsställande inomhusklimat. I dag ingår en bra inomhusmiljö i det nationella miljökvalitetsmålet.",
  },
  {
    n: "06",
    icon: Network,
    title: "Samordnade installationer",
    text: "Tillsammans med systerföretagen i Energivärden genomför vi samordnade entreprenader där vi tar ansvar för samtliga installationer i ert projekt – ett grepp, ett helhetsansvar.",
  },
];

export default function Tjanster() {
  return (
    <div data-testid="tjanster-page">
      {/* HERO */}
      <section className="grain relative flex min-h-[70svh] items-end overflow-hidden bg-vent-dark" data-testid="tjanster-hero">
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-44 lg:px-10">
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.35em] text-vent-green">Luftbehandling</p>
          <h1 className="font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tighter text-white sm:text-7xl lg:text-8xl" data-testid="tjanster-heading">
            <MaskedLine delay={0.15}>Våra tjänster</MaskedLine>
          </h1>
          <MaskedLine delay={0.5}>
            <p className="mt-8 max-w-2xl text-base text-white/70 md:text-lg" data-testid="tjanster-intro">
              Stor erfarenhet och kunnande inom all modern luftbehandlingsteknik. Vi skräddarsyr lösningar efter kundens perspektiv och önskemål – alltid med högsta kvalitet från start till mål.
            </p>
          </MaskedLine>
        </div>
      </section>

      {/* SERVICES LIST */}
      <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-40" data-testid="services-list">
        <div className="flex flex-col">
          {SERVICES.map((s, i) => (
            <Reveal key={s.n} delay={0.05}>
              <div
                className="group grid items-start gap-6 border-t border-vent-navy/15 py-14 transition-colors duration-500 last:border-b hover:bg-vent-ice md:grid-cols-[80px_1fr_2fr] md:gap-14 md:px-6"
                data-testid={`tjanster-row-${s.n}`}
              >
                <span className="font-mono text-sm text-vent-blue">{s.n}</span>
                <div className="flex items-center gap-5">
                  <s.icon className="h-8 w-8 shrink-0 text-vent-blue transition-colors duration-500 group-hover:text-vent-green" strokeWidth={1.5} />
                  <h2 className="font-display text-3xl font-bold tracking-tight text-vent-navy sm:text-4xl">{s.title}</h2>
                </div>
                <p className="max-w-xl text-base leading-relaxed text-vent-navy/70">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 flex justify-center">
          <Link
            to="/kontakt"
            data-testid="tjanster-contact-cta"
            className="group inline-flex items-center gap-2 bg-vent-blue px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-colors duration-300 hover:bg-vent-navy"
          >
            Diskutera ditt projekt med oss
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </Reveal>
      </section>

      {/* IMAGE BAND */}
      <section className="mx-auto max-w-7xl px-6 pb-28 lg:px-10" data-testid="tjanster-images">
        <div className="grid gap-10 md:grid-cols-2">
          <ClipReveal
            src="https://ventilator.se/wp-content/uploads/sites/2/2021/02/Luftbehandling-720x480.jpeg"
            alt="Luftbehandlingsanläggning"
            className="aspect-[3/2]"
            testId="tjanster-image-1"
          />
          <ClipReveal
            src="https://images.unsplash.com/photo-1635604866833-70844856de75?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2ODh8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBjbGVhbiUyMGluZHVzdHJpYWwlMjB2ZW50aWxhdGlvbiUyMGh2YWN8ZW58MHx8fHwxNzg2NDMyODY1fDA&ixlib=rb-4.1.0&q=85"
            alt="Ventilationssystem"
            className="aspect-[3/2] md:mt-20"
            testId="tjanster-image-2"
          />
        </div>
      </section>
    </div>
  );
}
