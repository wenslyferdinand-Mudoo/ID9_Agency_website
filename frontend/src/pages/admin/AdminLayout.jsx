import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import Logo from "@/components/site/Logo";
import { LayoutGrid, Briefcase, FileText, Mail, LogOut, ExternalLink } from "lucide-react";

const NAV = [
  { to: "/admin", end: true, label: "Overview", icon: LayoutGrid },
  { to: "/admin/portfolio", label: "Portfolio", icon: Briefcase },
  { to: "/admin/blog", label: "Journal", icon: FileText },
  { to: "/admin/contacts", label: "Submissions", icon: Mail },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const onLogout = () => {
    logout();
    nav("/admin/login");
  };
  return (
    <div className="min-h-screen bg-ink-900 grid grid-cols-1 md:grid-cols-[260px_1fr]" data-testid="admin-layout">
      <aside className="hidden md:flex flex-col border-r border-white/[0.06] p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12">
          <Logo className="w-9 h-9" />
          <p className="font-display font-black tracking-tight">
            ID9<span className="text-orange_impact">_</span>ADMIN
          </p>
        </div>
        <nav className="space-y-1">
          {NAV.map((n) => {
            const Icon = n.icon;
            return (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl font-ui text-sm transition-colors ${
                    isActive
                      ? "bg-white/8 text-white border border-white/10"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`
                }
                data-testid={`admin-nav-${n.label.toLowerCase()}`}
              >
                <Icon className="w-4 h-4" />
                {n.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="mt-auto pt-6 border-t border-white/[0.06] text-sm font-ui">
          <p className="text-white/40 text-xs mb-3">{user?.email}</p>
          <a
            href="/"
            className="flex items-center gap-2 text-white/70 hover:text-orange_impact mb-3"
          >
            <ExternalLink className="w-4 h-4" /> Visit site
          </a>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-white/70 hover:text-orange_impact"
            data-testid="admin-logout"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* mobile top bar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/[0.06] sticky top-0 bg-ink-900/90 backdrop-blur z-40">
        <div className="flex items-center gap-2">
          <Logo className="w-7 h-7" />
          <p className="font-display font-black">ID9 ADMIN</p>
        </div>
        <button onClick={onLogout} className="text-white/70 text-sm font-ui">
          Sign out
        </button>
      </div>
      <div className="md:hidden flex gap-2 p-3 overflow-x-auto border-b border-white/[0.06]">
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) =>
              `whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-ui ${
                isActive ? "bg-orange_impact text-ink-900" : "bg-white/5 text-white/70"
              }`
            }
          >
            {n.label}
          </NavLink>
        ))}
      </div>

      <main className="p-6 md:p-10 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
