import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get, set, cloneDeep } from "lodash";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useGet } from "@/hooks/useApi";
import { PageHeader } from "@/components/admin/AdminForm";
import MediaPicker from "@/components/admin/MediaPicker";

const input = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground";

const SCHEMAS = {
  home: [
    { section: "Hero", fields: [
      { path: "hero.eyebrow", label: "Eyebrow" },
      { path: "hero.headline", label: "Headline", type: "textarea" },
      { path: "hero.subheadline", label: "Subheadline", type: "textarea" },
      { path: "hero.image", label: "Hero image", type: "image" },
      { path: "hero.primary_cta.label", label: "Primary button label" },
      { path: "hero.primary_cta.path", label: "Primary button link" },
      { path: "hero.secondary_cta.label", label: "Secondary button label" },
      { path: "hero.secondary_cta.path", label: "Secondary button link" },
    ]},
    { section: "Marquee", fields: [ { path: "marquee", label: "Marquee words", type: "tags" } ] },
    { section: "Why Apexora", fields: [
      { path: "why.eyebrow", label: "Eyebrow" },
      { path: "why.title", label: "Title", type: "textarea" },
      { path: "why.items", label: "Items", type: "objectlist", subfields: [ { key: "no", label: "No." }, { key: "title", label: "Title" }, { key: "text", label: "Text", type: "textarea" } ] },
    ]},
    { section: "Our Process", fields: [
      { path: "process.eyebrow", label: "Eyebrow" },
      { path: "process.title", label: "Title", type: "textarea" },
      { path: "process.steps", label: "Steps", type: "objectlist", subfields: [ { key: "no", label: "No." }, { key: "title", label: "Title" }, { key: "text", label: "Text", type: "textarea" } ] },
    ]},
    { section: "Industries", fields: [
      { path: "industries.eyebrow", label: "Eyebrow" },
      { path: "industries.title", label: "Title" },
      { path: "industries.items", label: "Industries", type: "tags" },
    ]},
    { section: "Final CTA", fields: [
      { path: "cta.title", label: "Title", type: "textarea" },
      { path: "cta.text", label: "Text", type: "textarea" },
      { path: "cta.button.label", label: "Button label" },
      { path: "cta.button.path", label: "Button link" },
    ]},
    { section: "SEO", fields: [
      { path: "seo.meta_title", label: "Meta title" },
      { path: "seo.meta_description", label: "Meta description", type: "textarea" },
    ]},
  ],
  about: [
    { section: "Hero", fields: [
      { path: "hero.eyebrow", label: "Eyebrow" },
      { path: "hero.title", label: "Title", type: "textarea" },
      { path: "hero.text", label: "Text", type: "textarea" },
      { path: "hero.image", label: "Image", type: "image" },
    ]},
    { section: "Mission", fields: [ { path: "mission.title", label: "Title" }, { path: "mission.text", label: "Text", type: "textarea" } ] },
    { section: "Vision", fields: [ { path: "vision.title", label: "Title" }, { path: "vision.text", label: "Text", type: "textarea" } ] },
    { section: "Philosophy", fields: [ { path: "philosophy.title", label: "Title" }, { path: "philosophy.text", label: "Text", type: "textarea" } ] },
    { section: "Why Great Design Matters", fields: [ { path: "why_design.title", label: "Title" }, { path: "why_design.text", label: "Text", type: "textarea" } ] },
    { section: "Core Values", fields: [ { path: "values", label: "Values", type: "objectlist", subfields: [ { key: "no", label: "No." }, { key: "title", label: "Title" }, { key: "text", label: "Text", type: "textarea" } ] } ] },
    { section: "Timeline", fields: [ { path: "timeline", label: "Timeline", type: "objectlist", subfields: [ { key: "year", label: "Year" }, { key: "title", label: "Title" }, { key: "text", label: "Text", type: "textarea" } ] } ] },
    { section: "Team", fields: [ { path: "team", label: "Team", type: "objectlist", subfields: [ { key: "name", label: "Name" }, { key: "role", label: "Role" }, { key: "image", label: "Photo", type: "image" } ] } ] },
    { section: "SEO", fields: [ { path: "seo.meta_title", label: "Meta title" }, { path: "seo.meta_description", label: "Meta description", type: "textarea" } ] },
  ],
  services: [
    { section: "Hero", fields: [
      { path: "hero.eyebrow", label: "Eyebrow" },
      { path: "hero.title", label: "Title", type: "textarea" },
      { path: "hero.subtext", label: "Subtext", type: "textarea" },
    ]},
    { section: "Bottom CTA", fields: [
      { path: "cta.eyebrow", label: "Eyebrow" },
      { path: "cta.title", label: "Title" },
      { path: "cta.text", label: "Text", type: "textarea" },
      { path: "cta.button.label", label: "Button label" },
      { path: "cta.button.path", label: "Button link" },
    ]},
  ],
  portfolio: [
    { section: "Hero", fields: [
      { path: "hero.eyebrow", label: "Eyebrow" },
      { path: "hero.title", label: "Title", type: "textarea" },
      { path: "hero.subtext", label: "Subtext (optional)", type: "textarea" },
    ]},
  ],
  "case-studies": [
    { section: "Hero", fields: [
      { path: "hero.eyebrow", label: "Eyebrow" },
      { path: "hero.title", label: "Title", type: "textarea" },
      { path: "hero.subtext", label: "Subtext", type: "textarea" },
    ]},
  ],
  blog: [
    { section: "Hero", fields: [
      { path: "hero.eyebrow", label: "Eyebrow" },
      { path: "hero.title", label: "Title", type: "textarea" },
      { path: "hero.subtext", label: "Subtext (optional)", type: "textarea" },
    ]},
  ],
  contact: [
    { section: "Hero", fields: [
      { path: "hero.eyebrow", label: "Eyebrow" },
      { path: "hero.title", label: "Title", type: "textarea" },
      { path: "hero.subtext", label: "Subtext", type: "textarea" },
    ]},
  ],
  privacy: [
    { section: "Hero", fields: [
      { path: "hero.eyebrow", label: "Eyebrow" },
      { path: "hero.title", label: "Title" },
    ]},
    { section: "Sections", fields: [
      { path: "sections", label: "Policy sections", type: "objectlist", subfields: [ { key: "h", label: "Heading" }, { key: "p", label: "Body", type: "textarea" } ] },
    ]},
  ],
  terms: [
    { section: "Hero", fields: [
      { path: "hero.eyebrow", label: "Eyebrow" },
      { path: "hero.title", label: "Title" },
    ]},
    { section: "Sections", fields: [
      { path: "sections", label: "Terms sections", type: "objectlist", subfields: [ { key: "h", label: "Heading" }, { key: "p", label: "Body", type: "textarea" } ] },
    ]},
  ],
};

