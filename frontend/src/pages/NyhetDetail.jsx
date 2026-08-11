import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Reveal, MaskedLine } from "@/components/Reveal";
import { formatDate } from "./Nyheter";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function NyhetDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    axios
      .get(`${API}/news/${id}`)
      .then((res) => setPost(res.data))
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-60 text-center" data-testid="news-not-found">
        <h1 className="font-display text-4xl font-bold text-vent-navy">Nyheten hittades inte</h1>
        <Link to="/nyheter" className="mt-6 inline-block font-semibold text-vent-blue underline underline-offset-4">
          Tillbaka till nyheter
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center" data-testid="news-detail-loading">
        <Loader2 className="h-8 w-8 animate-spin text-vent-blue" />
      </div>
    );
  }

  return (
    <div data-testid="nyhet-detail-page">
      <section className="grain relative flex min-h-[50svh] items-end overflow-hidden bg-vent-dark">
        <div className="relative z-10 mx-auto w-full max-w-4xl px-6 pb-16 pt-44">
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.35em] text-vent-green">{formatDate(post.date)}</p>
          <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl" data-testid="news-detail-title">
            <MaskedLine delay={0.1}>{post.title}</MaskedLine>
          </h1>
        </div>
      </section>

      <article className="mx-auto max-w-4xl px-6 py-20 lg:py-28">
        {post.image_url && (
          <Reveal>
            <div className="overflow-hidden" data-testid="news-detail-image">
              <img src={post.image_url} alt={post.title} className="aspect-[16/9] w-full object-cover" />
            </div>
          </Reveal>
        )}
        <Reveal delay={0.1}>
          {post.preamble && (
            <p className="mt-12 text-lg font-medium leading-relaxed text-vent-navy md:text-xl" data-testid="news-detail-preamble">
              {post.preamble}
            </p>
          )}
          <div className="mt-8 space-y-6 text-base leading-relaxed text-vent-navy/75" data-testid="news-detail-body">
            {post.body.split(/\n\s*\n/).map((para, i) => (
              <p key={i} className="whitespace-pre-line">{para}</p>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <Link
            to="/nyheter"
            data-testid="news-detail-back"
            className="group mt-16 inline-flex items-center gap-2 border-b-2 border-vent-blue pb-1 font-semibold text-vent-navy transition-colors duration-300 hover:text-vent-blue"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Alla nyheter
          </Link>
        </Reveal>
      </article>
    </div>
  );
}
