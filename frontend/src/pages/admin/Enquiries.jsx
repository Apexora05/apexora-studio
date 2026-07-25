import { useState } from "react";
import { Download, Mail, Trash2, MailOpen, Circle } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api, TOKEN_KEY, API } from "@/lib/api";
import { useGet } from "@/hooks/useApi";
import { PageHeader } from "@/components/admin/AdminForm";

export default function Enquiries() {
  const { data, setData } = useGet("/admin/enquiries");
  const [active, setActive] = useState(null);
  const [filter, setFilter] = useState("all");

  const list = (data || []).filter((e) => filter === "all" || (filter === "unread" ? !e.read : e.read));

  const toggleRead = async (e, read) => {
    try {
      await api.patch(`/admin/enquiries/${e.id}`, { read });
      setData((l) => l.map((x) => (x.id === e.id ? { ...x, read } : x)));
    } catch (_) { toast.error("Update failed"); }
  };

  const open = async (e) => {
    setActive(e);
    if (!e.read) toggleRead(e, true);
  };

  const remove = async (id) => {
    try {
      await api.delete(`/admin/enquiries/${id}`);
      setData((l) => l.filter((x) => x.id !== id));
      toast.success("Deleted");
      if (active?.id === id) setActive(null);
    } catch (_) { toast.error("Delete failed"); }
  };

  const exportCsv = async () => {
    try {
      const res = await fetch(`${API}/admin/enquiries-export`, { headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` } });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "enquiries.csv"; a.click();
      URL.revokeObjectURL(url);
    } catch (_) { toast.error("Export failed"); }
  };

  return (
    <div data-testid="admin-enquiries">
      <PageHeader
        title="Enquiries"
        description="Every contact submission is stored here."
        action={
          <button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm hover:bg-accent" data-testid="export-csv">
            <Download className="h-4 w-4" /> Export CSV
          </button>
        }
      />

      <div className="mb-4 flex gap-2">
        {["all", "unread", "read"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-4 py-1.5 text-sm capitalize transition-colors ${filter === f ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"}`} data-testid={`filter-${f}`}>{f}</button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-background">
        {list.map((e) => (
          <div key={e.id} className={`flex items-center gap-4 border-b border-border px-5 py-4 last:border-0 ${!e.read ? "bg-brand/5" : ""}`} data-testid={`enquiry-${e.id}`}>
            <button onClick={() => toggleRead(e, !e.read)} className="text-muted-foreground" title={e.read ? "Mark unread" : "Mark read"} data-testid={`toggle-read-${e.id}`}>
              {e.read ? <MailOpen className="h-4 w-4" /> : <Circle className="h-3 w-3 fill-brand text-brand" />}
            </button>
            <button onClick={() => open(e)} className="min-w-0 flex-1 text-left">
              <p className="truncate font-medium">{e.name} <span className="font-normal text-muted-foreground">· {e.email}</span></p>
              <p className="truncate text-sm text-muted-foreground">{e.message}</p>
            </button>
            <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">{new Date(e.created_at).toLocaleDateString()}</span>
            <button onClick={() => remove(e.id)} className="text-muted-foreground hover:text-destructive" data-testid={`delete-enquiry-${e.id}`}><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
        {list.length === 0 && <p className="py-16 text-center text-muted-foreground">No enquiries here.</p>}
      </div>

      <Dialog open={!!active} onOpenChange={(v) => !v && setActive(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Enquiry from {active?.name}</DialogTitle></DialogHeader>
          {active && (
            <div className="space-y-3 text-sm">
              {[["Email", active.email], ["Company", active.company], ["Website", active.website], ["Phone", active.phone], ["Budget", active.budget]].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="text-right">{v || "—"}</span>
                </div>
              ))}
              <div>
                <p className="text-muted-foreground">Message</p>
                <p className="mt-1 leading-relaxed">{active.message}</p>
              </div>
              <a href={`mailto:${active.email}`} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm text-background" data-testid="reply-email">
                <Mail className="h-4 w-4" /> Reply by email
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
