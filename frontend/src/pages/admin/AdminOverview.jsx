import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Briefcase, FileText, Mail, Users } from "lucide-react";

export default function AdminOverview() {
  const [counts, setCounts] = useState({ portfolio: 0, blog: 0, contacts: 0, unread: 0 });
  useEffect(() => {
    Promise.all([
      api.get("/portfolio"),
      api.get("/blog"),
      api.get("/contact"),
    ])
      .then(([p, b, c]) => {
        setCounts({
          portfolio: p.data.length,
          blog: b.data.length,
          contacts: c.data.length,
          unread: c.data.filter((x) => !x.read).length,
        });
      })
      .catch(() => {});
  }, []);

  const tiles = [
    { label: "Portfolio items", value: counts.portfolio, icon: Briefcase },
    { label: "Journal posts", value: counts.blog, icon: FileText },
    { label: "Total submissions", value: counts.contacts, icon: Mail },
    { label: "Unread leads", value: counts.unread, icon: Users },
  ];

  return (
    <div data-testid="admin-overview">
      <h1 className="font-display text-4xl md:text-5xl font-black tracking-tighter mb-2">Overview</h1>
      <p className="text-white/55 font-inter mb-10">A quick pulse of the ID9 studio.</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {tiles.map((t) => {
          const Icon = t.icon;
          return (
            <div key={t.label} className="bg-ink-700/60 border border-white/[0.06] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-xl bg-orange_impact/10 border border-orange_impact/20 grid place-items-center text-orange_impact">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="font-display text-4xl font-black tabular-nums">{t.value}</p>
              <p className="text-white/55 font-ui text-sm mt-1">{t.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
