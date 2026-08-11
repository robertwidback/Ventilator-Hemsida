import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { Reveal, MaskedLine, ClipReveal } from "@/components/Reveal";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const formatDate = (iso) => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("sv-SE", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return iso;
  }
};

export default function Nyheter() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    axios.get(`${API}/news`).then((res) => setPosts(res.data)).catch(() => setPosts([]));
  }, []);

  return (
    <div data-testid="nyheter-page">
      <section className="grain relative flex min-h-[60svh] items-end overflow-hidden bg-vent-dark" data-testid="nyheter-hero">
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-44 lg:px-10">
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.35em] text-vent-green">Nyheter</p>
          <h1 className="font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tighter text-white sm:text-7xl lg:text-8xl" data-testid="nyheter-heading">
            <MaskedLine delay={0.15}>Senaste nytt</MaskedLine>
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-40" data-testid="news-list">
        {posts === null ? (
          <div className="flex justify-center py-20" data-testid="news-loading">
            <Loader2 className="h-8 w-8 animate-spin text-vent-blue" />
          </div>
        ) : posts.length === 0 ? (
          <p className="py-20 text-center text-vent-navy/60" data-testid="news-empty">Inga nyheter publicerade ännu.</p>
        ) : (
          <div className="grid gap-x-10 gap-y-24 md:grid-cols-2">
            {posts.map((p, i) => (
              <Reveal key={p.id} delay={(i % 2) * 0.12} className={i % 2 === 1 ? "md:mt-24" : ""}>
                <Link to={`/nyheter/${p.id}`} className="group block" data-testid={`news-card-${p.id}`}>
                  {p.image_url && (
                    <ClipReveal src={p.image_url} alt={p.title} className="aspect-[4/3]" testId={`news-image-${p.id}`} />
                  )}
                  <p className="mt-6 font-mono text-xs uppercase tracking-[0.25em] text-vent-blue">{formatDate(p.date)}</p>
                  <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-vent-navy transition-colors duration-300 group-hover:text-vent-blue sm:text-3xl">
                    {p.title}
                  </h2>
                  {p.preamble && <p className="mt-3 text-base leading-relaxed text-vent-navy/70">{p.preamble}</p>}
                  <span className="mt-5 inline-flex items-center gap-2 border-b-2 border-vent-blue pb-1 text-sm font-semibold text-vent-navy transition-colors duration-300 group-hover:text-vent-blue">
                    Läs mer
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
