import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api, formatApiErrorDetail } from "@/lib/api";
import { useGet } from "@/hooks/useApi";
import { useSite } from "@/context/SiteContext";
import { PageHeader, Field } from "@/components/admin/AdminForm";
import MediaPicker from "@/components/admin/MediaPicker";

const input = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground";

export default function Settings() {
  const { data } = useGet("/settings");
  const { refresh } = useSite();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [pw, setPw] = useState({ current_password: "", new_password: "" });

  useEffect(() => { if (data) setForm(data); }, [data]);

  if (!form) return <p className="text-muted-foreground">Loading…</p>;

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setSocial = (k, v) => setForm((f) => ({ ...f, socials: { ...(f.socials || {}), [k]: v } }));
  const setNav = (i, key, v) => setForm((f) => { const nav = [...(f.nav || [])]; nav[i] = { ...nav[i], [key]: v }; return { ...f, nav }; });

  const save = async () => {
    setSaving(true);
    try { await api.put("/settings", form); toast.success("Settings saved"); refresh(); }
    catch (e) { toast.error(formatApiErrorDetail(e.response?.data?.detail)); }
    finally { setSaving(false); }
  };

  const changePw = async () => {
    if (pw.new_password.length < 8) return toast.error("New password must be at least 8 characters");
    try { await api.post("/auth/change-password", pw); toast.success("Password changed"); setPw({ current_password: "", new_password: "" }); }
    catch (e) { toast.error(formatApiErrorDetail(e.response?.data?.detail)); }
  };

  const Section = ({ title, children }) => (
    <div className="rounded-xl border border-border bg-background p-6">
      <h2 className="mb-5 font-display text-xl tracking-tight">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );

  const Text = ({ label, k }) => (
    <label className="block"><span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</span><input className={`${input} mt-2`} value={form[k] || ""} onChange={(e) => set(k, e.target.value)} data-testid={`settings-${k}`} /></label>
  );

  return (
    <div data-testid="admin-settings">
      <PageHeader
        title="Settings"
        description="Brand, contact details, navigation and social links."
        action={<button onClick={save} disabled={saving} className="rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background disabled:opacity-60" data-testid="settings-save">{saving ? "Saving…" : "Save changes"}</button>}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Brand">
          <Text label="Brand name" k="brand_name" />
          <Text label="Logo text" k="logo_text" />
          <Text label="Tagline" k="tagline" />
          <Text label="Footer note" k="footer_note" />
          <MediaPicker label="Logo image (optional)" value={form.logo_url} onChange={(v) => set("logo_url", v)} testid="settings-logo" />
          <MediaPicker label="Favicon (optional)" value={form.favicon_url} onChange={(v) => set("favicon_url", v)} testid="settings-favicon" />
        </Section>

        <Section title="Contact">
          <Text label="Email" k="email" />
          <Text label="Phone" k="phone" />
          <Text label="Address" k="address" />
        </Section>

        <Section title="Social Links">
          {["twitter", "instagram", "linkedin", "dribbble"].map((s) => (
            <label key={s} className="block"><span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{s}</span><input className={`${input} mt-2`} value={form.socials?.[s] || ""} onChange={(e) => setSocial(s, e.target.value)} data-testid={`settings-social-${s}`} /></label>
          ))}
        </Section>

        <Section title="Navigation">
          {(form.nav || []).map((n, i) => (
            <div key={i} className="grid grid-cols-2 gap-2">
              <input className={input} value={n.label} onChange={(e) => setNav(i, "label", e.target.value)} placeholder="Label" />
              <input className={input} value={n.path} onChange={(e) => setNav(i, "path", e.target.value)} placeholder="/path" />
            </div>
          ))}
        </Section>

        <Section title="Change Password">
          <label className="block"><span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Current password</span><input type="password" className={`${input} mt-2`} value={pw.current_password} onChange={(e) => setPw({ ...pw, current_password: e.target.value })} data-testid="change-current-pw" /></label>
          <label className="block"><span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">New password</span><input type="password" className={`${input} mt-2`} value={pw.new_password} onChange={(e) => setPw({ ...pw, new_password: e.target.value })} data-testid="change-new-pw" /></label>
          <button onClick={changePw} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-accent" data-testid="change-pw-submit">Update password</button>
        </Section>
      </div>
    </div>
  );
}
