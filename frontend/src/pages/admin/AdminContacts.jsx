import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Trash2, MessageCircle, Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { whatsappLink } from "@/lib/brand";

export default function AdminContacts() {
  const [items, setItems] = useState([]);

  const load = () => api.get("/contact").then((r) => setItems(r.data));
  useEffect(() => {
    load();
  }, []);

  const markRead = async (id) => {
    await api.patch(`/contact/${id}/read`);
    load();
  };
  const remove = async (id) => {
    if (!window.confirm("Delete submission?")) return;
    await api.delete(`/contact/${id}`);
    toast.success("Deleted");
    load();
  };

  return (
    <div data-testid="admin-contacts">
      <h1 className="font-display text-4xl md:text-5xl font-black tracking-tighter mb-8">
        Submissions
      </h1>
      <div className="space-y-3">
        {items.length === 0 && (
          <p className="text-white/50 font-ui">No submissions yet.</p>
        )}
        {items.map((c) => (
          <details
            key={c.id}
            className="group bg-ink-700/50 border border-white/[0.06] rounded-2xl overflow-hidden"
          >
            <summary className="grid grid-cols-12 gap-4 items-center p-5 cursor-pointer list-none">
              <div className="col-span-12 md:col-span-4">
                <div className="flex items-center gap-2">
                  {!c.read && <span className="w-2 h-2 rounded-full bg-orange_impact animate-pulse" />}
                  <p className="font-display font-bold">{c.name}</p>
                </div>
                <p className="text-white/55 text-sm font-inter">{c.email}</p>
              </div>
              <div className="col-span-6 md:col-span-3 text-sm font-ui">
                <p className="text-white/70">{c.service || "—"}</p>
                <p className="text-white/40 text-xs">{c.budget || "—"}</p>
              </div>
              <div className="col-span-6 md:col-span-3 text-xs text-white/50 font-ui">
                {new Date(c.created_at).toLocaleString()}
              </div>
              <div className="col-span-12 md:col-span-2 flex gap-2 justify-end">
                {!c.read && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      markRead(c.id);
                    }}
                    className="inline-flex items-center gap-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-3 py-1.5 text-xs font-ui"
                  >
                    <CheckCircle2 className="w-3 h-3" /> Mark read
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    remove(c.id);
                  }}
                  className="inline-flex items-center gap-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-full px-3 py-1.5 text-xs font-ui"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </summary>
            <div className="px-5 pb-5 border-t border-white/5 pt-4 grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <p className="text-white/40 text-xs uppercase tracking-[0.2em] font-ui mb-2">Message</p>
                <p className="text-white/80 font-inter whitespace-pre-wrap">{c.message}</p>
              </div>
              <div className="space-y-3 text-sm font-ui">
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-1">WhatsApp</p>
                  <p className="text-white/80">{c.whatsapp || "—"}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-1">Deadline</p>
                  <p className="text-white/80">{c.deadline || "—"}</p>
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  <a
                    href={`mailto:${c.email}?subject=ID9_AGENCY — Re: ${
                      c.service || "your project"
                    }`}
                    className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5"
                  >
                    <Mail className="w-3 h-3" /> Reply by email
                  </a>
                  {c.whatsapp && (
                    <a
                      href={whatsappLink(`Hello ${c.name}, this is ID9_AGENCY following up on your message.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-orange_impact/15 border border-orange_impact/30 text-orange_impact rounded-full px-3 py-1.5"
                    >
                      <MessageCircle className="w-3 h-3" /> WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
