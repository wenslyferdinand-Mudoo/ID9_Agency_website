import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import api from "@/lib/api";
import FinalCTA from "@/components/sections/FinalCTA";

export default function PortfolioDetailPage() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api
      .get(`/portfolio/${slug}`)
      .then((r) => setItem(r.data))
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound)
    return (
      <main className="min-h-screen pt-40 px-6 max-w-4xl mx-auto">
        <p className="text-white/60">Project not found.</p>
        <Link to="/portfolio" className="text-orange_impact underline mt-4 inline-block">
          ← Back to work
        </Link>
      </main>
    );
  if (!item) return <main className="min-h-screen pt-40 text-center text-white/50">Loading…</main>;

  return (
    <main data-testid="portfolio-detail" className="pt-32 md:pt-40 pb-0">
      <section className="px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-white/60 hover:text-orange_impact font-ui text-sm mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> All work
          </Link>
          <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.3em] mb-6">
            {item.category} · {item.year || "—"}
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.98] max-w-4xl text-balance">
            {item.title}
          </h1>
          <p className="mt-8 max-w-3xl font-inter text-white/70 text-lg leading-relaxed">
            {item.summary}
          </p>
        </div>
      </section>

      <section className="px-4 md:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl overflow-hidden aspect-[16/9]">
            <img src={item.cover_image} alt={item.title} className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <section className="px-4 md:px-8 py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-10">
          <aside className="md:col-span-4 space-y-8">
            <div>
              <p className="text-white/40 font-ui text-xs uppercase tracking-[0.25em] mb-2">Client</p>
              <p className="font-display text-xl font-bold">{item.client || "—"}</p>
            </div>
            <div>
              <p className="text-white/40 font-ui text-xs uppercase tracking-[0.25em] mb-2">Year</p>
              <p className="font-display text-xl font-bold">{item.year || "—"}</p>
            </div>
            <div>
              <p className="text-white/40 font-ui text-xs uppercase tracking-[0.25em] mb-2">Services</p>
              <ul className="space-y-1">
                {(item.services || []).map((s) => (
                  <li key={s} className="text-white/80 font-inter">— {s}</li>
                ))}
              </ul>
            </div>
          </aside>
          <div className="md:col-span-8 space-y-10 font-inter text-white/75 text-lg leading-relaxed">
            {item.description && <p>{item.description}</p>}
            {item.challenge && (
              <div>
                <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.25em] mb-2">Challenge</p>
                <p>{item.challenge}</p>
              </div>
            )}
            {item.strategy && (
              <div>
                <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.25em] mb-2">Strategy</p>
                <p>{item.strategy}</p>
              </div>
            )}
            {item.outcome && (
              <div>
                <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.25em] mb-2">Outcome</p>
                <p className="text-white font-display font-bold text-2xl tracking-tight">{item.outcome}</p>
              </div>
            )}
            {item.testimonial && (
              <blockquote className="font-display text-2xl md:text-3xl font-bold tracking-tight leading-tight border-l-2 border-orange_impact pl-6">
                "{item.testimonial}"
              </blockquote>
            )}
          </div>
        </div>
      </section>

      {item.gallery?.length > 0 && (
        <section className="px-4 md:px-8 pb-20">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-5">
            {item.gallery.map((g, i) => (
              <div key={i} className="rounded-3xl overflow-hidden aspect-[4/3]">
                <img src={g} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="px-4 md:px-8 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 glass rounded-3xl p-8">
          <p className="font-display text-2xl md:text-3xl font-bold tracking-tight">
            Have a brief that deserves this level of craft?
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-orange_impact text-ink-900 font-ui font-semibold px-6 py-3 rounded-full"
          >
            Start a project <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <FinalCTA />
    </main>
  );
}
