import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api from "@/lib/api";
import FinalCTA from "@/components/sections/FinalCTA";

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
        <h2 key={i} className="font-display text-3xl md:text-4xl font-bold tracking-tight mt-12 mb-4">
          {ln.replace(/^##\s+/, "")}
        </h2>
      );
    } else if (/^#\s+/.test(ln)) {
      out.push(
        <h1 key={i} className="font-display text-4xl font-black tracking-tighter mt-12 mb-4">
          {ln.replace(/^#\s+/, "")}
        </h1>
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
  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);
  useEffect(() => {
    api
      .get(`/blog/${slug}`)
      .then((r) => setPost(r.data))
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound)
    return (
      <main className="min-h-screen pt-40 px-6 max-w-4xl mx-auto">
        <p className="text-white/60">Post not found.</p>
        <Link to="/blog" className="text-orange_impact underline mt-4 inline-block">
          ← Back to journal
        </Link>
      </main>
    );
  if (!post) return <main className="min-h-screen pt-40 text-center text-white/50">Loading…</main>;

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
          <h1 className="font-display text-4xl md:text-6xl font-black tracking-tighter leading-[1.02] text-balance">
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
