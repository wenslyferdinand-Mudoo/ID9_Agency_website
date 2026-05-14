import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import Logo from "@/components/site/Logo";

export default function AdminLoginPage() {
  const { user, login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const loc = useLocation();

  if (!loading && user) return <Navigate to={loc.state?.from?.pathname || "/admin"} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const r = await login(email, password);
    setBusy(false);
    if (!r.ok) setErr(r.error || "Login failed");
  };

  return (
    <main className="min-h-screen grid place-items-center px-4 bg-ink-900" data-testid="admin-login-page">
      <div className="absolute inset-0 grid-lines opacity-30 pointer-events-none" />
      <form
        onSubmit={submit}
        className="relative glass-strong rounded-3xl p-8 md:p-10 w-full max-w-md noise-overlay"
        data-testid="admin-login-form"
      >
        <div className="flex items-center gap-3 mb-8">
          <Logo className="w-10 h-10" />
          <p className="font-display font-black text-xl tracking-tight">
            ID9<span className="text-orange_impact">_</span>ADMIN
          </p>
        </div>
        <h1 className="font-display text-3xl font-black tracking-tighter mb-2">Sign in</h1>
        <p className="text-white/55 font-inter text-sm mb-8">Access the ID9 studio dashboard.</p>

        <label className="block text-white/40 font-ui text-xs uppercase tracking-[0.2em] mb-2">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-transparent border-b border-white/20 focus:border-orange_impact py-3 outline-none font-inter mb-6"
          data-testid="admin-login-email"
        />

        <label className="block text-white/40 font-ui text-xs uppercase tracking-[0.2em] mb-2">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-transparent border-b border-white/20 focus:border-orange_impact py-3 outline-none font-inter mb-6"
          data-testid="admin-login-password"
        />

        {err && (
          <p className="text-red-400 text-sm mb-4 font-ui" data-testid="admin-login-error">
            {err}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-orange_impact text-ink-900 font-ui font-semibold py-3 rounded-full hover:bg-gold_light transition-colors disabled:opacity-60"
          data-testid="admin-login-submit"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
