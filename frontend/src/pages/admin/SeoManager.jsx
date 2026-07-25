import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useGet } from "@/hooks/useApi";
import { PageHeader } from "@/components/admin/AdminForm";

const input = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground";

export default function SeoManager() {
  const { data } = useGet("/seo");
  const [rows, setRows] = useState([]);
  const [globalCfg, setGlobalCfg] = useState({ ga_id: "", gsc_verification: "", robots: "index,follow" });

  useEffect(() => {
    if (data) {
      setRows(data);
      const g = data.find((r) => r.path === "__global__");
      if (g) setGlobalCfg({ ga_id: g.ga_id || "", gsc_verification: g.gsc_verification || "", robots: g.robots || "index,follow" });
    }
  }, [data]);

  const update = (i, key, v) => setRows((r) => r.map((row, j) => (j === i ? { ...row, [key]: v } : row)));

  const save = async (row) => {
    try { await api.put("/admin/seo", row); toast.success(`Saved SEO for ${row.path}`); }
    catch (_) { toast.error("Save failed"); }
  };

  const saveGlobal = async () => {
    try { await api.put("/admin/seo", { path: "__global__", ...globalCfg }); toast.success("Global SEO saved"); }
    catch (_) { toast.error("Save failed"); }
  };

  return (
    <div data-testid="admin-seo">
      <PageHeader title="SEO Manager" description="Meta titles, descriptions and integrations for each page." />

      <div className="mb-6 rounded-xl border border-border bg-background p-6">
        <h2 className="mb-4 font-display text-xl tracking-tight">Global &amp; Integrations</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block"><span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Google Analytics ID</span><input className={`${input} mt-2`} placeholder="G-XXXXXXX" value={globalCfg.ga_id} onChange={(e) => setGlobalCfg({ ...globalCfg, ga_id: e.target.value })} data-testid="seo-ga" /></label>
          <label className="block"><span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Search Console verification</span><input className={`${input} mt-2`} value={globalCfg.gsc_verification} onChange={(e) => setGlobalCfg({ ...globalCfg, gsc_verification: e.target.value })} data-testid="seo-gsc" /></label>
          <label className="block"><span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Default robots</span><input className={`${input} mt-2`} value={globalCfg.robots} onChange={(e) => setGlobalCfg({ ...globalCfg, robots: e.target.value })} data-testid="seo-robots" /></label>
        </div>
        <button onClick={saveGlobal} className="mt-4 rounded-lg bg-foreground px-5 py-2 text-sm text-background" data-testid="seo-save-global">Save global settings</button>
      </div>

      <div className="space-y-4">
        {rows.filter((r) => r.path !== "__global__").map((row, i) => (
          <div key={row.path} className="rounded-xl border border-border bg-background p-6" data-testid={`seo-row-${row.path}`}>
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-full bg-secondary px-3 py-1 font-mono text-xs">{row.path}</span>
              <button onClick={() => save(row)} className="rounded-lg bg-foreground px-4 py-1.5 text-sm text-background" data-testid={`seo-save-${row.path}`}>Save</button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block"><span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Meta title</span><input className={`${input} mt-2`} value={row.meta_title || ""} onChange={(e) => update(i, "meta_title", e.target.value)} /></label>
              <label className="block"><span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Canonical URL</span><input className={`${input} mt-2`} value={row.canonical || ""} onChange={(e) => update(i, "canonical", e.target.value)} /></label>
              <label className="block md:col-span-2"><span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Meta description</span><textarea rows={2} className={`${input} mt-2 resize-y`} value={row.meta_description || ""} onChange={(e) => update(i, "meta_description", e.target.value)} /></label>
              <label className="block md:col-span-2"><span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Open Graph image URL</span><input className={`${input} mt-2`} value={row.og_image || ""} onChange={(e) => update(i, "og_image", e.target.value)} /></label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
