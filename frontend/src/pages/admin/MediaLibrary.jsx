import { useRef, useState } from "react";
import { UploadCloud, Trash2, Copy, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api, resolveMedia } from "@/lib/api";
import { useGet } from "@/hooks/useApi";
import { PageHeader } from "@/components/admin/AdminForm";

export default function MediaLibrary() {
  const { data, setData } = useGet("/admin/media");
  const [folder, setFolder] = useState("general");
  const [search, setSearch] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [active, setActive] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();
  const replaceRef = useRef();

  const folders = Array.from(new Set(["general", ...((data || []).map((m) => m.folder))]));
  const list = (data || []).filter((m) => (!search || m.filename?.toLowerCase().includes(search.toLowerCase()) || m.alt?.toLowerCase().includes(search.toLowerCase())));

  const uploadFiles = async (files) => {
    setUploading(true);
    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      fd.append("alt", file.name);
      try {
        const { data: created } = await api.post("/admin/media", fd, { headers: { "Content-Type": "multipart/form-data" } });
        setData((m) => [created, ...(m || [])]);
      } catch (_) { toast.error(`Failed to upload ${file.name}`); }
    }
    setUploading(false);
    toast.success("Upload complete");
  };

  const onDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    uploadFiles(Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/")));
  };

  const remove = async (id) => {
    try { await api.delete(`/admin/media/${id}`); setData((m) => m.filter((x) => x.id !== id)); setActive(null); toast.success("Deleted"); }
    catch (_) { toast.error("Delete failed"); }
  };

  const saveMeta = async () => {
    try { await api.put(`/admin/media/${active.id}`, { alt: active.alt, folder: active.folder }); setData((m) => m.map((x) => x.id === active.id ? active : x)); toast.success("Saved"); }
    catch (_) { toast.error("Save failed"); }
  };

  const doReplace = async (file) => {
    if (!file) return;
    const fd = new FormData(); fd.append("file", file);
    try { const { data: upd } = await api.post(`/admin/media/${active.id}/replace`, fd, { headers: { "Content-Type": "multipart/form-data" } }); setData((m) => m.map((x) => x.id === upd.id ? upd : x)); toast.success("Replaced (URL unchanged)"); }
    catch (_) { toast.error("Replace failed"); }
  };

  const copyUrl = (m) => { navigator.clipboard.writeText(resolveMedia(m.url)); toast.success("URL copied"); };

  return (
    <div data-testid="admin-media">
      <PageHeader title="Media Library" description="Upload, organise and reuse images across your site." />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
          <span className="text-xs text-muted-foreground">Folder</span>
          <select value={folder} onChange={(e) => setFolder(e.target.value)} className="bg-transparent text-sm outline-none" data-testid="media-folder-select">
            {folders.map((f) => <option key={f} value={f}>{f}</option>)}
            <option value="new">+ new folder…</option>
          </select>
        </div>
        {folder === "new" && (
          <input placeholder="Folder name" onBlur={(e) => setFolder(e.target.value || "general")} className="rounded-lg border border-border bg-background px-3 py-2 text-sm" data-testid="media-new-folder" />
        )}
        <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search media" className="bg-transparent text-sm outline-none" data-testid="media-search" />
        </div>
        <button onClick={() => fileRef.current?.click()} className="ml-auto inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm text-background" data-testid="media-upload-btn">
          <UploadCloud className="h-4 w-4" /> Upload
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => uploadFiles(Array.from(e.target.files))} />
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`rounded-xl border-2 border-dashed p-6 transition-colors ${dragOver ? "border-brand bg-brand/5" : "border-border"}`}
        data-testid="media-dropzone"
      >
        {uploading && <p className="mb-4 text-sm text-brand">Uploading…</p>}
        {list.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">Drag & drop images here, or click Upload.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {list.map((m) => (
              <div key={m.id} className="group relative overflow-hidden rounded-lg border border-border" data-testid={`media-${m.id}`}>
                <button onClick={() => setActive(m)} className="block aspect-square w-full">
                  <img src={resolveMedia(m.url)} alt={m.alt} loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                </button>
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-background/90 px-2 py-1.5 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                  <button onClick={() => copyUrl(m)} className="text-muted-foreground hover:text-foreground" title="Copy URL"><Copy className="h-3.5 w-3.5" /></button>
                  <button onClick={() => remove(m.id)} className="text-muted-foreground hover:text-destructive" title="Delete" data-testid={`media-delete-${m.id}`}><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!active} onOpenChange={(v) => !v && setActive(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Image details</DialogTitle></DialogHeader>
          {active && (
            <div className="space-y-4">
              <img src={resolveMedia(active.url)} alt={active.alt} className="max-h-64 w-full rounded-lg object-contain" />
              <label className="block">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Alt text</span>
                <input value={active.alt || ""} onChange={(e) => setActive({ ...active, alt: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" data-testid="media-alt-input" />
              </label>
              <div className="flex flex-wrap gap-2">
                <button onClick={saveMeta} className="rounded-lg bg-foreground px-4 py-2 text-sm text-background" data-testid="media-save-meta">Save</button>
                <button onClick={() => replaceRef.current?.click()} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm"><RefreshCw className="h-4 w-4" /> Replace</button>
                <input ref={replaceRef} type="file" accept="image/*" className="hidden" onChange={(e) => doReplace(e.target.files?.[0])} />
                <button onClick={() => remove(active.id)} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-destructive"><Trash2 className="h-4 w-4" /> Delete</button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