export default function PageEditor() {
  const { pageId } = useParams();
  const { data } = useGet(`/pages/${pageId}`, [pageId]);
  const [doc, setDoc] = useState(null);
  const [saving, setSaving] = useState(false);
  const schema = SCHEMAS[pageId] || [];

  const TITLES = { home: "Homepage", about: "About", services: "Services Page", portfolio: "Portfolio Page", "case-studies": "Case Studies Page", blog: "Blog Page", contact: "Contact Page", privacy: "Privacy Policy", terms: "Terms & Conditions" };

  useEffect(() => { if (data) setDoc(data); }, [data]);

  if (!doc) return <p className="text-muted-foreground">Loading…</p>;

 const setPath = (path, value) => setDoc((d) => {
  const c = cloneDeep(d);
  if (!c.content) c.content = {};
  set(c.content, path, value);
  return c;
});

  const save = async () => {
  setSaving(true);

  try {
    await api.put(`/pages/${pageId}`, { content: doc.content });
    toast.success("Page saved — live now");
  } catch (_) {
    toast.error("Save failed");
  } finally {
    setSaving(false);
  }
};

  const renderField = (f) => {
   const value = get(doc?.content, f.path);
    if (f.type === "image") return <MediaPicker key={f.path} label={f.label} value={value} onChange={(v) => setPath(f.path, v)} testid={`page-${f.path}`} />;
    if (f.type === "tags")
      return (
        <label key={f.path} className="block">
          <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{f.label}</span>
          <input className={`${input} mt-2`} value={Array.isArray(value) ? value.join(", ") : value || ""} onChange={(e) => setPath(f.path, e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} data-testid={`page-${f.path}`} />
        </label>
      );
    if (f.type === "objectlist") {
      const arr = value || [];
      return (
        <div key={f.path}>
          <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{f.label}</span>
          <div className="mt-2 space-y-3">
            {arr.map((row, i) => (
              <div key={i} className="space-y-2 rounded-lg border border-border p-3">
                <div className="flex justify-end"><button onClick={() => setPath(f.path, arr.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive" data-testid={`page-${f.path}-remove-${i}`}><Trash2 className="h-4 w-4" /></button></div>
                {f.subfields.map((sf) => (
                  <label key={sf.key} className="block">
                    <span className="text-[11px] uppercase tracking-wide text-muted-foreground">{sf.label}</span>
                    {sf.type === "image" ? (
                      <div className="mt-1"><MediaPicker label="" value={row[sf.key]} onChange={(v) => setPath(`${f.path}[${i}].${sf.key}`, v)} /></div>
                    ) : sf.type === "textarea" ? (
                      <textarea rows={2} className={`${input} mt-1 resize-y`} value={row[sf.key] || ""} onChange={(e) => setPath(`${f.path}[${i}].${sf.key}`, e.target.value)} />
                    ) : (
                      <input className={`${input} mt-1`} value={row[sf.key] || ""} onChange={(e) => setPath(`${f.path}[${i}].${sf.key}`, e.target.value)} />
                    )}
                  </label>
                ))}
              </div>
            ))}
            <button onClick={() => setPath(f.path, [...arr, {}])} className="inline-flex items-center gap-1 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted-foreground hover:border-foreground" data-testid={`page-${f.path}-add`}><Plus className="h-4 w-4" /> Add</button>
          </div>
        </div>
      );
    }
    return (
      <label key={f.path} className="block">
        <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{f.label}</span>
        {f.type === "textarea"
          ? <textarea rows={2} className={`${input} mt-2 resize-y`} value={value || ""} onChange={(e) => setPath(f.path, e.target.value)} data-testid={`page-${f.path}`} />
          : <input className={`${input} mt-2`} value={value || ""} onChange={(e) => setPath(f.path, e.target.value)} data-testid={`page-${f.path}`} />}
      </label>
    );
  };

  return (
    <div data-testid={`page-editor-${pageId}`}>
      <PageHeader
        title={`${TITLES[pageId] || pageId} Content`}
        description="Edit every section. Saved changes appear on the live site instantly."
        action={<button onClick={save} disabled={saving} className="rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background disabled:opacity-60" data-testid="page-save">{saving ? "Saving…" : "Save changes"}</button>}
      />
      <div className="space-y-6">
        {schema.map((sec) => (
          <div key={sec.section} className="rounded-xl border border-border bg-background p-6">
            <h2 className="mb-5 font-display text-xl tracking-tight">{sec.section}</h2>
            <div className="space-y-4">{sec.fields.map(renderField)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
