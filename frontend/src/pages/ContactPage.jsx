import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageCircle, MapPin, Instagram, Check, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api, { formatApiError } from "@/lib/api";
import { BRAND, whatsappLink } from "@/lib/brand";
import GlowOrb from "@/components/site/GlowOrb";
import RevealText from "@/components/site/RevealText";

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

export default function ContactPage() {
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

  const onChange = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e?.target ? e.target.value : e }));

  const submit = async (e) => {
    e?.preventDefault?.();
    if (!form.name || !form.email || !form.message) {
      toast.error("Name, email and message are required.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/contact", form);
      setSent(true);
      toast.success("Brief received. We'll be in touch within 24h.");
    } catch (e) {
      toast.error(formatApiError(e.response?.data?.detail) || "Could not send. Try WhatsApp.");
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
          <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.3em] mb-6">Contact</p>
          <RevealText
            as="h1"
            text="Let's build something"
            className="font-display text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.98]"
          />
          <RevealText
            as="h1"
            text="undeniable."
            className="font-display text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.98] text-gradient-gold"
            delay={0.1}
          />

          <div className="mt-16 grid md:grid-cols-12 gap-10">
            <aside className="md:col-span-4 space-y-8">
              <div>
                <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.25em] mb-2">Email</p>
                <a href={`mailto:${BRAND.email}`} className="font-display text-2xl hover:text-orange_impact">
                  {BRAND.email}
                </a>
              </div>
              <div>
                <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.25em] mb-2">WhatsApp</p>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display text-2xl hover:text-orange_impact inline-flex items-center gap-2"
                  data-testid="contact-whatsapp-link"
                >
                  {BRAND.whatsappDisplay} <MessageCircle className="w-5 h-5" />
                </a>
              </div>
              <div>
                <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.25em] mb-2">Instagram</p>
                <a
                  href={BRAND.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display text-2xl hover:text-orange_impact inline-flex items-center gap-2"
                >
                  <Instagram className="w-5 h-5" /> {BRAND.instagram}
                </a>
              </div>
              <div>
                <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.25em] mb-2">Studio</p>
                <p className="font-display text-2xl inline-flex items-center gap-2">
                  <MapPin className="w-5 h-5" /> {BRAND.city}
                </p>
              </div>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden glass">
                <iframe
                  title="Studio map"
                  className="w-full h-full"
                  src="https://www.google.com/maps?q=Port-au-Prince,+Haiti&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </aside>

            <div className="md:col-span-8 glass-strong rounded-3xl p-7 md:p-10 noise-overlay relative overflow-hidden">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                  data-testid="contact-success"
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-orange_impact/15 border border-orange_impact/40 grid place-items-center mb-6">
                    <Check className="w-7 h-7 text-orange_impact" />
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl font-black tracking-tighter mb-3">
                    Brief received.
                  </h2>
                  <p className="text-white/70 font-inter max-w-md mx-auto">
                    We'll be in touch within 24 hours. Want to fast-track? Continue the
                    conversation on WhatsApp now.
                  </p>
                  <a
                    href={whatsappLink(waText)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 bg-orange_impact text-ink-900 font-ui font-semibold px-6 py-3 rounded-full"
                    data-testid="contact-success-whatsapp"
                  >
                    Continue on WhatsApp <ArrowUpRight className="w-4 h-4" />
                  </a>
                </motion.div>
              ) : (
                <form onSubmit={submit} className="space-y-6" data-testid="contact-form">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Field label="Name *" value={form.name} onChange={onChange("name")} testid="contact-input-name" />
                    <Field
                      label="Email *"
                      type="email"
                      value={form.email}
                      onChange={onChange("email")}
                      testid="contact-input-email"
                    />
                    <Field
                      label="WhatsApp"
                      value={form.whatsapp}
                      onChange={onChange("whatsapp")}
                      testid="contact-input-whatsapp"
                    />
                    <Field
                      label="Deadline"
                      value={form.deadline}
                      onChange={onChange("deadline")}
                      placeholder="e.g. 6 weeks"
                      testid="contact-input-deadline"
                    />
                    <div>
                      <label className="block text-white/40 font-ui text-xs uppercase tracking-[0.2em] mb-2">
                        Budget
                      </label>
                      <Select value={form.budget} onValueChange={onChange("budget")}>
                        <SelectTrigger
                          className="bg-transparent border-0 border-b border-white/15 rounded-none px-0 h-11 focus:ring-0 focus:border-orange_impact font-inter"
                          data-testid="contact-select-budget"
                        >
                          <SelectValue placeholder="Choose budget range" />
                        </SelectTrigger>
                        <SelectContent className="bg-ink-700 border-white/10">
                          {BUDGETS.map((b) => (
                            <SelectItem key={b} value={b}>
                              {b}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-white/40 font-ui text-xs uppercase tracking-[0.2em] mb-2">
                        Service
                      </label>
                      <Select value={form.service} onValueChange={onChange("service")}>
                        <SelectTrigger
                          className="bg-transparent border-0 border-b border-white/15 rounded-none px-0 h-11 focus:ring-0 focus:border-orange_impact font-inter"
                          data-testid="contact-select-service"
                        >
                          <SelectValue placeholder="Choose service" />
                        </SelectTrigger>
                        <SelectContent className="bg-ink-700 border-white/10">
                          {SERVICES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/40 font-ui text-xs uppercase tracking-[0.2em] mb-2">
                      Tell us about your project *
                    </label>
                    <textarea
                      rows={5}
                      value={form.message}
                      onChange={onChange("message")}
                      placeholder="The brand, the ambition, where you're stuck — anything helps."
                      className="w-full bg-transparent border-b border-white/15 focus:border-orange_impact py-3 outline-none font-inter resize-none text-white placeholder-white/30"
                      data-testid="contact-input-message"
                    />
                  </div>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center gap-2 bg-orange_impact text-ink-900 font-ui font-semibold px-7 py-3.5 rounded-full disabled:opacity-60 hover:bg-gold_light transition-colors"
                      data-testid="contact-submit"
                    >
                      <Mail className="w-4 h-4" />
                      {submitting ? "Sending…" : "Send brief"}
                    </button>
                    <a
                      href={whatsappLink(waText)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 glass text-white px-7 py-3.5 rounded-full font-ui font-semibold hover:bg-white/10 transition-colors"
                      data-testid="contact-whatsapp-button"
                    >
                      <MessageCircle className="w-4 h-4" /> Send on WhatsApp
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

function Field({ label, value, onChange, type = "text", placeholder = "", testid }) {
  return (
    <div>
      <label className="block text-white/40 font-ui text-xs uppercase tracking-[0.2em] mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent border-b border-white/15 focus:border-orange_impact py-3 outline-none font-inter text-white placeholder-white/30 transition-colors"
        data-testid={testid}
      />
    </div>
  );
}
