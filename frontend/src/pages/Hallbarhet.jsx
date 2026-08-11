import { Link } from "react-router-dom";
import { ArrowUpRight, Leaf } from "lucide-react";
import { Reveal, MaskedLine, ClipReveal } from "@/components/Reveal";
import { Marquee } from "@/components/Marquee";

const GOALS = [
  "Minimera vår egen och våra kunders klimatpåverkan",
  "Arbeta för en hållbar resursanvändning",
  "Gott ledarskap och trygg ekonomi",
  "Bra arbetsmiljö och utvecklande arbetsklimat för alla",
  "Arbeta för jämställdhet och mångfald",
  "Etisk syn på inköp av varor, produkter och tjänster",
  "Främja mänskliga rättigheter",
  "Alltid agera enligt etiska affärsmetoder",
  "Visa lokalt samhällsengagemang",
  "Vara transparent med kunder, leverantörer och medarbetare",
];

const POLICIES = [
  {
    n: "01",
    title: "Kvalitets- och miljöpolicy",
    text: "Vi förebygger och säkerställer miljöaspekterna som en väsentlig del i vårt verksamhetssystem, hushåller med resurser i alla våra processer, undviker giftiga och långlivade naturfrämmande produkter och minimerar energiförbrukningen – med hänsyn till våra kunders krav på klimat och komfort.",
  },
  {
    n: "02",
    title: "Personal- och arbetsmiljöpolicy",
    text: "Vi vill verka för att Ventilator är en trygg, säker och trivsam arbetsplats med goda möjligheter till utveckling och utmaningar för alla medarbetare. Vi har tydliga säkerhetskrav och pushar våra medarbetare att vidareutbilda sig. Jämställdhet på alla plan är självklart för oss.",
  },
];

export default function Hallbarhet() {
  return (
    <div data-testid="hallbarhet-page">
      {/* HERO */}
      <section className="grain relative flex min-h-[70svh] items-end overflow-hidden bg-vent-dark" data-testid="hallbarhet-hero">
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-44 lg:px-10">
          <p className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.35em] text-vent-green">
            <Leaf className="h-4 w-4" /> Hållbarhet
          </p>
          <h1 className="font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tighter text-white sm:text-7xl lg:text-8xl" data-testid="hallbarhet-heading">
            <MaskedLine delay={0.15}>Vi arbetar efter</MaskedLine>
            <MaskedLine delay={0.3} className="text-vent-green">Agenda 2030</MaskedLine>
          </h1>
          <MaskedLine delay={0.5}>
            <p className="mt-8 max-w-2xl text-base text-white/70 md:text-lg">
              Ventilator verkar för en hållbar samhällsutveckling genom att utgå från FN:s globala hållbarhetsmål – med fokus på de mål som är relevanta för vår bransch och där vi kan påverka mest.
            </p>
          </MaskedLine>
        </div>
      </section>

      {/* GOALS */}
      <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-40" data-testid="goals-section">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-vent-blue">Våra åtaganden</p>
          <h2 className="mt-6 max-w-3xl font-display text-4xl font-bold tracking-tight text-vent-navy sm:text-5xl">
            Tio löften för en hållbar utveckling
          </h2>
        </Reveal>
        <div className="mt-16 grid gap-px bg-vent-navy/10 sm:grid-cols-2">
          {GOALS.map((goal, i) => (
            <Reveal key={goal} delay={(i % 4) * 0.05}>
              <div className="flex h-full items-start gap-5 bg-white p-8" data-testid={`goal-item-${i + 1}`}>
                <span className="font-mono text-sm text-vent-green">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-base font-medium leading-relaxed text-vent-navy">{goal}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Marquee items={["Hållbarhet", "Kvalitet", "Arbetsmiljö", "Jämställdhet", "Transparens"]} />

      {/* POLICIES + IMAGE */}
      <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-40" data-testid="policies-section">
        <div className="grid items-start gap-16 lg:grid-cols-2">
          <div className="space-y-16">
            {POLICIES.map((p) => (
              <Reveal key={p.n}>
                <div className="border-t border-vent-navy/15 pt-8" data-testid={`policy-${p.n}`}>
                  <span className="font-mono text-sm text-vent-blue">{p.n}</span>
                  <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-vent-navy">{p.title}</h2>
                  <p className="mt-4 text-base leading-relaxed text-vent-navy/70">{p.text}</p>
                </div>
              </Reveal>
            ))}
            <Reveal>
              <Link
                to="/kontakt"
                data-testid="hallbarhet-contact-cta"
                className="group inline-flex items-center gap-2 bg-vent-navy px-7 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-colors duration-300 hover:bg-vent-green"
              >
                Kontakta oss
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Reveal>
          </div>
          <ClipReveal
            src="https://ventilator.se/wp-content/uploads/sites/2/2021/02/02-agenda-2030-720x480.jpg"
            alt="Agenda 2030"
            className="aspect-[3/2] lg:sticky lg:top-32"
            testId="hallbarhet-image"
          />
        </div>
      </section>
    </div>
  );
}
