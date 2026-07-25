import { useState } from "react";
import { UploadCloud, Image as ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { api, resolveMedia } from "@/lib/api";
import { useGet } from "@/hooks/useApi";

export default function MediaPicker({ value, onChange, label = "Image", testid }) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { data: media, setData } = useGet(open ? "/admin/media" : null, [open]);
  const [urlInput, setUrlInput] = useState("");

  const upload = async (file) => {
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "general");
    fd.append("alt", file.name);
    try {
      const { data } = await api.post("/admin/media", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setData((m) => [data, ...(m || [])]);
      onChange(data.url);
      toast.success("Uploaded");
      setOpen(false);
    } catch (e) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
      <div className="mt-2 flex items-center gap-3">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-border bg-secondary">
          {value ? <img src={resolveMedia(value)} alt="" className="h-full w-full object-cover" /> : <div className="grid h-full w-full place-items-center text-muted-foreground"><ImageIcon className="h-5 w-5" /></div>}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button type="button" className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-accent" data-testid={testid || "media-picker-open"}>Choose image</button>
          </DialogTrigger>
          {value && (
            <button type="button" onClick={() => onChange("")} className="text-sm text-muted-foreground hover:text-destructive" data-testid="media-picker-clear">
              <X className="h-4 w-4" />
            </button>
          )}
          <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
            <DialogHeader><DialogTitle>Media Library</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border py-8 text-sm text-muted-foreground hover:border-foreground" data-testid="media-picker-upload">
                <UploadCloud className="h-5 w-5" /> {uploading ? "Uploading…" : "Click to upload an image"}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
              </label>
              <div className="flex gap-2">
                <input value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="…or paste an image URL" className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none" data-testid="media-picker-url" />
                <button type="button" onClick={() => { if (urlInput) { onChange(urlInput); setOpen(false); } }} className="rounded-lg bg-foreground px-4 text-sm text-background">Use</button>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {(media || []).map((m) => (
                  <button key={m.id} type="button" onClick={() => { onChange(m.url); setOpen(false); }} className="group overflow-hidden rounded-md border border-border" data-testid={`media-item-${m.id}`}>
                    <img src={resolveMedia(m.url)} alt={m.alt} className="aspect-square w-full object-cover transition-transform group-hover:scale-105" />
                  </button>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
