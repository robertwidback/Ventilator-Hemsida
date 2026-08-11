import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ArrowDown, Wind, Wrench, DraftingCompass, Leaf, ClipboardCheck, Network } from "lucide-react";
import { Reveal, MaskedLine, ClipReveal } from "@/components/Reveal";

const HERO_IMG =
  "https://images.unsplash.com/photo-1615309662243-70f6df917b59?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2ODh8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjbGVhbiUyMGluZHVzdHJpYWwlMjB2ZW50aWxhdGlvbiUyMGh2YWN8ZW58MHx8fHwxNzg2NDMyODY1fDA&ixlib=rb-4.1.0&q=85";

const VALUES = [
  { n: "01", title: "Långsiktighet", text: "I drygt 80 år har vi arbetat framgångsrikt med såväl entreprenader som service. Hemligheten är enkel – vi sätter alltid kunden och kvaliteten i fokus." },
  { n: "02", title: "Hållbarhet", text: "Våra uppdrag kännetecknas av säkerhet, kvalitet och miljötänk i alla led. Vi arbetar aktivt utifrån FN:s globala hållbarhetsmål." },
  { n: "03", title: "Tekniskt kunnande", text: "Egen teknisk enhet för systemkompetens och projektering. Experthjälp inom energibesparing, systemlösningar och konstruktion." },
  { n: "04", title: "Gemenskap", text: "Tillsammans med systerföretagen i Energivärden genomför vi samordnade entreprenader och tar ansvar för samtliga installationer." },
];

const SERVICES = [
  { icon: Wind, title: "Entreprenad", text: "Installation i alla typer av byggnader – utförande-, total- och samverkansentreprenader." },
  { icon: Wrench, title: "Service", text: "Komplett och heltäckande service inom ventilation – ronderingar, underhåll och akuta åtgärder." },
  { icon: DraftingCompass, title: "Projektering", text: "Experthjälp inom energibesparing, kostnadsuppfattningar och teknisk projektering." },
  { icon: Leaf, title: "Energioptimering", text: "Energibesparing står högt på agendan – vi optimerar din anläggning för klimatet och plånboken." },
  { icon: ClipboardCheck, title: "OVK", text: "Obligatorisk ventilationskontroll som säkerställer ett tillfredsställande inomhusklimat." },
  { icon: Network, title: "Samordnade installationer", text: "Tillsammans med systerföretagen i Energivärden tar vi ansvar för samtliga installationer i ert projekt." },
];

