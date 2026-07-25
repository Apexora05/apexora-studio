import { useState } from "react";
import { Plus, Trash2, Pencil, Shield, User } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api, formatApiErrorDetail } from "@/lib/api";
import { useGet } from "@/hooks/useApi";
import { useAuth } from "@/context/AuthContext";
import { PageHeader } from "@/components/admin/AdminForm";

const input = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground";

export default function Users() {
  const { user: me } = useAuth();
  const { data, setData } = useGet("/admin/users");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const openNew = () => { setEditing({ email: "", name: "", role: "editor", password: "" }); setOpen(true); };
  const openEdit = (u) => { setEditing({ ...u, password: "" }); setOpen(true); };

  const save = async () => {
    try {
      if (editing.id) {
        const payload = { name: editing.name, role: editing.role };
        if (editing.password) payload.password = editing.password;
        const { data: upd } = await api.put(`/admin/users/${editing.id}`, payload);
        setData((l) => l.map((x) => (x.id === upd.id ? upd : x)));
        toast.success("User updated");
      } else {
        const { data: created } = await api.post("/admin/users", editing);
        setData((l) => [...(l || []), created]);
        toast.success("User created");
      }
      setOpen(false);
    } catch (e) { toast.error(formatApiErrorDetail(e.response?.data?.detail)); }
  };

  const remove = async (id) => {
    try { await api.delete(`/admin/users/${id}`); setData((l) => l.filter((x) => x.id !== id)); toast.success("Deleted"); }
    catch (e) { toast.error(formatApiErrorDetail(e.response?.data?.detail)); }
  };

  return (
    <div data-testid="admin-users">
      <PageHeader
        title="User Management"
        description="Admins have full access. Editors can manage content."
        action={<button onClick={openNew} className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm text-background" data-testid="add-user"><Plus className="h-4 w-4" /> New user</button>}
      />

      <div className="overflow-hidden rounded-xl border border-border bg-background">
        {(data || []).map((u) => (
          <div key={u.id} className="flex items-center gap-4 border-b border-border px-5 py-4 last:border-0" data-testid={`user-${u.id}`}>
            <span className={`grid h-9 w-9 place-items-center rounded-full ${u.role === "admin" ? "bg-brand/10 text-brand" : "bg-secondary text-muted-foreground"}`}>
              {u.role === "admin" ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{u.name || u.email} {u.id === me?.id && <span className="text-xs text-muted-foreground">(you)</span>}</p>
              <p className="truncate text-sm text-muted-foreground">{u.email}</p>
            </div>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs capitalize">{u.role}</span>
            <button onClick={() => openEdit(u)} className="text-muted-foreground hover:text-foreground" data-testid={`edit-user-${u.id}`}><Pencil className="h-4 w-4" /></button>
            {u.id !== me?.id && <button onClick={() => remove(u.id)} className="text-muted-foreground hover:text-destructive" data-testid={`delete-user-${u.id}`}><Trash2 className="h-4 w-4" /></button>}
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit user" : "New user"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <label className="block"><span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Name</span><input className={`${input} mt-2`} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} data-testid="user-name" /></label>
              <label className="block"><span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Email</span><input disabled={!!editing.id} className={`${input} mt-2 disabled:opacity-60`} value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} data-testid="user-email" /></label>
              <div><span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Role</span>
                <Select value={editing.role} onValueChange={(v) => setEditing({ ...editing, role: v })}>
                  <SelectTrigger className={`${input} mt-2`} data-testid="user-role"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="admin">Admin</SelectItem><SelectItem value="editor">Editor</SelectItem></SelectContent>
                </Select>
              </div>
              <label className="block"><span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{editing.id ? "New password (optional)" : "Password"}</span><input type="password" className={`${input} mt-2`} value={editing.password} onChange={(e) => setEditing({ ...editing, password: e.target.value })} data-testid="user-password" /></label>
            </div>
          )}
          <DialogFooter>
            <button onClick={() => setOpen(false)} className="rounded-lg border border-border px-4 py-2 text-sm">Cancel</button>
            <button onClick={save} className="rounded-lg bg-foreground px-5 py-2 text-sm text-background" data-testid="save-user">Save</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
