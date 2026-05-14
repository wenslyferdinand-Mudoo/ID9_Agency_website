import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import RevealText from "@/components/site/RevealText";
import { useI18n } from "@/lib/i18n";

const TESTIMONIALS = [
  {
    qEn: "ID9 didn't just redesign our brand — they reframed our entire business. Inbound leads tripled in 90 days.",
    qFr: "ID9 n'a pas seulement redessiné notre marque — ils ont repositionné toute notre activité. Les leads entrants ont triplé en 90 jours.",
    a: "Élise R.",
    rEn: "Founder, Lumen Studio",
    rFr: "Fondatrice, Lumen Studio",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  },
  {
    qEn: "An experience our investors describe as 'in a different league'. The platform pays for itself every month.",
    qFr: "Une expérience que nos investisseurs qualifient de « d'un autre niveau ». La plateforme se rembourse chaque mois.",
    a: "Marc D.",
    rEn: "Managing Partner, Atlas Capital",
    rFr: "Associé Gérant, Atlas Capital",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    qEn: "Booking became part of the experience. Direct bookings up 186% in the first quarter post-launch.",
    qFr: "La réservation est devenue partie de l'expérience. Les réservations directes ont bondi de 186% au premier trimestre après le lancement.",
    a: "Naïka P.",
    rEn: "Director, Noir Hotel Group",
    rFr: "Directrice, Noir Hotel Group",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
  },
  {
    qEn: "ID9 ships like a senior product team. We onboarded 2,400 teams in 90 days.",
    qFr: "ID9 livre comme une équipe produit senior. Nous avons onboardé 2 400 équipes en 90 jours.",
    a: "Sam K.",
    rEn: "Co-founder, Vortex Labs",
    rFr: "Co-fondateur, Vortex Labs",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
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

        <div className="grid md:grid-cols-2 gap-5">
          {TESTIMONIALS.map((it, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="relative glass rounded-3xl p-8 md:p-10"
              data-testid={`testimonial-${i}`}
            >
              <Quote className="absolute top-8 right-8 w-8 h-8 text-orange_impact/40" />
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, k) => (
                  <Star key={k} className="w-4 h-4 fill-orange_impact text-orange_impact" />
                ))}
              </div>
              <blockquote className="font-display text-2xl md:text-[28px] font-bold leading-tight tracking-tight text-balance">
                "{lang === "fr" ? it.qFr : it.qEn}"
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                <img
                  src={it.img}
                  alt={it.a}
                  className="w-12 h-12 rounded-full object-cover border border-white/10"
                />
                <div>
                  <p className="font-ui font-semibold">{it.a}</p>
                  <p className="text-white/50 text-sm font-inter">{lang === "fr" ? it.rFr : it.rEn}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
