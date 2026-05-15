import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import RevealText from "@/components/site/RevealText";
import { useI18n } from "@/lib/i18n";

const TESTIMONIALS = [
  {
    qEn: "Working with ID9 has been a pleasure. Their professionalism and dedication exceeded all expectations. A trusted partner in elevating our digital presence — exceptional work, invaluable asset to our company's success.",
    qFr: "Collaborer avec ID9 a été un véritable plaisir. Leur professionnalisme et leur dévouement ont dépassé toutes les attentes. Un partenaire de confiance pour élever notre présence digitale — un travail exceptionnel.",
    a: "Holmanne Jr. Detes",
    rEn: "CEO, Detes Transport Services",
    rFr: "PDG, Detes Transport Services",
    initials: "HD",
  },
  {
    qEn: "Their website design exceeded my expectations — visually stunning, user-friendly, and perfectly captures the essence of our brand. The logo package they created has become integral to our brand identity. Reliable, creative, results-driven.",
    qFr: "Le design de notre site a dépassé mes attentes — visuellement remarquable, ergonomique, capturant parfaitement l'essence de notre marque. Le pack logo créé est devenu central à notre identité. Fiable, créatif, orienté résultats.",
    a: "Ted Erwin Loreus",
    rEn: "CEO, Drip7 Store",
    rFr: "PDG, Drip7 Store",
    initials: "TL",
  },
  {
    qEn: "From initial consultation to final delivery, the team demonstrated unparalleled professionalism, creativity, and attention to detail. Their innovative approach to rebranding has revitalized Theo Photography with a fresh, modern identity.",
    qFr: "De la consultation initiale à la livraison finale, l'équipe a fait preuve d'un professionnalisme, d'une créativité et d'une attention aux détails sans égal. Leur approche innovante du rebranding a revitalisé Theo Photography.",
    a: "Theo Photography LLC",
    rEn: "Founder, Theo Photography",
    rFr: "Fondateur, Theo Photography",
    initials: "TP",
  },
  {
    qEn: "We love working with ID9. They are very professional and skilled. Would definitely recommend them to anyone seeking a reliable, creative partner for branding and digital growth.",
    qFr: "Nous adorons collaborer avec ID9. Très professionnels et talentueux. Nous les recommandons sans hésiter à toute marque en quête d'un partenaire créatif fiable.",
    a: "Dinie's Closet LLC",
    rEn: "Founder",
    rFr: "Fondatrice",
    initials: "DC",
  },
  {
    qEn: "I had a great experience designing my logo with ID9. The process was easy and straightforward, with excellent communication throughout. The price was reasonable, and the result was fantastic.",
    qFr: "Excellente expérience pour la création de mon logo avec ID9. Processus simple et fluide, communication remarquable, prix juste et résultat fantastique. Hautement recommandé.",
    a: "Media PXL",
    rEn: "Founder, Media PXL",
    rFr: "Fondateur, Media PXL",
    initials: "MX",
  },
  {
    qEn: "Their creativity exceeded our expectations and the Visual Identity they crafted brought a unique dimension to our brand automatically. We highly recommend their expertise to anyone looking to bring their business to life through design.",
    qFr: "Leur créativité a dépassé nos attentes et l'Identité Visuelle créée a apporté une dimension unique à notre marque. Nous recommandons vivement leur expertise à toutes les marques qui veulent prendre vie par le design.",
    a: "Découvrir la Grand'Anse",
    rEn: "Brand Team",
    rFr: "Équipe Marque",
    initials: "GA",
  },
];

export default function Testimonials() {
  const { t, lang } = useI18n();
  return (
    <section className="relative py-28 md:py-40 px-4 md:px-8 overflow-hidden" data-testid="testimonials-section">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.3em] mb-6">
            {t("ts.tag")}
          </p>
          <RevealText
            as="h2"
            text={t("ts.h1")}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.02]"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((it, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="relative glass rounded-3xl p-7 md:p-8 flex flex-col"
              data-testid={`testimonial-${i}`}
            >
              <Quote className="absolute top-6 right-6 w-7 h-7 text-orange_impact/40" />
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, k) => (
                  <Star key={k} className="w-3.5 h-3.5 fill-orange_impact text-orange_impact" />
                ))}
              </div>
              <blockquote className="font-display text-lg md:text-xl font-bold leading-snug tracking-tight text-balance flex-1">
                "{lang === "fr" ? it.qFr : it.qEn}"
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-3 pt-5 border-t border-white/[0.06]">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange_impact to-gold_light grid place-items-center font-display font-black text-ink-900 text-sm">
                  {it.initials}
                </div>
                <div>
                  <p className="font-ui font-semibold text-sm">{it.a}</p>
                  <p className="text-white/50 text-xs font-inter">{lang === "fr" ? it.rFr : it.rEn}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
