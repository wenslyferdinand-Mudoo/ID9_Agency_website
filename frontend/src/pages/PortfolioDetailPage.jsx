import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Quote, Wrench, Target, Lightbulb, Rocket, TrendingUp } from "lucide-react";
import api from "@/lib/api";
import { fetchPortfolioBySlug } from "@/lib/portfolio";
import FinalCTA from "@/components/sections/FinalCTA";
import RevealText from "@/components/site/RevealText";
import { useI18n } from "@/lib/i18n";
import { getFounderProjectBySlug } from "@/lib/founder-projects";

export default function PortfolioDetailPage() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const { lang } = useI18n();
  const heroRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroScale = useTransform(scrollYProgress, [0, 1], reduceMotion ? [1, 1] : [1, 1.18]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], reduceMotion ? [1, 1] : [1, 0.45]);
  const titleY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, 120]);

  useEffect(() => {
    let cancelled = false;

    // Clear the previous route's state and ignore responses from stale requests.
    setItem(null);
    setNotFound(false);

    async function loadProject() {
      try {
        // Founder products have local case-study content; CMS projects remain unchanged.
        const doc = await fetchPortfolioBySlug(slug);
        if (cancelled) return;
        if (doc && typeof doc === "object") {
          setItem(doc);
          return;
        }

        const founderProject = getFounderProjectBySlug(slug, lang);
        if (founderProject) {
          setItem(founderProject);
          return;
        }

        const response = await api.get(`/portfolio/${slug}`);
        if (cancelled) return;
        if (response?.data && typeof response.data === "object") {
          setItem(response.data);
        } else {
          setNotFound(true);
        }
      } catch {
        if (!cancelled) setNotFound(true);
      }
    }

    loadProject();

    return () => {
      cancelled = true;
    };
  }, [slug, lang]);

  if (notFound)
    return (
      <main className="min-h-screen pt-32 md:pt-40 px-4 sm:px-6 max-w-4xl mx-auto">
        <p className="text-white/60">{lang === "fr" ? "Projet introuvable." : "Project not found."}</p>
        <Link to="/portfolio" className="text-orange_impact underline mt-4 inline-block">
          ← {lang === "fr" ? "Retour aux projets" : "Back to work"}
        </Link>
      </main>
    );
  if (!item)
    return <main className="min-h-screen pt-40 text-center text-white/50">Loading…</main>;

  const L = (fr, en) => (lang === "fr" ? fr : en);
  const externalLinks = getProjectExternalLinks(item);
  const projectTools = Array.isArray(item.tools) ? item.tools.filter((tool) => typeof tool === "string" && tool.trim()) : [];
  const projectGallery = Array.isArray(item.gallery) ? item.gallery : [];
  const projectKpis = Array.isArray(item.kpis) ? item.kpis.filter((kpi) => kpi && typeof kpi === "object") : [];

  return (
    <main data-testid="portfolio-detail" className="pb-0 bg-ink-900">
      {/* ============ CINEMATIC HERO ============ */}
      <section
        ref={heroRef}
        className="relative h-[100svh] min-h-[min(640px,100svh)] w-full overflow-hidden"
        data-testid="case-hero"
      >
        <motion.div
          className="absolute inset-0"
          style={{ scale: heroScale, opacity: heroOpacity }}
        >
          {item.cover_image ? (
            <img
              src={item.cover_image}
              alt={item.title || ""}
              className="h-full w-full object-cover"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          ) : (
            <div className="w-full h-full grid place-items-center bg-[radial-gradient(circle_at_20%_25%,rgba(255,135,22,0.3),transparent_38%),radial-gradient(circle_at_80%_75%,rgba(111,29,157,0.48),transparent_42%),linear-gradient(135deg,#17131f,#09090d)]">
              <span className="font-display text-[min(34vw,20rem)] font-black tracking-tighter text-white/90">{item.monogram || item.title.slice(0, 2)}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-ink-900/40 via-ink-900/30 to-ink-900" />
          <div className="absolute inset-0 bg-gradient-to-tr from-ink-900/60 via-transparent to-transparent" />
        </motion.div>

        <motion.div
          className="absolute inset-0 flex flex-col justify-end px-6 md:px-12 lg:px-20 pb-16 md:pb-24"
          style={{ y: titleY }}
        >
          <Link
            to="/portfolio"
            className="self-start mb-10 inline-flex items-center gap-2 text-white/70 hover:text-orange_impact font-ui text-sm glass rounded-full px-4 py-2 backdrop-blur-md transition-colors"
            data-testid="case-back-link"
          >
            <ArrowLeft className="w-4 h-4" /> {L("Tous les projets", "All work")}
          </Link>

          <div className="max-w-5xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-orange_impact font-ui text-xs uppercase tracking-[0.35em] mb-6 flex items-center gap-3 flex-wrap"
            >
              <span>{item.sector || item.category}</span>
              <span className="w-1 h-1 rounded-full bg-orange_impact" />
              <span>{item.year}</span>
              {item.status && (
                <>
                  <span className="w-1 h-1 rounded-full bg-orange_impact" />
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 tracking-[0.12em]">{item.status}</span>
                </>
              )}
              {item.client && (
                <>
                  <span className="w-1 h-1 rounded-full bg-orange_impact" />
                  <span>{item.client}</span>
                </>
              )}
            </motion.p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-[6.5rem] font-black tracking-[-0.04em] leading-[1.02] md:leading-[0.92] text-balance">
              <RevealText as="span" text={item.title} stagger={0.04} />
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8 max-w-3xl font-inter text-white/80 text-lg md:text-xl leading-relaxed"
            >
              {item.summary}
            </motion.p>
          </div>
        </motion.div>

        {/* scroll hint */}
        <motion.div
          className="absolute bottom-8 right-8 hidden lg:flex items-center gap-2 text-white/40 font-ui text-[11px] uppercase tracking-[0.3em]"
          animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
          transition={reduceMotion ? undefined : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {L("Faire défiler", "Scroll")} ↓
        </motion.div>
      </section>

      {/* ============ META BAR ============ */}
      <section className="border-y border-white/[0.06] bg-ink-800/40 backdrop-blur-sm">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-2 sm:px-6 md:grid-cols-4 md:gap-8 md:px-12">
          <MetaBlock label={L("Client", "Client")} value={item.client} />
          <MetaBlock label={L("Secteur", "Sector")} value={item.sector || item.category} />
          <MetaBlock label={L("Année", "Year")} value={item.year} />
          <MetaBlock
            label={L("Services", "Services")}
            value={
              Array.isArray(item.services) && item.services.length > 0
                ? item.services.slice(0, 2).join(" · ") +
                  (item.services.length > 2 ? ` +${item.services.length - 2}` : "")
                : ""
            }
          />
        </div>
      </section>

      {/* ============ STORY: CHALLENGE → APPROACH → STRATEGY → SOLUTION ============ */}
      <section className="px-6 md:px-12 lg:px-20 py-24 md:py-36 max-w-7xl mx-auto">
        {item.description && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mb-28 max-w-4xl"
          >
            <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.3em] mb-6">
              {L("Contexte", "Context")}
            </p>
            <p className="font-display text-2xl md:text-3xl lg:text-4xl font-bold leading-[1.2] tracking-tight text-balance">
              {item.description}
            </p>
          </motion.div>
        )}

        <div className="space-y-24">
          <StoryBlock
            icon={Target}
            label={L("Le défi", "The Challenge")}
            number="01"
            text={item.challenge}
          />
          <StoryBlock
            icon={Lightbulb}
            label={L("L'approche", "Our Approach")}
            number="02"
            text={item.approach}
          />
          <StoryBlock
            icon={Rocket}
            label={L("La stratégie", "The Strategy")}
            number="03"
            text={item.strategy}
          />
          <StoryBlock
            icon={Wrench}
            label={L("La solution", "The Solution")}
            number="04"
            text={item.solution}
          />
        </div>
      </section>

      {/* ============ TOOLS ============ */}
      {projectTools.length > 0 && (
        <section className="border-y border-white/[0.06] bg-gradient-to-r from-ink-800/40 via-ink-900 to-ink-800/40 py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.3em] mb-6">
              {L("Outils utilisés", "Tools Used")}
            </p>
            <div className="flex flex-wrap gap-3">
              {projectTools.map((tool, i) => (
                <motion.span
                  key={tool}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="glass-strong rounded-full px-5 py-2.5 font-ui text-sm font-semibold tracking-wide"
                  data-testid={`case-tool-${i}`}
                >
                  {tool}
                </motion.span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ GALLERY — BENTO GRID ============ */}
      {projectGallery.length > 0 && (
        <section className="px-6 md:px-12 lg:px-20 py-24 md:py-32 max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.3em] mb-4">
              {L("Galerie", "Gallery")}
            </p>
            <h2 className="font-display text-4xl md:text-6xl font-black tracking-tighter">
              {L("Le projet en images.", "The work in detail.")}
            </h2>
          </div>
          <BentoGallery images={projectGallery} title={item.title || "Project"} />
        </section>
      )}

      {/* ============ PROJECT EXTERNAL LINKS ============ */}
      {externalLinks.length > 0 && (
        <section
          className="border-y border-white/[0.06] bg-ink-800/25 px-6 py-20 md:px-12 md:py-24"
          data-testid="case-external-links"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-2xl">
              <p className="mb-4 font-ui text-xs uppercase tracking-[0.3em] text-orange_impact">
                {L("Ressources", "Resources")}
              </p>
              <h2 className="font-display text-3xl font-black tracking-tight md:text-5xl">
                {L("Explorer le projet.", "Explore this project.")}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/55 md:text-base">
                {L(
                  "Retrouvez les sites officiels, profils sociaux et ressources publiques associés à ce projet.",
                  "Visit the official websites, social profiles and public resources related to this project."
                )}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {externalLinks.map((link, index) => (
                <a
                  key={link._key || link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={L(
                    "Ouvrir " + link.label + " dans un nouvel onglet",
                    "Open " + link.label + " in a new tab"
                  )}
                  className="group flex min-h-20 items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 transition-colors hover:border-orange_impact/50 hover:bg-white/[0.07]"
                  data-testid={"case-external-link-" + index}
                >
                  <span className="min-w-0">
                    {link.platform && (
                      <span className="mb-1 block font-ui text-[10px] uppercase tracking-[0.2em] text-white/40">
                        {link.platform.replace(/-/g, " ")}
                      </span>
                    )}
                    <span className="block truncate font-ui text-sm font-semibold text-white/85 transition-colors group-hover:text-white">
                      {link.label}
                    </span>
                    {link.description && (
                      <span className="mt-1 block text-xs leading-relaxed text-white/45">
                        {link.description}
                      </span>
                    )}
                  </span>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-orange_impact transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ KPIS / RESULTS ============ */}
      {(projectKpis.length > 0 || item.outcome) && (
        <section className="relative px-6 md:px-12 lg:px-20 py-24 md:py-36 overflow-hidden">
          <div className="absolute inset-0 opacity-50 pointer-events-none">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(800px circle at 30% 50%, rgba(255,165,0,0.18), transparent 60%), radial-gradient(700px circle at 75% 70%, rgba(116,48,137,0.22), transparent 60%)",
              }}
            />
          </div>
          <div className="relative max-w-7xl mx-auto">
            <div className="mb-16 flex items-end gap-4">
              <TrendingUp className="w-8 h-8 text-orange_impact mb-2" />
              <div>
                <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.3em] mb-3">
                  {L("Résultats", "Results")}
                </p>
                <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1]">
                  {L("Ce que nous avons livré.", "What we delivered.")}
                </h2>
              </div>
            </div>

            {projectKpis.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
                {projectKpis.map((k, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className="glass rounded-3xl p-6 md:p-8"
                    data-testid={`case-kpi-${i}`}
                  >
                    <p className="mb-3 font-display text-4xl font-black leading-none text-gradient-gold md:text-6xl">
                      {k.value || "—"}
                    </p>
                    <p className="font-ui text-xs uppercase tracking-[0.18em] text-white/65 md:text-sm">
                      {k.label || ""}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}

            {item.outcome && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="font-display text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight max-w-4xl leading-tight text-balance"
              >
                {item.outcome}
              </motion.p>
            )}
          </div>
        </section>
      )}

      {/* ============ TESTIMONIAL ============ */}
      {item.testimonial && (
        <section className="px-6 md:px-12 py-20 md:py-28 border-t border-white/[0.06]">
          <div className="max-w-5xl mx-auto text-center">
            <Quote className="w-12 h-12 text-orange_impact/50 mx-auto mb-8" />
            <motion.blockquote
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-balance"
            >
              "{item.testimonial}"
            </motion.blockquote>
            {item.client && (
              <p className="mt-8 font-ui text-sm uppercase tracking-[0.25em] text-white/55">
                — {item.client}
              </p>
            )}
          </div>
        </section>
      )}

      {/* ============ NEXT CTA ============ */}
      <section className="px-6 md:px-12 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 glass-strong rounded-3xl p-8 md:p-12">
          <div>
            <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.3em] mb-3">
              {L("Et vous ?", "Next.")}
            </p>
            <p className="font-display text-2xl md:text-4xl font-black tracking-tight leading-tight text-balance">
              {L("Votre marque mérite ce niveau de soin.", "Your brand deserves this level of craft.")}
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-orange_impact text-ink-900 font-ui font-semibold px-7 py-4 rounded-full hover:bg-gold_light transition-colors whitespace-nowrap"
            data-testid="case-cta-start"
          >
            {L("Démarrer un projet", "Start a project")} <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <FinalCTA />
    </main>
  );
}

/* ---------- helpers ---------- */
function getProjectExternalLinks(item) {
  const entries = Array.isArray(item?.externalLinks)
    ? item.externalLinks
    : Array.isArray(item?.external_links)
      ? item.external_links
      : [];

  return entries
    .map((entry) => {
      const rawUrl = typeof entry?.url === "string" ? entry.url.trim() : "";
      let url = "";
      try {
        const parsed = new URL(rawUrl);
        if (["http:", "https:"].includes(parsed.protocol)) url = parsed.href;
      } catch {
        // Do not render malformed or unsafe external destinations.
      }

      return {
        _key: entry?._key,
        label:
          typeof entry?.label === "string" && entry.label.trim()
            ? entry.label.trim()
            : typeof entry?.platform === "string"
              ? entry.platform
              : "",
        platform: typeof entry?.platform === "string" ? entry.platform : "",
        url,
        description: typeof entry?.description === "string" ? entry.description.trim() : "",
      };
    })
    .filter((entry) => entry.label && entry.url);
}

function MetaBlock({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-white/35 font-ui text-[10px] uppercase tracking-[0.28em] mb-2">{label}</p>
      <p className="font-display text-lg md:text-xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

function StoryBlock({ icon: Icon, label, number, text }) {
  if (!text) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="grid md:grid-cols-12 gap-8 md:gap-12 items-start"
    >
      <div className="md:col-span-4 flex md:flex-col items-start gap-4 md:gap-6">
        <span className="font-display text-7xl md:text-8xl font-black text-gradient-gold leading-none">
          {number}
        </span>
        <div className="flex items-center gap-3 md:mt-2">
          <Icon className="w-5 h-5 text-orange_impact" />
          <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.3em]">{label}</p>
        </div>
      </div>
      <div className="md:col-span-8">
        <p className="font-inter text-xl md:text-2xl text-white/85 leading-relaxed font-light">
          {text}
        </p>
      </div>
    </motion.div>
  );
}

function BentoGallery({ images, title }) {
  const list = Array.isArray(images) ? images : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
      {list.map((entry, i) => {
        // Sanity gallery items carry editorial metadata; legacy API items are URL strings.
        const image = typeof entry === "string" ? { url: entry } : entry || {};
        const src = image.url || image.src || "";
        if (!src) return null;

        return (
          <motion.figure
            key={image._key || `${src}-${i}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.8,
              delay: (i % 3) * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-ink-800"
            data-testid={`case-gallery-${i}`}
          >
            <motion.img
              src={src}
              alt={image.alt || `${title} — ${i + 1}`}
              loading="lazy"
              className="block w-full h-auto object-contain"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            />
            {image.caption && (
              <figcaption className="px-4 py-3 text-sm leading-relaxed text-white/65">
                {image.caption}
              </figcaption>
            )}
          </motion.figure>
        );
      })}
    </div>
  );
}
