import * as Icons from "lucide-react";
import { useGet } from "@/hooks/useApi";
import Seo from "@/components/site/Seo";
import { Reveal } from "@/components/site/Reveal";
import { Eyebrow, BtnLink, SectionHeading } from "@/components/site/ui";

function Icon({ name, className }) {
  const key = (name || "sparkles")
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
  const Cmp = Icons[key] || Icons.Sparkles;
  return <Cmp className={className} />;
}

export default function Services() {
  const { data: services } = useGet("/services");
  const { data: page } = useGet("/pages/services");
  const { data: seo } = useGet("/seo-by-path?path=/services");
  const hero = page?.hero || {};
  const cta = page?.cta || {};

  return (
    <div data-testid="services-page">
      <Seo title={seo?.meta_title || "Services — Apexora Studio"} description={seo?.meta_description || "Website design, redesign, e-commerce, UI/UX and SEO development from a premium studio."} image={seo?.og_image} path="/services" />

      <section className="px-5 pt-36 sm:px-8 md:pt-44">
        <div className="mx-auto max-w-7xl">
          <Eyebrow>{hero.eyebrow || "Services"}</Eyebrow>
          <h1 className="mt-8 max-w-4xl font-display text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
            {hero.title || "Design and build, end to end."}
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
            {hero.subtext || "A focused set of services covering every stage of your website — from first concept to continuous optimization."}
          </p>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 md:py-32">
        <div className="mx-auto max-w-7xl grid gap-8 md:grid-cols-2">
          {(services || []).map((s, i) => (
            <Reveal key={s.id} delay={(i % 2) * 0.08} className="group rounded-sm border border-border bg-background p-8 transition-colors duration-300 hover:border-foreground md:p-10" >
              <div className="flex items-start justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-full border border-border text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                  <Icon name={s.icon} className="h-5 w-5" />
                </span>
                <span className="font-serif-accent text-3xl italic text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h2 className="mt-8 font-display text-2xl tracking-tight md:text-3xl" data-testid={`service-title-${s.slug}`}>{s.title}</h2>
              <p className="mt-3 text-muted-foreground">{s.description}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {(s.features || []).map((f) => (
                  <li key={f} className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">{f}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-5 pb-28 sm:px-8 md:pb-36">
        <div className="mx-auto max-w-7xl rounded-sm border border-border bg-secondary/40 p-10 text-center md:p-16">
          <SectionHeading align="center" eyebrow={cta.eyebrow || "Not sure where to start?"} title={cta.title || "Get a free website audit."} className="mx-auto" />
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">{cta.text || "We'll review your current site and show you exactly where you're losing trust and revenue — no obligation."}</p>
          <div className="mt-8 flex justify-center">
            <BtnLink to={cta.button?.path || "/contact"} variant="accent" dataTestid="services-cta">{cta.button?.label || "Request Free Website Audit"}</BtnLink>
          </div>
        </div>
      </section>
    </div>
  );
}
