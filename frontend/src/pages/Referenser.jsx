import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { Reveal, MaskedLine, ClipReveal } from "@/components/Reveal";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Referenser() {
  const [projects, setProjects] = useState(null);

  useEffect(() => {
    axios.get(`${API}/references`).then((res) => setProjects(res.data)).catch(() => setProjects([]));
  }, []);

  return (
    <div data-testid="referenser-page">
      {/* HERO */}
      <section className="grain relative flex min-h-[70svh] items-end overflow-hidden bg-vent-dark" data-testid="referenser-hero">
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-44 lg:px-10">
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.35em] text-vent-green">Referenser</p>
          <h1 className="font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tighter text-white sm:text-7xl lg:text-8xl" data-testid="referenser-heading">
            <MaskedLine delay={0.15}>Projekt vi är</MaskedLine>
            <MaskedLine delay={0.3}>stolta över</MaskedLine>
          </h1>
          <MaskedLine delay={0.5}>
            <p className="mt-8 max-w-2xl text-base text-white/70 md:text-lg">
              Har man, som vi på Ventilator, funnits i över 80 år finns det fler projekt och nöjda kunder att berätta om än vi har utrymme till.
            </p>
          </MaskedLine>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-40" data-testid="projects-list">
        {projects === null ? (
          <div className="flex justify-center py-20" data-testid="projects-loading">
            <Loader2 className="h-8 w-8 animate-spin text-vent-blue" />
          </div>
        ) : projects.length === 0 ? (
          <p className="py-20 text-center text-vent-navy/60" data-testid="projects-empty">Inga referensprojekt publicerade ännu.</p>
        ) : (
          <div className="grid gap-x-10 gap-y-24 md:grid-cols-2">
            {projects.map((p, i) => (
              <Reveal key={p.id} delay={(i % 2) * 0.12} className={i % 2 === 1 ? "md:mt-24" : ""}>
                <article data-testid={`project-card-${i}`}>
                  {p.image_url && <ClipReveal src={p.image_url} alt={p.title} className="aspect-[4/3]" testId={`project-image-${i}`} />}
                  <div className="mt-6 flex items-center gap-4">
                    <span className="font-mono text-xs uppercase tracking-[0.25em] text-vent-blue">{p.tag}</span>
                    <span className="h-px flex-1 bg-vent-navy/10" />
                    <span className="font-mono text-xs text-vent-navy/40">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-vent-navy sm:text-3xl">{p.title}</h2>
                  <p className="mt-3 text-base leading-relaxed text-vent-navy/70">{p.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        )}

        <Reveal className="mt-28 border-t border-vent-navy/10 pt-16 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-vent-navy sm:text-4xl">
            Ert projekt härnäst?
          </h2>
          <Link
            to="/kontakt"
            data-testid="referenser-contact-cta"
            className="group mt-8 inline-flex items-center gap-2 bg-vent-blue px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-colors duration-300 hover:bg-vent-navy"
          >
            Kontakta oss
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
