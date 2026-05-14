import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import api from "@/lib/api";
import RevealText from "@/components/site/RevealText";
import FinalCTA from "@/components/sections/FinalCTA";
import { useI18n } from "@/lib/i18n";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const { t } = useI18n();
  useEffect(() => {
    api.get("/blog").then((r) => setPosts(r.data)).catch(() => {});
  }, []);

  const featured = posts.find((p) => p.featured) || posts[0];
  const rest = posts.filter((p) => p.id !== featured?.id);

  return (
    <main data-testid="blog-page" className="pt-32 md:pt-40">
      <section className="px-4 md:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.3em] mb-6">{t("bp.tag")}</p>
          <RevealText
            as="h1"
            text={t("bp.h1")}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.98]"
          />
          <RevealText
            as="h1"
            text={t("bp.h2")}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.98] italic"
            delay={0.1}
          />
        </div>
      </section>

      {featured && (
        <section className="px-4 md:px-8 pb-16">
          <div className="max-w-7xl mx-auto">
            <Link
              to={`/blog/${featured.slug}`}
              className="group grid md:grid-cols-12 gap-8 items-center"
              data-testid="blog-featured"
            >
              <div className="md:col-span-7 aspect-[16/10] rounded-3xl overflow-hidden">
                <img
                  src={featured.cover_image}
                  alt={featured.title}
                  className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                />
              </div>
              <div className="md:col-span-5">
                <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.25em] mb-4">
                  {t("bp.featured")} · {featured.category}
                </p>
                <h2 className="font-display text-3xl md:text-5xl font-black tracking-tighter leading-[1.05] group-hover:text-gradient-gold transition-colors text-balance">
                  {featured.title}
                </h2>
                <p className="mt-5 text-white/70 font-inter leading-relaxed">{featured.excerpt}</p>
                <p className="mt-6 font-ui text-sm text-white/50">
                  {featured.author} · {featured.read_time}
                </p>
              </div>
            </Link>
          </div>
        </section>
      )}

      <section className="px-4 md:px-8 pb-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
          {rest.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.7 }}
              className="group"
              data-testid={`blog-card-${p.slug}`}
            >
              <Link to={`/blog/${p.slug}`}>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-5">
                  <img
                    src={p.cover_image}
                    alt={p.title}
                    className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[1200ms]"
                  />
                </div>
                <p className="text-orange_impact font-ui text-[10px] uppercase tracking-[0.25em] mb-2">
                  {p.category}
                </p>
                <h3 className="font-display text-2xl font-bold tracking-tight leading-tight group-hover:text-orange_impact transition-colors">
                  {p.title}
                </h3>
                <p className="text-white/55 font-inter text-sm mt-3 line-clamp-2">{p.excerpt}</p>
                <div className="mt-4 flex items-center gap-2 text-white/40 font-ui text-xs">
                  {p.author} · {p.read_time}
                  <ArrowUpRight className="w-3 h-3 ml-auto group-hover:text-orange_impact transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <FinalCTA />
    </main>
  );
}
