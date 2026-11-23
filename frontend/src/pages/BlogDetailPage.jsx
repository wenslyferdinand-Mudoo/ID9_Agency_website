import { useEffect, useState } from "react";
import { markPageNoindex } from "@/lib/seo";
import { applyBlogArticleMetadata } from "@/lib/blog-seo";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api from "@/lib/api";
import FinalCTA from "@/components/sections/FinalCTA";
import { useI18n } from "@/lib/i18n";

function renderMarkdownLite(md) {
  // Minimal markdown rendering: ##, **, lists, paragraphs.
  const lines = md.split(/\r?\n/);
  const out = [];
  let listBuf = null;
  const flushList = () => {
    if (listBuf) {
      out.push(
        <ul key={`ul-${out.length}`} className="list-disc list-outside pl-6 space-y-2 my-4">
          {listBuf.map((it, i) => (
            <li key={i} className="text-white/75">
              {it}
            </li>
          ))}
        </ul>
      );
      listBuf = null;
    }
  };
  lines.forEach((ln, i) => {
    if (/^\s*[-*]\s+/.test(ln)) {
      listBuf = listBuf || [];
      listBuf.push(ln.replace(/^\s*[-*]\s+/, ""));
      return;
    }
    flushList();
    if (/^##\s+/.test(ln)) {
      out.push(
        <h3 key={i} className="font-display text-2xl md:text-3xl font-bold tracking-tight mt-10 mb-4">
          {ln.replace(/^##\s+/, "")}
        </h3>
      );
    } else if (/^#\s+/.test(ln)) {
      out.push(
        <h2 key={i} className="font-display text-3xl md:text-4xl font-bold tracking-tight mt-12 mb-4">
          {ln.replace(/^#\s+/, "")}
        </h2>
      );
    } else if (/^\s*\d+\.\s+/.test(ln)) {
      // numbered list: convert to li (simple)
      out.push(
        <p key={i} className="text-white/75 my-2 pl-6 -indent-6">
          {ln}
        </p>
      );
    } else if (ln.trim() === "") {
      out.push(<div key={i} className="h-3" />);
    } else {
      // **bold** support
      const parts = ln.split(/\*\*(.+?)\*\*/g);
      out.push(
        <p key={i} className="text-white/75 leading-relaxed my-2 text-lg">
          {parts.map((p, j) => (j % 2 ? <strong key={j} className="text-white">{p}</strong> : p))}
        </p>
      );
    }
  });
  flushList();
  return out;
}

export default function BlogDetailPage() {
  const { slug } = useParams();
  const { lang } = useI18n();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);
    setLoadError(false);
    setPost(null);

    api
      .get(`/blog/${slug}`, { timeout: 8000 })
      .then((r) => {
        if (active) setPost(r?.data || null);
      })
      .catch((error) => {
        if (!active) return;
        if (error?.response?.status === 404) setNotFound(true);
        else setLoadError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug, retryCount]);

  // Once the article resolves, replace generic blog metadata with article-specific SEO.
  useEffect(() => {
    if (!post || loading || notFound) return undefined;
    return applyBlogArticleMetadata(post, slug, lang);
  }, [post, loading, notFound, slug, lang]);

  // Blog slugs are routed through the SPA; an API 404 must not remain indexable.
  useEffect(() => {
    if (!notFound) return;
    markPageNoindex(lang === "fr"
      ? "Article introuvable — Impact Digital 9 Agency"
      : "Article not found — Impact Digital 9 Agency");
  }, [notFound, lang]);

  if (loading)
    return (
      <main className="min-h-screen pt-32 md:pt-40 px-4 text-center text-white/50" aria-live="polite" aria-busy="true">
        {lang === "fr" ? "Chargement de l’article…" : "Loading article…"}
      </main>
    );

  if (notFound || loadError || !post)
    return (
      <main className="min-h-screen pt-32 md:pt-40 px-4 sm:px-6 max-w-4xl mx-auto">
        <h1 className="font-display text-3xl font-bold text-white">
          {notFound
            ? (lang === "fr" ? "Article introuvable." : "Article not found.")
            : (lang === "fr" ? "Impossible de charger cet article." : "Unable to load this article.")}
        </h1>
        <p className="mt-3 text-white/60">
          {notFound
            ? (lang === "fr" ? "Cet article n’existe pas ou n’est plus disponible." : "This article does not exist or is no longer available.")
            : (lang === "fr" ? "Vérifiez votre connexion et réessayez." : "Check your connection and try again.")}
        </p>
        {!notFound && (
          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
            className="mt-6 inline-flex min-h-11 items-center rounded-full bg-orange_impact px-6 py-3 text-sm font-semibold text-ink-900"
          >
            {lang === "fr" ? "Réessayer" : "Try again"}
          </button>
        )}
        <Link to="/blog" className="text-orange_impact underline mt-4 inline-flex min-h-11 items-center">
          {lang === "fr" ? "← Retour au journal" : "← Back to journal"}
        </Link>
      </main>
    );

  return (
    <main data-testid="blog-detail" className="pt-32 md:pt-40">
      <section className="px-4 md:px-8 pb-10">
        <div className="max-w-3xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-2 text-white/60 hover:text-orange_impact font-ui text-sm mb-8">
            <ArrowLeft className="w-4 h-4" /> Journal
          </Link>
          <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.3em] mb-4">
            {post.category}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter leading-[1.06] md:leading-[1.02] text-balance">
            {post.title}
          </h1>
          <p className="mt-6 text-white/50 font-ui text-sm">
            {post.author} · {post.read_time} · {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>
      </section>

      <section className="px-4 md:px-8 pb-12">
        <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden aspect-[16/9]">
          <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
        </div>
      </section>

      <article className="px-4 md:px-8 pb-24">
        <div className="max-w-3xl mx-auto font-inter">{renderMarkdownLite(post.content)}</div>
      </article>

      <FinalCTA />
    </main>
  );
}
