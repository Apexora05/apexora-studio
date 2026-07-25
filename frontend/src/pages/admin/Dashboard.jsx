import { Link } from "react-router-dom";
import { Inbox, FolderKanban, FileText, Image, Users, Briefcase, ArrowUpRight } from "lucide-react";
import { useGet } from "@/hooks/useApi";
import { useAuth } from "@/context/AuthContext";
import { PageHeader } from "@/components/admin/AdminForm";

const cards = [
  { key: "enquiries", label: "Enquiries", icon: Inbox, to: "/admin/enquiries", sub: "enquiries_unread", subLabel: "unread" },
  { key: "portfolio", label: "Projects", icon: FolderKanban, to: "/admin/portfolio" },
  { key: "case_studies", label: "Case Studies", icon: FileText, to: "/admin/case-studies" },
  { key: "posts", label: "Articles", icon: FileText, to: "/admin/blog", sub: "posts_published", subLabel: "published" },
  { key: "services", label: "Services", icon: Briefcase, to: "/admin/services" },
  { key: "media", label: "Media", icon: Image, to: "/admin/media" },
  { key: "users", label: "Users", icon: Users, to: "/admin/users" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { data: stats } = useGet("/admin/stats");
  const { data: enquiries } = useGet("/admin/enquiries");

  return (
    <div data-testid="admin-dashboard">
      <PageHeader title={`Welcome back, ${user?.name?.split(" ")[0] || "there"}.`} description="Here's what's happening across the studio." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.key} to={c.to} className="group rounded-xl border border-border bg-background p-5 transition-colors hover:border-foreground" data-testid={`stat-${c.key}`}>
            <div className="flex items-center justify-between">
              <c.icon className="h-5 w-5 text-brand" />
              <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <div className="mt-6 font-display text-4xl tracking-tight">{stats?.[c.key] ?? "—"}</div>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <span>{c.label}</span>
              {c.sub && stats?.[c.sub] > 0 && <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs text-brand">{stats[c.sub]} {c.subLabel}</span>}
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-border bg-background p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl tracking-tight">Recent enquiries</h2>
          <Link to="/admin/enquiries" className="text-sm text-brand hover:underline">View all</Link>
        </div>
        <div className="divide-y divide-border">
          {(enquiries || []).slice(0, 5).map((e) => (
            <div key={e.id} className="flex items-center justify-between py-3" data-testid={`recent-enquiry-${e.id}`}>
              <div className="min-w-0">
                <p className="truncate font-medium">{e.name} {!e.read && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-brand align-middle" />}</p>
                <p className="truncate text-sm text-muted-foreground">{e.email} · {e.company || "—"}</p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">{new Date(e.created_at).toLocaleDateString()}</span>
            </div>
          ))}
          {(enquiries || []).length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No enquiries yet.</p>}
        </div>
      </div>
    </div>
  );
}
