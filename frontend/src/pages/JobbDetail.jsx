import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, ArrowUpRight, Loader2, MapPin, Clock, Briefcase } from "lucide-react";
import { Reveal, MaskedLine } from "@/components/Reveal";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function JobbDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    axios
      .get(`${API}/jobs/${id}`)
      .then((res) => setJob(res.data))
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-60 text-center" data-testid="job-not-found">
        <h1 className="font-display text-4xl font-bold text-vent-navy">Tjänsten hittades inte</h1>
        <Link to="/lediga-tjanster" className="mt-6 inline-block font-semibold text-vent-blue underline underline-offset-4">
          Tillbaka till lediga tjänster
        </Link>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-screen items-center justify-center" data-testid="job-detail-loading">
        <Loader2 className="h-8 w-8 animate-spin text-vent-blue" />
      </div>
    );
  }

  const mailto = `mailto:info@ventilator.se?subject=${encodeURIComponent(`Ansökan: ${job.title}`)}`;

  return (
    <div data-testid="jobb-detail-page">
      <section className="grain relative flex min-h-[50svh] items-end overflow-hidden bg-vent-dark">
        <div className="relative z-10 mx-auto w-full max-w-4xl px-6 pb-16 pt-44">
          {job.category && (
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.35em] text-vent-green">{job.category}</p>
          )}
          <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl" data-testid="job-detail-title">
            <MaskedLine delay={0.1}>{job.title}</MaskedLine>
          </h1>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70" data-testid="job-detail-meta">
            {job.location && (
              <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-vent-green" /> {job.location}</span>
            )}
            {job.employment_type && (
              <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-vent-green" /> {job.employment_type}</span>
            )}
            {job.category && (
              <span className="inline-flex items-center gap-2"><Briefcase className="h-4 w-4 text-vent-green" /> {job.category}</span>
            )}
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-4xl px-6 py-20 lg:py-28">
        <Reveal>
          {job.preamble && (
            <p className="text-lg font-medium leading-relaxed text-vent-navy md:text-xl" data-testid="job-detail-preamble">
              {job.preamble}
            </p>
          )}
          <div className="mt-8 space-y-6 text-base leading-relaxed text-vent-navy/75" data-testid="job-detail-body">
            {job.body.split(/\n\s*\n/).map((para, i) => (
              <p key={i} className="whitespace-pre-line">{para}</p>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-14 flex flex-wrap items-center gap-6 border-t border-vent-navy/10 pt-10">
            <a
              href={mailto}
              data-testid="job-apply-button"
              className="group inline-flex items-center gap-2 bg-vent-blue px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-colors duration-300 hover:bg-vent-green"
            >
              Ansök via e-post
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <p className="text-sm text-vent-navy/60">
              Skicka CV och personligt brev till{" "}
              <a href={mailto} className="font-semibold text-vent-blue underline underline-offset-4">info@ventilator.se</a>
            </p>
          </div>
          <Link
            to="/lediga-tjanster"
            data-testid="job-detail-back"
            className="group mt-14 inline-flex items-center gap-2 border-b-2 border-vent-blue pb-1 font-semibold text-vent-navy transition-colors duration-300 hover:text-vent-blue"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Alla lediga tjänster
          </Link>
        </Reveal>
      </article>
    </div>
  );
}
