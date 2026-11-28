import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, MessageCircle, MapPin, Instagram, Facebook, Music2, Check, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import api, { formatApiError } from "@/lib/api";
import { BRAND, whatsappLink } from "@/lib/brand";
import GlowOrb from "@/components/site/GlowOrb";
import RevealText from "@/components/site/RevealText";
import { useI18n } from "@/lib/i18n";

const BUDGETS = ["< $5k", "$5k – $15k", "$15k – $50k", "$50k – $150k", "$150k+"];
const SERVICES = [
  "Branding",
  "Web Development",
  "App Development",
  "UI/UX Design",
  "Digital Marketing",
  "SEO",
  "Motion Design",
  "Video Production",
  "Photography",
  "AI Solutions",
  "Other",
];
const SERVICE_LABELS = {
  "Branding": { en: "Branding", fr: "Identité de marque" },
  "Web Development": { en: "Web Development", fr: "Développement Web" },
  "App Development": { en: "App Development", fr: "Développement d’applications" },
  "UI/UX Design": { en: "UI/UX Design", fr: "Design UI/UX" },
  "Digital Marketing": { en: "Digital Marketing", fr: "Marketing digital" },
  "SEO": { en: "SEO", fr: "Référencement SEO" },
  "Motion Design": { en: "Motion Design", fr: "Motion design" },
  "Video Production": { en: "Video Production", fr: "Production vidéo" },
  "Photography": { en: "Photography", fr: "Photographie" },
  "AI Solutions": { en: "AI Solutions", fr: "Solutions IA" },
  "Other": { en: "Other", fr: "Autre" },
};
const SELECT_CLASS =
  "w-full min-h-12 bg-transparent border-0 border-b border-white/15 focus:border-orange_impact py-3 pr-8 outline-none font-inter text-base text-white transition-colors appearance-none cursor-pointer";

