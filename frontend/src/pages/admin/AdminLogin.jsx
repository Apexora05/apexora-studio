import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { api, formatApiErrorDetail } from "@/lib/api";

export default function AdminLogin() {
  const { user, ready, login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [mode, setMode] = useState("login"); // login | forgot | reset
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const resetToken = params.get("token");

  useEffect(() => {
    if (resetToken) setMode("reset");
  }, [resetToken]);

  useEffect(() => {
    if (ready && user) navigate("/admin/dashboard", { replace: true });
  }, [ready, user, navigate]);

  const submitLogin = async (e) => {
    e.preventDefault();
    setBusy(true);
    const res = await login(email, password);
    setBusy(false);
    if (res.ok) {
      toast.success("Welcome back.");
      navigate("/admin/dashboard");
    } else {
      toast.error(res.error);
    }
  };

  const submitForgot = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("If that account exists, a reset link has been logged for the admin.");
      setMode("login");
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail));
    } finally {
      setBusy(false);
    }
  };

  const submitReset = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/auth/reset-password", { token: resetToken, new_password: newPassword });
      toast.success("Password updated. Please sign in.");
      navigate("/admin", { replace: true });
      setMode("login");
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail));
    } finally {
      setBusy(false);
    }
  };

  const inputCls = "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-foreground";

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2" data-testid="admin-login-page">
      {/* Left brand panel */}
      <div className="relative hidden overflow-hidden bg-foreground text-background lg:block">
        <div className="grain absolute inset-0 opacity-20" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <span className="font-display text-2xl font-semibold">Apexora<span className="text-brand">.</span></span>
          <div>
            <h1 className="font-display text-5xl leading-[1] tracking-tight">The studio<br />control room.</h1>
            <p className="mt-6 max-w-sm text-background/60">Manage every word, image and page of your website — changes go live instantly.</p>
          </div>
          <p className="text-sm text-background/40">© {new Date().getFullYear()} Apexora Studio</p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          <h2 className="font-display text-3xl tracking-tight">
            {mode === "login" && "Sign in"}
            {mode === "forgot" && "Reset password"}
            {mode === "reset" && "Set new password"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "login" && "Access the Apexora content management system."}
            {mode === "forgot" && "Enter your email to receive a reset link."}
            {mode === "reset" && "Choose a new password for your account."}
          </p>

          {mode === "login" && (
            <form onSubmit={submitLogin} className="mt-8 space-y-4" data-testid="login-form">
              <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} data-testid="login-email" />
              <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} data-testid="login-password" />
              <button type="submit" disabled={busy} className="w-full rounded-lg bg-foreground py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60" data-testid="login-submit">
                {busy ? "Signing in…" : "Sign in"}
              </button>
              <button type="button" onClick={() => setMode("forgot")} className="w-full text-center text-sm text-muted-foreground hover:text-foreground" data-testid="forgot-password-link">
                Forgot your password?
              </button>
            </form>
          )}

          {mode === "forgot" && (
            <form onSubmit={submitForgot} className="mt-8 space-y-4" data-testid="forgot-form">
              <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} data-testid="forgot-email" />
              <button type="submit" disabled={busy} className="w-full rounded-lg bg-foreground py-3 text-sm font-medium text-background disabled:opacity-60" data-testid="forgot-submit">
                {busy ? "Sending…" : "Send reset link"}
              </button>
              <button type="button" onClick={() => setMode("login")} className="w-full text-center text-sm text-muted-foreground hover:text-foreground">Back to sign in</button>
            </form>
          )}

          {mode === "reset" && (
            <form onSubmit={submitReset} className="mt-8 space-y-4" data-testid="reset-form">
              <input type="password" required placeholder="New password (min 8 chars)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputCls} data-testid="reset-password" />
              <button type="submit" disabled={busy} className="w-full rounded-lg bg-foreground py-3 text-sm font-medium text-background disabled:opacity-60" data-testid="reset-submit">
                {busy ? "Updating…" : "Update password"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
