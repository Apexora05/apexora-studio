import { NavLink, useNavigate, Outlet, Link } from "react-router-dom";
import {
  LayoutDashboard, Home, Info, Briefcase, FolderKanban, FileText,
  MessageSquareQuote, HelpCircle, Image, Search, Inbox, Settings as Cog,
  Users as UsersIcon, LogOut, ExternalLink, Sun, Moon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

const groups = [
  { title: "Overview", items: [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  ]},
  { title: "Pages", items: [
    { to: "/admin/pages/home", label: "Homepage", icon: Home },
    { to: "/admin/pages/about", label: "About", icon: Info },
  ]},
  { title: "Content", items: [
    { to: "/admin/services", label: "Services", icon: Briefcase },
    { to: "/admin/portfolio", label: "Portfolio", icon: FolderKanban },
    { to: "/admin/case-studies", label: "Case Studies", icon: FileText },
    { to: "/admin/blog", label: "Blog", icon: FileText },
    { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
    { to: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  ]},
  { title: "System", items: [
    { to: "/admin/media", label: "Media Library", icon: Image },
    { to: "/admin/seo", label: "SEO", icon: Search },
    { to: "/admin/settings", label: "Settings", icon: Cog },
    { to: "/admin/users", label: "Users", icon: UsersIcon, role: "admin" },
  ]},
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  const doLogout = async () => {
    await logout();
    navigate("/admin");
  };

  return (
    <div className="flex min-h-screen bg-secondary/30 text-foreground">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-background lg:flex" data-testid="admin-sidebar">
        <div className="flex items-center justify-between px-6 py-5">
          <Link to="/admin/dashboard" className="font-display text-xl font-semibold tracking-tight">
            Apexora<span className="text-brand">.</span>
          </Link>
          <button onClick={toggle} className="grid h-8 w-8 place-items-center rounded-full border border-border" aria-label="Toggle theme" data-testid="admin-theme-toggle">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
        <nav className="hide-scrollbar flex-1 overflow-y-auto px-3 py-2">
          {groups.map((g) => (
            <div key={g.title} className="mb-6">
              <p className="px-3 pb-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{g.title}</p>
              {g.items.filter((i) => !i.role || i.role === user?.role).map((i) => (
                <NavLink
                  key={i.to}
                  to={i.to}
                  data-testid={`admin-nav-${i.label.toLowerCase().replace(/\s+/g, "-")}`}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      isActive ? "bg-foreground text-background" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`
                  }
                >
                  <i.icon className="h-4 w-4" />
                  {i.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <a href="/" target="_blank" rel="noreferrer" className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground" data-testid="admin-view-site">
            <ExternalLink className="h-4 w-4" /> View site
          </a>
          <div className="flex items-center justify-between rounded-lg px-3 py-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user?.name || user?.email}</p>
              <p className="text-xs capitalize text-muted-foreground">{user?.role}</p>
            </div>
            <button onClick={doLogout} className="text-muted-foreground hover:text-destructive" aria-label="Logout" data-testid="admin-logout">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-border bg-background px-4 py-3 lg:hidden">
        <Link to="/admin/dashboard" className="font-display text-lg font-semibold">Apexora<span className="text-brand">.</span></Link>
        <button onClick={doLogout} className="text-sm text-muted-foreground" data-testid="admin-logout-mobile">Logout</button>
      </div>

      {/* Content */}
      <div className="flex-1 lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-8 pt-20 sm:px-8 lg:pt-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
