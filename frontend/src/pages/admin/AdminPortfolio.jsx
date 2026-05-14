import { useEffect, useState } from "react";
import api, { formatApiError } from "@/lib/api";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { toast } from "sonner";

const EMPTY = {
  title: "",
  category: "branding",
  client: "",
  year: new Date().getFullYear().toString(),
  summary: "",
  description: "",
  cover_image: "",
  gallery: [],
  services: [],
  challenge: "",
  strategy: "",
  outcome: "",
  testimonial: "",
  featured: false,
};

export default function AdminPortfolio() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const load = () => api.get("/portfolio").then((r) => setItems(r.data));
  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setForm(EMPTY);
    setEditing("new");
  };
  const openEdit = (p) => {
    setForm({ ...EMPTY, ...p });
    setEditing(p.id);
  };
  const close = () => setEditing(null);

  const onSave = async () => {
    try {
      const payload = {
        ...form,
        services: typeof form.services === "string"
          ? form.services.split(",").map((s) => s.trim()).filter(Boolean)
          : form.services,
        gallery: typeof form.gallery === "string"
          ? form.gallery.split(",").map((s) => s.trim()).filter(Boolean)
          : form.gallery,
      };
      if (editing === "new") await api.post("/portfolio", payload);
      else await api.put(`/portfolio/${editing}`, payload);
      toast.success("Saved");
      close();
      load();
    } catch (e) {
      toast.error(formatApiError(e.response?.data?.detail) || "Save failed");
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    await api.delete(`/portfolio/${id}`);
    toast.success("Deleted");
    load();
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e?.target ? e.target.value : e }));

  return (
    <div data-testid="admin-portfolio">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-4xl md:text-5xl font-black tracking-tighter">Portfolio</h1>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 bg-orange_impact text-ink-900 font-ui font-semibold px-5 py-2.5 rounded-full"
          data-testid="admin-portfolio-new"
        >
          <Plus className="w-4 h-4" /> New project
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((p) => (
          <div key={p.id} className="bg-ink-700/50 border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="aspect-video">
              <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-5">
              <p className="text-orange_impact text-[10px] uppercase tracking-[0.2em] font-ui">
                {p.category} · {p.year || "—"}
              </p>
              <h3 className="font-display font-bold text-lg mt-1 line-clamp-1">{p.title}</h3>
              <p className="text-white/55 text-sm mt-1 line-clamp-2 font-inter">{p.summary}</p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => openEdit(p)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full py-1.5 text-xs font-ui"
                  data-testid={`admin-edit-${p.slug}`}
                >
                  <Pencil className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => onDelete(p.id)}
                  className="inline-flex items-center justify-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-full py-1.5 px-3 text-xs font-ui"
                  data-testid={`admin-delete-${p.slug}`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md grid place-items-center p-4" data-testid="admin-portfolio-modal">
          <div className="bg-ink-800 border border-white/10 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 relative">
            <button onClick={close} className="absolute top-4 right-4 text-white/60 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-display text-3xl font-black tracking-tighter mb-6">
              {editing === "new" ? "New project" : "Edit project"}
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              <Input label="Title" value={form.title} onChange={set("title")} />
              <Select
                label="Category"
                value={form.category}
                onChange={set("category")}
                options={["branding", "web", "app", "marketing", "motion", "photo"]}
              />
              <Input label="Client" value={form.client} onChange={set("client")} />
              <Input label="Year" value={form.year} onChange={set("year")} />
              <Input label="Cover image URL" value={form.cover_image} onChange={set("cover_image")} full />
              <Input label="Summary" value={form.summary} onChange={set("summary")} full />
              <Textarea label="Description" value={form.description} onChange={set("description")} full />
              <Input
                label="Services (comma-separated)"
                value={Array.isArray(form.services) ? form.services.join(", ") : form.services}
                onChange={set("services")}
                full
              />
              <Input
                label="Gallery URLs (comma-separated)"
                value={Array.isArray(form.gallery) ? form.gallery.join(", ") : form.gallery}
                onChange={set("gallery")}
                full
              />
              <Textarea label="Challenge" value={form.challenge} onChange={set("challenge")} />
              <Textarea label="Strategy" value={form.strategy} onChange={set("strategy")} />
              <Input label="Outcome" value={form.outcome} onChange={set("outcome")} full />
              <Input label="Testimonial" value={form.testimonial} onChange={set("testimonial")} full />
              <label className="md:col-span-2 inline-flex items-center gap-2 text-sm font-ui">
                <input
                  type="checkbox"
                  checked={!!form.featured}
                  onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                />{" "}
                Featured
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={close} className="text-white/60 px-5 py-2 font-ui">
                Cancel
              </button>
              <button
                onClick={onSave}
                className="bg-orange_impact text-ink-900 font-ui font-semibold px-6 py-2.5 rounded-full"
                data-testid="admin-portfolio-save"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({ label, value, onChange, full }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="text-white/40 font-ui text-xs uppercase tracking-[0.2em] block mb-2">{label}</label>
      <input
        value={value || ""}
        onChange={onChange}
        className="w-full bg-ink-700/60 border border-white/10 rounded-lg px-3 py-2 font-inter outline-none focus:border-orange_impact"
      />
    </div>
  );
}
function Textarea({ label, value, onChange, full }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="text-white/40 font-ui text-xs uppercase tracking-[0.2em] block mb-2">{label}</label>
      <textarea
        value={value || ""}
        onChange={onChange}
        rows={3}
        className="w-full bg-ink-700/60 border border-white/10 rounded-lg px-3 py-2 font-inter outline-none focus:border-orange_impact"
      />
    </div>
  );
}
function Select({ label, value, onChange, options, full }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="text-white/40 font-ui text-xs uppercase tracking-[0.2em] block mb-2">{label}</label>
      <select
        value={value || ""}
        onChange={onChange}
        className="w-full bg-ink-700/60 border border-white/10 rounded-lg px-3 py-2 font-inter outline-none focus:border-orange_impact"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
