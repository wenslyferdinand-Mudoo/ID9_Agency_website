import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import RevealText from "@/components/site/RevealText";
import { useI18n } from "@/lib/i18n";

const TESTIMONIALS = [
  {
    qEn: "ID9 transformed our brand into a premium identity that finally reflects who we are. The Visual Identity work was rigorous, the strategy bold, and the execution flawless. Our visibility shifted overnight.",
    qFr: "ID9 a transformé notre marque en une identité premium qui reflète enfin qui nous sommes. Le travail d'identité visuelle a été rigoureux, la stratégie audacieuse et l'exécution irréprochable. Notre visibilité a basculé du jour au lendemain.",
    a: "Mooje",
    rEn: "Fashion & Lifestyle Brand",
    rFr: "Marque Mode & Lifestyle",
    initials: "MJ",
  },
  {
    qEn: "Working with ID9 has been a pleasure. Their professionalism and dedication exceeded all expectations. A trusted partner in elevating our digital presence — exceptional work, invaluable to our growth.",
    qFr: "Collaborer avec ID9 a été un véritable plaisir. Leur professionnalisme et leur dévouement ont dépassé toutes nos attentes. Un partenaire de confiance pour élever notre présence digitale — un travail exceptionnel, inestimable pour notre croissance.",
    a: "MW Event & Déco",
    rEn: "Event & Décor Studio",
    rFr: "Studio Événementiel & Décoration",
    initials: "MW",
  },
  {
    qEn: "From initial consultation to final delivery, the ID9 team demonstrated unparalleled creativity and attention to detail. Their innovative approach to rebranding revitalized our identity with a fresh, modern look.",
    qFr: "De la consultation initiale à la livraison finale, l'équipe ID9 a fait preuve d'une créativité et d'une attention aux détails sans égal. Leur approche innovante du rebranding a revitalisé notre identité avec un look frais et moderne.",
    a: "Akya Dance Company",
    rEn: "Markenley Georges, Director",
    rFr: "Markenley Georges, Directeur",
    initials: "AD",
  },
  {
    qEn: "ID9 understood our ministry's vision and translated it into a logo and visual language that honors who we are. The new MENNHA identity now resonates with every member of our church family.",
    qFr: "ID9 a compris la vision de notre ministère et l'a traduite en un logo et un langage visuel qui honore qui nous sommes. La nouvelle identité MENNHA résonne désormais avec chaque membre de notre famille d'église.",
    a: "MENNHA",
    rEn: "Church Leadership",
    rFr: "Direction de l'Église",
    initials: "MN",
  },
  {
    qEn: "Their website design exceeded our expectations — visually stunning, user-friendly, and perfectly captures the essence of our brand. The logo package created has become integral to our identity. Reliable, creative, results-driven.",
    qFr: "Le design de notre site a dépassé nos attentes — visuellement remarquable, ergonomique, capturant parfaitement l'essence de notre marque. Le pack logo créé est devenu central à notre identité. Fiable, créatif, orienté résultats.",
    a: "Les Délices de Douty",
    rEn: "Founder, Pastry & Catering",
    rFr: "Fondatrice, Pâtisserie & Traiteur",
    initials: "LD",
  },
  {
    qEn: "ID9 brought a fresh strategic perspective to RTCI. Our radio-tele network now communicates with the visual authority we needed to expand our international audience. Highly professional, highly impactful.",
    qFr: "ID9 a apporté une perspective stratégique nouvelle à RTCI. Notre réseau radio-télé communique désormais avec l'autorité visuelle dont nous avions besoin pour développer notre audience internationale. Hautement professionnel, hautement impactant.",
    a: "RTCI",
    rEn: "Radio Télé Consolation International",
    rFr: "Radio Télé Consolation International",
    initials: "RT",
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