const REFERENCES = [
  {
    title: "Kv. Enzymet, Hagastaden",
    text: "Luftbehandlingsentreprenaden för nybyggnationen – 197 lägenheter samt två förskolor.",
    img: "https://ventilator.se/wp-content/uploads/sites/2/2021/02/Kv-1.-Enzymet.jpg",
  },
  {
    title: "Polishögskolan, Södertörn",
    text: "Modern och behovsanpassad ventilation i den renoverade fastigheten Ana 12.",
    img: "https://ventilator.se/wp-content/uploads/sites/2/2021/02/Polioshuset-720x400.jpg",
  },
  {
    title: "IMAX-bio, Mall of Scandinavia",
    text: "Hela luftentreprenaden för ett toppmodernt biografkomplex med 15 salonger.",
    img: "https://ventilator.se/wp-content/uploads/sites/2/2021/02/IMAX-720x480.jpg",
  },
];

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "45%"]);

  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section ref={heroRef} className="grain relative flex min-h-[100svh] items-end overflow-hidden bg-vent-dark" data-testid="hero-section">
        <motion.div style={{ y: bgY }} className="absolute inset-0">
          <img src={HERO_IMG} alt="" className="h-[120%] w-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-vent-dark via-vent-dark/40 to-vent-dark/70" />
        </motion.div>

        <motion.div style={{ y: contentY }} className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 pt-40 lg:px-10">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 1 }}
            className="mb-8 font-mono text-xs uppercase tracking-[0.35em] text-vent-green"
            data-testid="hero-overline"
          >
            Sedan 1931 — Stockholm
          </motion.p>
          <h1 className="font-display text-[13vw] font-extrabold uppercase leading-[0.95] tracking-tighter text-white sm:text-7xl lg:text-8xl" data-testid="hero-heading">
            <MaskedLine delay={0.15}>Ditt långsiktiga</MaskedLine>
            <MaskedLine delay={0.3}>val inom</MaskedLine>
            <MaskedLine delay={0.45} className="text-vent-blue" >luftbehandling<span className="text-vent-green">.</span></MaskedLine>
          </h1>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"
          >
            <p className="max-w-xl text-base text-white/70 md:text-lg" data-testid="hero-subtitle">
              Vårt bemötande, kunskap och kvalitet skapar långsiktiga relationer. Vi åtar oss helhetsansvar – från projektering och installation till service och underhåll.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/tjanster"
                data-testid="hero-cta-services"
                className="group inline-flex items-center gap-2 bg-vent-blue px-7 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-colors duration-300 hover:bg-vent-green"
              >
                Våra tjänster
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                to="/kontakt"
                data-testid="hero-cta-contact"
                className="inline-flex items-center gap-2 border border-white/30 px-7 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-vent-navy"
              >
                Kontakta oss
              </Link>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="absolute bottom-8 right-8 hidden items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/50 md:flex"
        >
          Scrolla
          <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
        </motion.div>
      </section>

      {/* MANIFESTO */}
      <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-40" data-testid="manifesto-section">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-vent-blue">Manifest</p>
          <h2 className="mt-6 max-w-4xl font-display text-4xl font-bold leading-tight tracking-tight text-vent-navy sm:text-5xl lg:text-6xl">
            Vårt bemötande, kunskap och kvalitet skapar långsiktiga relationer
          </h2>
        </Reveal>
        <div className="mt-20 grid gap-x-14 gap-y-16 md:grid-cols-2">
          {VALUES.map((v, i) => (
            <Reveal key={v.n} delay={i * 0.08}>
              <div className="group border-t border-vent-navy/15 pt-8" data-testid={`manifesto-chapter-${v.n}`}>
                <span className="font-mono text-sm text-vent-blue">{v.n}</span>
                <h3 className="mt-3 font-display text-3xl font-bold tracking-tight text-vent-navy transition-colors duration-300 group-hover:text-vent-blue">
                  {v.title}
                </h3>
                <p className="mt-4 max-w-md text-base leading-relaxed text-vent-navy/70">{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SERVICES BENTO */}
      <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-40" data-testid="services-section">
        <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-vent-blue">Vad vi gör</p>
            <h2 className="mt-6 font-display text-4xl font-bold tracking-tight text-vent-navy sm:text-5xl">
              Kompetens och resurser för alla typer av åtaganden
            </h2>
          </div>
          <Link
            to="/tjanster"
            data-testid="services-all-link"
            className="group inline-flex shrink-0 items-center gap-2 border-b-2 border-vent-blue pb-1 font-semibold text-vent-navy transition-colors duration-300 hover:text-vent-blue"
          >
            Alla tjänster
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </Reveal>

        <div className="mt-16 grid gap-px bg-vent-navy/10 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <Link
                to="/tjanster"
                data-testid={`service-card-${s.title.toLowerCase()}`}
                className="group flex h-full flex-col bg-white p-10 transition-colors duration-500 hover:bg-vent-navy"
              >
                <s.icon className="h-8 w-8 text-vent-blue transition-colors duration-500 group-hover:text-vent-green" strokeWidth={1.5} />
                <h3 className="mt-8 font-display text-2xl font-bold tracking-tight text-vent-navy transition-colors duration-500 group-hover:text-white">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-vent-navy/60 transition-colors duration-500 group-hover:text-white/70">
                  {s.text}
                </p>
                <ArrowUpRight className="mt-auto h-5 w-5 pt-6 text-vent-navy/30 transition-[color,transform] duration-500 group-hover:translate-x-1 group-hover:text-vent-green" />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ENTREPRENAD / SERVICE SPOTLIGHT */}
      <section className="grain bg-vent-dark py-28 lg:py-40" data-testid="spotlight-section">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-vent-green">Helhetsansvar</p>
            <h2 className="mt-6 max-w-3xl font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Från idéstadiet till drift och underhållsåtagande
            </h2>
          </Reveal>
          <div className="mt-16 grid gap-16 lg:grid-cols-2">
            <Reveal>
              <ClipReveal
                src="https://ventilator.se/wp-content/uploads/sites/2/2023/10/C01-STREET_v10-utan-lykta-1-400x267.jpg"
                alt="Entreprenadprojekt"
                className="aspect-[4/3]"
                testId="spotlight-image-entreprenad"
              />
              <h3 className="mt-8 font-display text-3xl font-bold uppercase tracking-tight text-white">Entreprenad</h3>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-white/70">
                Vi installerar i alla typer av byggnader på både utförande- och totalentreprenad och i samverkansprojekt. Våra erfarna projektledare och montörer säkerställer kvaliteten i alla led.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <ClipReveal
                src="https://ventilator.se/wp-content/uploads/sites/2/2021/02/Ventilatorforstasida1024x683-400x267.jpeg"
                alt="Servicemontörer"
                className="aspect-[4/3]"
                testId="spotlight-image-service"
              />
              <h3 className="mt-8 font-display text-3xl font-bold uppercase tracking-tight text-white">Service</h3>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-white/70">
                Vår serviceorganisation säkerställer att du som kund alltid har en väl fungerande och energioptimerad anläggning. Filterbyten, rengöring, injustering, OVK och utredningar.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-40" data-testid="references-section">
        <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-vent-blue">Utvalda projekt</p>
            <h2 className="mt-6 font-display text-4xl font-bold tracking-tight text-vent-navy sm:text-5xl">Våra referenser</h2>
          </div>
          <Link
            to="/referenser"
            data-testid="references-all-link"
            className="group inline-flex shrink-0 items-center gap-2 border-b-2 border-vent-blue pb-1 font-semibold text-vent-navy transition-colors duration-300 hover:text-vent-blue"
          >
            Alla referenser
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </Reveal>
        <div className="mt-16 grid gap-10 md:grid-cols-3">
          {REFERENCES.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.1}>
              <Link to="/referenser" className="group block" data-testid={`reference-card-${i}`}>
                <ClipReveal src={r.img} alt={r.title} className="aspect-[4/3]" testId={`reference-image-${i}`} />
                <h3 className="mt-6 font-display text-xl font-bold tracking-tight text-vent-navy transition-colors duration-300 group-hover:text-vent-blue">
                  {r.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-vent-navy/60">{r.text}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SUSTAINABILITY TEASER */}
      <section className="border-t border-vent-navy/10 bg-vent-ice py-28 lg:py-40" data-testid="sustainability-teaser">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-10">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-vent-green">Agenda 2030</p>
            <h2 className="mt-6 font-display text-4xl font-bold tracking-tight text-vent-navy sm:text-5xl">
              En hållbar utveckling
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-vent-navy/70">
              Ventilator arbetar för en hållbar samhällsutveckling genom att utgå från de globala hållbarhetsmålen. I grunden finns en genomarbetad kvalitets-, personal- och arbetsmiljöpolicy.
            </p>
            <Link
              to="/hallbarhet"
              data-testid="sustainability-cta"
              className="group mt-10 inline-flex items-center gap-2 bg-vent-navy px-7 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-colors duration-300 hover:bg-vent-green"
            >
              Läs om vårt hållbarhetsarbete
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
          <ClipReveal
            src="https://ventilator.se/wp-content/uploads/sites/2/2021/02/02-agenda-2030-720x480.jpg"
            alt="Agenda 2030"
            className="aspect-[3/2]"
            testId="sustainability-image"
          />
        </div>
      </section>
    </div>
  );
}
