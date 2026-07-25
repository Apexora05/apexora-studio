import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { useSite } from "@/context/SiteContext";
import { api } from "@/lib/api";
import { BtnLink } from "@/components/site/ui";

const socialLabels = {
  twitter: "Twitter",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  dribbble: "Dribbble",
};

export default function Footer() {
  const { settings } = useSite();
  const [email, setEmail] = useState("");
  const year = new Date().getFullYear();
  const socials = settings?.socials || {};

  const submit = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await api.post("/enquiries", {
        name: "Newsletter subscriber",
        email,
        message: "Requested to join the Apexora journal newsletter.",
      });
      toast.success("You're on the list. Welcome to the studio.");
      setEmail("");
    } catch (err) {
      toast.error("Couldn't subscribe right now. Please try again.");
    }
  };

  return (
    <footer className="relative z-10 border-t border-border bg-background" data-testid="site-footer">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link to="/" className="font-display text-3xl font-semibold tracking-tight">
              {settings?.logo_text || "Apexora"}<span className="text-brand">.</span>
            </Link>
            <p className="mt-5 max-w-sm text-muted-foreground">
              {settings?.footer_note || "Designing the web's most trusted brands."}
            </p>
            <form onSubmit={submit} className="mt-8 flex max-w-sm items-center gap-2 border-b border-border pb-2" data-testid="footer-newsletter-form">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email for the journal"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                data-testid="footer-newsletter-input"
              />
              <button type="submit" className="text-sm font-medium text-brand hover:underline" data-testid="footer-newsletter-submit">
                Join
              </button>
            </form>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Explore</p>
            <ul className="mt-5 space-y-3">
              {(settings?.nav || []).map((i) => (
                <li key={i.path}>
                  <Link to={i.path} className="text-foreground transition-colors hover:text-brand">{i.label}</Link>
                </li>
              ))}
              <li><Link to="/case-studies" className="text-foreground transition-colors hover:text-brand">Case Studies</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Studio</p>
            <ul className="mt-5 space-y-3">
              <li><a href={`mailto:${settings?.email}`} className="text-foreground hover:text-brand">{settings?.email}</a></li>
              {settings?.phone && <li className="text-muted-foreground">{settings.phone}</li>}
              {settings?.address && <li className="max-w-[16rem] text-muted-foreground">{settings.address}</li>}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              {Object.entries(socials).filter(([, v]) => v).map(([k, v]) => (
                <a
                  key={k}
                  href={v}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-border px-4 py-1.5 text-xs text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                  data-testid={`footer-social-${k}`}
                >
                  {socialLabels[k] || k}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <p>© {year} {settings?.brand_name || "Apexora Studio"}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-foreground" data-testid="footer-privacy">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground" data-testid="footer-terms">Terms &amp; Conditions</Link>
            <Link to="/admin" className="hover:text-foreground" data-testid="footer-admin">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
