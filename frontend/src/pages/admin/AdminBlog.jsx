import { useEffect, useState } from "react";
import api, { formatApiError } from "@/lib/api";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { toast } from "sonner";

const EMPTY = {
  title: "",
  category: "Branding",
  excerpt: "",
  content: "",
  cover_image: "",
  author: "ID9 Editorial",
  read_time: "5 min read",
  published: true,
  featured: false,
};

export default function AdminBlog() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const load = () => api.get("/blog").then((r) => setItems(r.data));
  useEffect(() => {
    load();
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e?.target ? e.target.value : e }));

  const onSave = async () => {
    try {
      if (editing === "new") await api.post("/blog", form);
      else await api.put(`/blog/${editing}`, form);
      toast.success("Saved");
      setEditing(null);
      load();
    } catch (e) {
      toast.error(formatApiError(e.response?.data?.detail) || "Save failed");
    }
  };
  const onDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    await api.delete(`/blog/${id}`);
    toast.success("Deleted");
    load();
  };

  return (
    <div data-testid="admin-blog">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-4xl md:text-5xl font-black tracking-tighter">Journal</h1>
        <button
          onClick={() => {
            setForm(EMPTY);
            setEditing("new");
          }}
          className="inline-flex items-center gap-2 bg-orange_impact text-ink-900 font-ui font-semibold px-5 py-2.5 rounded-full"
          data-testid="admin-blog-new"
        >
          <Plus className="w-4 h-4" /> New post
        </button>
      </div>

      <div className="space-y-3">
        {items.map((p) => (
          <div
            key={p.id}
            className="grid grid-cols-12 gap-4 items-center bg-ink-700/50 border border-white/[0.06] rounded-2xl p-4"
          >
            <img src={p.cover_image} alt={p.title} className="col-span-3 md:col-span-2 aspect-video object-cover rounded-lg" />
            <div className="col-span-9 md:col-span-7">
              <p className="text-orange_impact text-[10px] uppercase tracking-[0.2em] font-ui">
                {p.category} · {p.published ? "Published" : "Draft"}
              </p>
              <h3 className="font-display font-bold text-lg line-clamp-1">{p.title}</h3>
              <p className="text-white/55 text-sm font-inter line-clamp-1">{p.excerpt}</p>
            </div>
            <div className="col-span-12 md:col-span-3 flex gap-2 justify-end">
              <button
                onClick={() => {
                  setForm({ ...EMPTY, ...p });
                  setEditing(p.id);
                }}
                className="inline-flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-3 py-1.5 text-xs font-ui"
              >
                <Pencil className="w-3 h-3" /> Edit
              </button>
              <button
                onClick={() => onDelete(p.id)}
                className="inline-flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-full px-3 py-1.5 text-xs font-ui"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md grid place-items-center p-4">
          <div className="bg-ink-800 border border-white/10 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 relative">
            <button onClick={() => setEditing(null)} className="absolute top-4 right-4 text-white/60">
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-display text-3xl font-black tracking-tighter mb-6">
              {editing === "new" ? "New post" : "Edit post"}
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              <I label="Title" value={form.title} onChange={set("title")} full />
              <I label="Category" value={form.category} onChange={set("category")} />
              <I label="Author" value={form.author} onChange={set("author")} />
              <I label="Read time" value={form.read_time} onChange={set("read_time")} />
              <I label="Cover image URL" value={form.cover_image} onChange={set("cover_image")} />
              <I label="Excerpt" value={form.excerpt} onChange={set("excerpt")} full />
              <T label="Content (Markdown-lite: ##, **bold**, lists)" value={form.content} onChange={set("content")} full rows={10} />
              <label className="inline-flex items-center gap-2 text-sm font-ui">
                <input
                  type="checkbox"
                  checked={!!form.published}
                  onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                />{" "}
                Published
              </label>
              <label className="inline-flex items-center gap-2 text-sm font-ui">
                <input
                  type="checkbox"
                  checked={!!form.featured}
                  onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                />{" "}
                Featured
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setEditing(null)} className="text-white/60 px-5 py-2 font-ui">
                Cancel
              </button>
              <button
                onClick={onSave}
                className="bg-orange_impact text-ink-900 font-ui font-semibold px-6 py-2.5 rounded-full"
                data-testid="admin-blog-save"
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

function I({ label, value, onChange, full }) {
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
function T({ label, value, onChange, full, rows = 4 }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="text-white/40 font-ui text-xs uppercase tracking-[0.2em] block mb-2">{label}</label>
      <textarea
        value={value || ""}
        onChange={onChange}
        rows={rows}
        className="w-full bg-ink-700/60 border border-white/10 rounded-lg px-3 py-2 font-inter outline-none focus:border-orange_impact"
      />
    </div>
  );
}
