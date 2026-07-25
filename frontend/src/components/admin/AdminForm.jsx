import { Plus, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import MediaPicker from "@/components/admin/MediaPicker";

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-foreground";

export function PageHeader({ title, description, action }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Field({ field, value, onChange }) {
  const { key, label, type = "text", options = [], subfields = [], help } = field;
  const set = (v) => onChange(key, v);

  if (type === "boolean") {
    return (
      <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
        <span className="text-sm">{label}</span>
        <Switch checked={!!value} onCheckedChange={set} data-testid={`field-${key}`} />
      </div>
    );
  }

  const wrap = (children) => (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
      <div className="mt-2">{children}</div>
      {help && <span className="mt-1 block text-xs text-muted-foreground">{help}</span>}
    </label>
  );

  switch (type) {
    case "textarea":
      return wrap(<textarea rows={3} className={`${inputCls} resize-y`} value={value || ""} onChange={(e) => set(e.target.value)} data-testid={`field-${key}`} />);
    case "richtext":
      return wrap(<textarea rows={10} className={`${inputCls} resize-y font-mono text-xs leading-relaxed`} value={value || ""} onChange={(e) => set(e.target.value)} data-testid={`field-${key}`} />);
    case "number":
      return wrap(<input type="number" className={inputCls} value={value ?? ""} onChange={(e) => set(e.target.value === "" ? "" : Number(e.target.value))} data-testid={`field-${key}`} />);
    case "select":
      return wrap(
        <Select value={value || ""} onValueChange={set}>
          <SelectTrigger className={inputCls} data-testid={`field-${key}`}><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent>{options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
        </Select>
      );
    case "tags":
      return wrap(<input className={inputCls} value={Array.isArray(value) ? value.join(", ") : value || ""} onChange={(e) => set(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} placeholder="comma, separated, values" data-testid={`field-${key}`} />);
    case "image":
      return <MediaPicker label={label} value={value} onChange={set} testid={`field-${key}`} />;
    case "gallery":
      return (
        <div>
          <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
          <div className="mt-2 space-y-3">
            {(value || []).map((img, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg border border-border p-2">
                <MediaPicker label={`Image ${i + 1}`} value={img} onChange={(v) => { const arr = [...(value || [])]; arr[i] = v; set(arr); }} testid={`gallery-${key}-${i}`} />
                <button type="button" onClick={() => set((value || []).filter((_, j) => j !== i))} className="ml-auto text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
            <button type="button" onClick={() => set([...(value || []), ""])} className="inline-flex items-center gap-1 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted-foreground hover:border-foreground" data-testid={`gallery-add-${key}`}>
              <Plus className="h-4 w-4" /> Add image
            </button>
          </div>
        </div>
      );
    case "objectgroup": {
      const obj = value || {};
      return (
        <div>
          <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
          <div className="mt-2 space-y-2 rounded-lg border border-border p-3">
            {subfields.map((sf) => (
              <label key={sf.key} className="block">
                <span className="text-[11px] uppercase tracking-wide text-muted-foreground">{sf.label}</span>
                {sf.type === "textarea" ? (
                  <textarea rows={2} className={`${inputCls} mt-1 resize-y`} value={obj[sf.key] || ""} onChange={(e) => set({ ...obj, [sf.key]: e.target.value })} data-testid={`field-${key}-${sf.key}`} />
                ) : (
                  <input className={`${inputCls} mt-1`} value={obj[sf.key] || ""} onChange={(e) => set({ ...obj, [sf.key]: e.target.value })} data-testid={`field-${key}-${sf.key}`} />
                )}
              </label>
            ))}
          </div>
        </div>
      );
    }
    case "objectlist":
      return (
        <div>
          <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
          <div className="mt-2 space-y-3">
            {(value || []).map((row, i) => (
              <div key={i} className="space-y-2 rounded-lg border border-border p-3">
                <div className="flex justify-end">
                  <button type="button" onClick={() => set((value || []).filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive" data-testid={`objectlist-remove-${key}-${i}`}><Trash2 className="h-4 w-4" /></button>
                </div>
                {subfields.map((sf) => (
                  <label key={sf.key} className="block">
                    <span className="text-[11px] uppercase tracking-wide text-muted-foreground">{sf.label}</span>
                    {sf.type === "textarea" ? (
                      <textarea rows={2} className={`${inputCls} mt-1 resize-y`} value={row[sf.key] || ""} onChange={(e) => { const arr = [...value]; arr[i] = { ...arr[i], [sf.key]: e.target.value }; set(arr); }} />
                    ) : sf.type === "image" ? (
                      <div className="mt-1"><MediaPicker label="" value={row[sf.key]} onChange={(v) => { const arr = [...value]; arr[i] = { ...arr[i], [sf.key]: v }; set(arr); }} /></div>
                    ) : (
                      <input className={`${inputCls} mt-1`} value={row[sf.key] || ""} onChange={(e) => { const arr = [...value]; arr[i] = { ...arr[i], [sf.key]: e.target.value }; set(arr); }} />
                    )}
                  </label>
                ))}
              </div>
            ))}
            <button type="button" onClick={() => set([...(value || []), {}])} className="inline-flex items-center gap-1 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted-foreground hover:border-foreground" data-testid={`objectlist-add-${key}`}>
              <Plus className="h-4 w-4" /> Add item
            </button>
          </div>
        </div>
      );
    default:
      return wrap(<input className={inputCls} value={value || ""} onChange={(e) => set(e.target.value)} data-testid={`field-${key}`} />);
  }
}
