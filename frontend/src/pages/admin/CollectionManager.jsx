import { useState } from "react";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { api, formatApiErrorDetail } from "@/lib/api";
import { useGet } from "@/hooks/useApi";
import { PageHeader, Field } from "@/components/admin/AdminForm";
import { COLLECTIONS } from "@/pages/admin/schemas";

export default function CollectionManager({ collectionKey }) {
  const config = COLLECTIONS[collectionKey];
  const listPath = `/${config.endpoint}${config.listQuery || ""}`;
  const { data, loading, setData } = useGet(listPath, [collectionKey]);
  const [editing, setEditing] = useState(null); // object or null
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);

  const openNew = () => { setEditing({ ...config.defaults }); setOpen(true); };
  const openEdit = (item) => { setEditing({ ...config.defaults, ...item }); setOpen(true); };

  const setField = (key, value) => setEditing((e) => ({ ...e, [key]: value }));

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...editing };
      if (editing.id) {
        const { data: updated } = await api.put(`/admin/${config.endpoint}/${editing.id}`, payload);
        setData((list) => (list || []).map((x) => (x.id === updated.id ? updated : x)));
        toast.success("Saved");
      } else {
        const { data: created } = await api.post(`/admin/${config.endpoint}`, payload);
        setData((list) => [created, ...(list || [])]);
        toast.success("Created");
      }
      setOpen(false);
    } catch (e) {
      toast.error(formatApiErrorDetail(e.response?.data?.detail) || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    try {
      await api.delete(`/admin/${config.endpoint}/${deleteId}`);
      setData((list) => (list || []).filter((x) => x.id !== deleteId));
      toast.success("Deleted");
    } catch (e) {
      toast.error("Delete failed");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div data-testid={`manager-${collectionKey}`}>
      <PageHeader
        title={config.title}
        description={`Manage your ${config.title.toLowerCase()}. Changes appear on the live site instantly.`}
        action={
          <button onClick={openNew} className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-transform hover:-translate-y-0.5" data-testid={`add-${collectionKey}`}>
            <Plus className="h-4 w-4" /> New {config.label}
          </button>
        }
      />

      <div className="overflow-hidden rounded-xl border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              {config.columns.map((c) => <TableHead key={c.key}>{c.label}</TableHead>)}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(data || []).map((item) => (
              <TableRow key={item.id} data-testid={`row-${collectionKey}-${item.id}`}>
                {config.columns.map((c) => (
                  <TableCell key={c.key} className="max-w-xs truncate">
                    {c.type === "boolean" ? (item[c.key] ? <Star className="h-4 w-4 fill-brand text-brand" /> : "—") : String(item[c.key] ?? "—")}
                  </TableCell>
                ))}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(item)} className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground" data-testid={`edit-${item.id}`}><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => setDeleteId(item.id)} className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-destructive" data-testid={`delete-${item.id}`}><Trash2 className="h-4 w-4" /></button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!loading && (data || []).length === 0 && (
              <TableRow><TableCell colSpan={config.columns.length + 1} className="py-12 text-center text-muted-foreground">No {config.title.toLowerCase()} yet. Create your first one.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Editor dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? `Edit ${config.label}` : `New ${config.label}`}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-5">
              {config.fields.map((f) => (
                <Field key={f.key} field={f} value={editing[f.key]} onChange={setField} />
              ))}
            </div>
          )}
          <DialogFooter>
            <button onClick={() => setOpen(false)} className="rounded-lg border border-border px-4 py-2 text-sm">Cancel</button>
            <button onClick={save} disabled={saving} className="rounded-lg bg-foreground px-5 py-2 text-sm font-medium text-background disabled:opacity-60" data-testid={`save-${collectionKey}`}>{saving ? "Saving…" : "Save"}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this {config.label}?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={remove} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" data-testid="confirm-delete">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