export default function ContactPage() {
  const { t, lang } = useI18n();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/contact" || location.hash !== "#contact-form") return;
    const timer = window.setTimeout(() => {
      const form = document.getElementById("contact-form");
      form?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      document.getElementById("contact-input-name")?.focus({ preventScroll: true });
    }, 120);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    budget: "",
    service: "",
    deadline: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [deliveryWarning, setDeliveryWarning] = useState(false);

  const onChange = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e?.target ? e.target.value : e }));

  const submit = async (e) => {
    e?.preventDefault?.();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error(t("co.requiredErr"));
      return;
    }
    setSubmitting(true);
    try {
      const payload = Object.fromEntries(
        Object.entries(form).map(([key, value]) => [key, typeof value === "string" ? value.trim() : value])
      );
      const response = await api.post("/contact", payload);
      setDeliveryWarning(response?.data?.email_status === "failed");
      setSent(true);
      toast.success(t("co.received"));
    } catch (e) {
      toast.error(formatApiError(e.response?.data?.detail) || t("co.couldNotSend"));
    } finally {
      setSubmitting(false);
    }
  };

  const waText = `Hello ID9_AGENCY! I'm ${form.name || "[name]"}. ${
    form.service ? `I'm interested in ${form.service}. ` : ""
  }${form.budget ? `Budget: ${form.budget}. ` : ""}${form.message || ""}`;

  return (
    <main data-testid="contact-page" className="pt-32 md:pt-40 pb-32 relative">
      <GlowOrb color="#743089" size={700} intensity={0.4} className="-top-20 -left-40" />
      <GlowOrb color="#FFA500" size={500} intensity={0.3} className="top-1/3 -right-40" delay={0.3} />

      <section className="relative px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.3em] mb-6">{t("co.tag")}</p>
          <RevealText
            as="h1"
            text={t("co.h1")}
            className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.04] md:leading-[0.98] text-balance"
          />
          <RevealText
            as="h2"
            text={t("co.h2")}
            className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.04] md:leading-[0.98] text-gradient-gold text-balance"
            delay={0.1}
          />

          <div className="mt-12 sm:mt-16 grid md:grid-cols-12 gap-8 sm:gap-10">
            <aside className="md:col-span-4 space-y-6 sm:space-y-8">
              <div>
                <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.25em] mb-2">Email</p>
                <a href={`mailto:${BRAND.email}`} className="inline-flex min-h-11 items-center font-display text-lg sm:text-xl md:text-2xl hover:text-orange_impact break-all">
                  {BRAND.email}
                </a>
              </div>
              <div>
                <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.25em] mb-2">WhatsApp</p>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 max-w-full flex-wrap items-center gap-2 font-display text-xl sm:text-2xl hover:text-orange_impact break-words"
                  data-testid="contact-whatsapp-link"
                >
                  {BRAND.whatsappDisplay} <MessageCircle className="w-5 h-5" />
                </a>
              </div>
              <div>
                <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.25em] mb-2">Social</p>
                <div className="flex flex-col gap-2 font-ui">
                  <a
                    href={BRAND.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 py-2 text-white/85 hover:text-orange_impact"
                  >
                    <Instagram className="w-4 h-4" /> Instagram · {BRAND.instagramHandle}
                  </a>
                  <a
                    href={BRAND.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 py-2 text-white/85 hover:text-orange_impact"
                  >
                    <Music2 className="w-4 h-4" /> TikTok · {BRAND.tiktokHandle}
                  </a>
                  <a
                    href={BRAND.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 py-2 text-white/85 hover:text-orange_impact"
                  >
                    <Facebook className="w-4 h-4" /> Facebook · {BRAND.facebookHandle}
                  </a>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.25em] mb-2">
                  {lang === "fr" ? "Zone d’intervention" : "Service area"}
                </p>
                <p className="font-display text-xl md:text-2xl inline-flex items-center gap-2">
                  <MapPin className="w-5 h-5" /> {BRAND.city}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  {lang === "fr"
                    ? "Agence à distance. Interventions sur site possibles selon le projet et la zone."
                    : "Remote-first agency. On-site work may be arranged depending on the project and location."}
                </p>
              </div>
            </aside>

            <div className="md:col-span-8 glass-strong relative overflow-hidden rounded-2xl p-4 sm:rounded-3xl sm:p-7 md:p-10 noise-overlay">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                  data-testid="contact-success"
                  role="status"
                  aria-live="polite"
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-orange_impact/15 border border-orange_impact/40 grid place-items-center mb-6">
                    <Check className="w-7 h-7 text-orange_impact" />
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl font-black tracking-tighter mb-3">
                    {t("co.success.h2")}
                  </h2>
                  <p className="text-white/70 font-inter max-w-md mx-auto">{t("co.success.body")}</p>
                  {deliveryWarning && (
                    <p className="text-amber-300/90 font-inter text-sm max-w-lg mx-auto mt-4" role="status">
                      {lang === "fr"
                        ? "Votre brief a bien été enregistré. La notification par e-mail n’a pas abouti, mais notre équipe conserve votre demande. Pour un suivi immédiat, contactez-nous sur WhatsApp."
                        : "Your brief was saved successfully. The email notification could not be delivered, but our team still has your request. Contact us on WhatsApp for immediate follow-up."}
                    </p>
                  )}
                  <a
                    href={whatsappLink(waText)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 bg-orange_impact text-ink-900 font-ui font-semibold px-6 py-3 rounded-full"
                    data-testid="contact-success-whatsapp"
                  >
                    {t("co.success.wa")} <ArrowUpRight className="w-4 h-4" />
                  </a>
                </motion.div>
              ) : (
                <form id="contact-form" tabIndex="-1" autoComplete="on" onSubmit={submit} className="space-y-6 scroll-mt-28 focus:outline-none" data-testid="contact-form" aria-busy={submitting}>
                  <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
                    <Field label={t("co.field.name")} name="name" value={form.name} onChange={onChange("name")} testid="contact-input-name" required autoComplete="name" />
                    <Field
                      label={t("co.field.email")}
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={onChange("email")}
                      testid="contact-input-email"
                      required
                      autoComplete="email"
                    />
                    <Field
                      label={t("co.field.whatsapp")}
                      name="whatsapp"
                      type="tel"
                      value={form.whatsapp}
                      onChange={onChange("whatsapp")}
                      testid="contact-input-whatsapp"
                      autoComplete="tel"
                    />
                    <Field
                      label={t("co.field.deadline")}
                      name="deadline"
                      value={form.deadline}
                      onChange={onChange("deadline")}
                      placeholder={t("co.field.deadlinePh")}
                      testid="contact-input-deadline"
                    />
                    <div>
                      <label htmlFor="contact-select-budget" className="block text-white/40 font-ui text-xs uppercase tracking-[0.2em] mb-2">
                        {t("co.field.budget")}
                      </label>
                      <select
                        id="contact-select-budget"
                        name="budget"
                        value={form.budget}
                        onChange={onChange("budget")}
                        className={SELECT_CLASS}
                        data-testid="contact-select-budget"
                      >
                        <option value="" disabled>{t("co.field.budgetPh")}</option>
                        {BUDGETS.map((budget) => (
                          <option key={budget} value={budget} className="bg-ink-700 text-white">
                            {budget}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="contact-select-service" className="block text-white/40 font-ui text-xs uppercase tracking-[0.2em] mb-2">
                        {t("co.field.service")}
                      </label>
                      <select
                        id="contact-select-service"
                        name="service"
                        value={form.service}
                        onChange={onChange("service")}
                        className={SELECT_CLASS}
                        data-testid="contact-select-service"
                      >
                        <option value="" disabled>{t("co.field.servicePh")}</option>
                        {SERVICES.map((service) => (
                          <option key={service} value={service} className="bg-ink-700 text-white">
                            {SERVICE_LABELS[service][lang] || SERVICE_LABELS[service].en}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contact-input-message" className="block text-white/40 font-ui text-xs uppercase tracking-[0.2em] mb-2">
                      {t("co.field.message")}
                    </label>
                    <textarea
                      id="contact-input-message"
                      name="message"
                      rows={5}
                      required
                      value={form.message}
                      onChange={onChange("message")}
                      placeholder={t("co.field.messagePh")}
                      className="w-full min-h-32 bg-transparent border-b border-white/15 focus:border-orange_impact py-3 outline-none font-inter text-base resize-y text-white placeholder-white/30"
                      data-testid="contact-input-message"
                    />
                  </div>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex min-h-12 w-full sm:w-auto items-center justify-center gap-2 bg-orange_impact text-ink-900 font-ui font-semibold px-7 py-3.5 rounded-full disabled:opacity-60 hover:bg-gold_light transition-colors"
                      data-testid="contact-submit"
                    >
                      <Mail className="w-4 h-4" />
                      {submitting ? t("co.submitting") : t("co.submit")}
                    </button>
                    <a
                      href={whatsappLink(waText)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-12 w-full sm:w-auto items-center justify-center gap-2 glass text-white px-7 py-3.5 rounded-full font-ui font-semibold hover:bg-white/10 transition-colors"
                      data-testid="contact-whatsapp-button"
                    >
                      <MessageCircle className="w-4 h-4" /> {t("co.wa")}
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({ label, name, value, onChange, type = "text", placeholder = "", testid, required = false, autoComplete }) {
  return (
    <div>
      <label htmlFor={testid} className="block text-white/40 font-ui text-xs uppercase tracking-[0.2em] mb-2">{label}</label>
      <input
        id={testid}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        inputMode={type === "tel" ? "tel" : undefined}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full min-h-12 bg-transparent border-b border-white/15 focus:border-orange_impact py-3 outline-none font-inter text-base text-white placeholder-white/30 transition-colors"
        data-testid={testid}
      />
    </div>
  );
}
