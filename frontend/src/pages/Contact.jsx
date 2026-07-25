import { useState } from "react";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api, formatApiErrorDetail } from "@/lib/api";
import { useSite } from "@/context/SiteContext";
import { useGet } from "@/hooks/useApi";
import Seo from "@/components/site/Seo";
import { Eyebrow } from "@/components/site/ui";

const BUDGETS = ["Under $10k", "$10k – $25k", "$25k – $50k", "$50k – $100k", "$100k+"];

const Field = ({ label, children }) => (
  <label className="block">
    <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</span>
    <div className="mt-2">{children}</div>
  </label>
);

const inputCls =
  "w-full border-b border-border bg-transparent py-3 text-lg outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-foreground";

export default function Contact() {
  const { settings } = useSite();
  const { data: page } = useGet("/pages/contact");
  const { data: seo } = useGet("/seo-by-path?path=/contact");
  const hero = page?.hero || {};
  const [form, setForm] = useState({ name: "", email: "", company: "", website: "", phone: "", budget: "", message: "", honeypot: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e?.target ? e.target.value : e }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in your name, email and a short message.");
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await api.post("/enquiries", form);
      setDone(true);
      toast.success(data.message || "Thanks — we'll be in touch soon.");
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid="contact-page">
      <Seo title={seo?.meta_title || "Contact — Apexora Studio"} description={seo?.meta_description || "Start a project or request a free website audit from Apexora Studio."} image={seo?.og_image} path="/contact" />

      <section className="px-5 pt-36 sm:px-8 md:pt-44">
        <div className="mx-auto max-w-7xl">
          <Eyebrow>{hero.eyebrow || "Contact"}</Eyebrow>
          <h1 className="mt-8 max-w-4xl font-display text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
            {hero.title || "Let's start something exceptional."}
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
            {hero.subtext || "Tell us about your project. We reply to every enquiry within one business day."}
          </p>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-16 md:grid-cols-12">
          {/* Form */}
          <div className="md:col-span-7">
            {done ? (
              <div className="rounded-sm border border-border bg-secondary/40 p-10 text-center" data-testid="contact-success">
                <h2 className="font-display text-3xl tracking-tight">Message received.</h2>
                <p className="mt-4 text-muted-foreground">Thank you for reaching out. A member of the studio will be in touch within one business day.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-8" data-testid="contact-form">
                <input type="text" tabIndex={-1} autoComplete="off" value={form.honeypot} onChange={set("honeypot")} className="hidden" aria-hidden="true" />
                <div className="grid gap-8 sm:grid-cols-2">
                  <Field label="Name *"><input className={inputCls} placeholder="Jane Doe" value={form.name} onChange={set("name")} data-testid="contact-name" /></Field>
                  <Field label="Email *"><input type="email" className={inputCls} placeholder="jane@company.com" value={form.email} onChange={set("email")} data-testid="contact-email" /></Field>
                  <Field label="Company"><input className={inputCls} placeholder="Company Inc." value={form.company} onChange={set("company")} data-testid="contact-company" /></Field>
                  <Field label="Website"><input className={inputCls} placeholder="company.com" value={form.website} onChange={set("website")} data-testid="contact-website" /></Field>
                  <Field label="Phone"><input className={inputCls} placeholder="+1 (555) 000-0000" value={form.phone} onChange={set("phone")} data-testid="contact-phone" /></Field>
                  <Field label="Project Budget">
                    <Select value={form.budget} onValueChange={set("budget")}>
                      <SelectTrigger className="w-full rounded-none border-0 border-b border-border bg-transparent px-0 py-3 text-lg focus:ring-0" data-testid="contact-budget">
                        <SelectValue placeholder="Select a range" />
                      </SelectTrigger>
                      <SelectContent>
                        {BUDGETS.map((b) => (
                          <SelectItem key={b} value={b} data-testid={`budget-option-${b}`}>{b}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
                <Field label="Message *">
                  <textarea rows={5} className={`${inputCls} resize-none`} placeholder="Tell us about your goals, timeline and what success looks like." value={form.message} onChange={set("message")} data-testid="contact-message" />
                </Field>
                <button
                  type="submit"
                  disabled={submitting}
                  data-testid="contact-submit"
                  className="group inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-sm font-medium text-background transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {submitting ? "Sending…" : "Send enquiry"}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div className="md:col-span-5 md:pl-8">
            <div className="space-y-8">
              <a href={`mailto:${settings?.email}`} className="flex items-start gap-4 group" data-testid="contact-info-email">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border text-brand"><Mail className="h-4 w-4" /></span>
                <span>
                  <span className="block text-xs uppercase tracking-[0.16em] text-muted-foreground">Email</span>
                  <span className="text-lg transition-colors group-hover:text-brand">{settings?.email}</span>
                </span>
              </a>
              {settings?.phone && (
                <div className="flex items-start gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border text-brand"><Phone className="h-4 w-4" /></span>
                  <span>
                    <span className="block text-xs uppercase tracking-[0.16em] text-muted-foreground">Phone</span>
                    <span className="text-lg">{settings.phone}</span>
                  </span>
                </div>
              )}
              {settings?.address && (
                <div className="flex items-start gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border text-brand"><MapPin className="h-4 w-4" /></span>
                  <span>
                    <span className="block text-xs uppercase tracking-[0.16em] text-muted-foreground">Studio</span>
                    <span className="text-lg">{settings.address}</span>
                  </span>
                </div>
              )}
            </div>

            <div className="mt-10 aspect-[4/3] overflow-hidden rounded-sm border border-border bg-secondary" data-testid="contact-map">
              <iframe
                title="Studio location"
                className="h-full w-full grayscale"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-122.4030%2C37.7790%2C-122.3900%2C37.7860&layer=mapnik"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
