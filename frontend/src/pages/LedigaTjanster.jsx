import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ArrowUpRight, Loader2, MapPin, Briefcase, Clock } from "lucide-react";
import { Reveal, MaskedLine } from "@/components/Reveal";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function LedigaTjanster() {
  const [jobs, setJobs] = useState(null);

  useEffect(() => {
    axios.get(`${API}/jobs`).then((res) => setJobs(res.data)).catch(() => setJobs([]));
  }, []);

  return (
    <div data-testid="lediga-tjanster-page">
      <section className="grain relative flex min-h-[60svh] items-end overflow-hidden bg-vent-dark" data-testid="jobs-hero">
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-44 lg:px-10">
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.35em] text-vent-green">Karriär</p>
          <h1 className="font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tighter text-white sm:text-7xl lg:text-8xl" data-testid="jobs-heading">
            <MaskedLine delay={0.15}>Lediga tjänster</MaskedLine>
          </h1>
          <MaskedLine delay={0.5}>
            <p className="mt-8 max-w-2xl text-base text-white/70 md:text-lg" data-testid="jobs-intro">
              Vill du ta nästa steg i din karriär? Vi letar alltid efter duktiga medarbetare som vill vara med och utveckla Ventilator.
            </p>
          </MaskedLine>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-36" data-testid="jobs-list">
        {jobs === null ? (
          <div className="flex justify-center py-20" data-testid="jobs-loading">
            <Loader2 className="h-8 w-8 animate-spin text-vent-blue" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="py-10 text-center" data-testid="jobs-empty">
            <h2 className="font-display text-3xl font-bold tracking-tight text-vent-navy">Inga lediga tjänster just nu</h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-vent-navy/60">
              Vi letar alltid efter duktiga medarbetare – skicka gärna en spontanansökan så hör vi av oss.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-vent-navy/10 border-y border-vent-navy/10">
            {jobs.map((j, i) => (
              <Reveal key={j.id} delay={i * 0.08}>
                <Link
                  to={`/lediga-tjanster/${j.id}`}
                  data-testid={`job-card-${j.id}`}
                  className="group grid gap-6 py-12 transition-colors duration-300 md:grid-cols-[1fr_auto] md:items-center"
                >
                  <div>
                    {j.category && (
                      <p className="font-mono text-xs uppercase tracking-[0.25em] text-vent-blue">{j.category}</p>
                    )}
                    <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-vent-navy transition-colors duration-300 group-hover:text-vent-blue sm:text-4xl">
                      {j.title}
                    </h2>
                    {j.preamble && <p className="mt-3 max-w-2xl text-base leading-relaxed text-vent-navy/70">{j.preamble}</p>}
                    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-vent-navy/60">
                      {j.location && (
                        <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-vent-green" /> {j.location}</span>
                      )}
                      {j.employment_type && (
                        <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-vent-green" /> {j.employment_type}</span>
                      )}
                      {j.category && (
                        <span className="inline-flex items-center gap-2"><Briefcase className="h-4 w-4 text-vent-green" /> {j.category}</span>
                      )}
                    </div>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-2 border-b-2 border-vent-blue pb-1 text-sm font-semibold uppercase tracking-wider text-vent-navy transition-colors duration-300 group-hover:text-vent-blue">
                    Läs mer & ansök
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <section className="grain bg-vent-dark py-24 lg:py-32" data-testid="spontaneous-application">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-6 lg:flex-row lg:items-end lg:justify-between lg:px-10">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-vent-green">Spontanansökan</p>
            <h2 className="mt-6 max-w-2xl font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Hittar du ingen tjänst som passar?
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70">
              Vi är alltid intresserade av att komma i kontakt med duktiga montörer, servicetekniker och projektledare. Skicka ditt CV och några rader om dig själv.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <a
              href="mailto:info@ventilator.se?subject=Spontanans%C3%B6kan"
              data-testid="spontaneous-application-button"
              className="group inline-flex items-center gap-2 bg-vent-blue px-7 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-colors duration-300 hover:bg-vent-green"
            >
              Skicka spontanansökan
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
