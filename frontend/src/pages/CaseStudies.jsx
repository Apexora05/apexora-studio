import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useGet } from "@/hooks/useApi";
import { resolveMedia } from "@/lib/api";
import Seo from "@/components/site/Seo";
import { Reveal } from "@/components/site/Reveal";
import { Eyebrow } from "@/components/site/ui";

export default function CaseStudies() {
  const { data: items } = useGet("/case-studies");
  const { data: page } = useGet("/pages/case-studies");
  const { data: seo } = useGet("/seo-by-path?path=/case-studies");
  const hero = page?.hero || {};

  return (
    <div data-testid="case-studies-page">
      <Seo title={seo?.meta_title || "Case Studies — Apexora Studio"} description={seo?.meta_description || "In-depth stories of measurable results from Apexora Studio."} image={seo?.og_image} path="/case-studies" />

      <section className="px-5 pt-36 sm:px-8 md:pt-44">
        <div className="mx-auto max-w-7xl">
          <Eyebrow>{hero.eyebrow || "Case Studies"}</Eyebrow>
          <h1 className="mt-8 max-w-4xl font-display text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
            {hero.title || "Proof, not promises."}
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
            {hero.subtext || "A closer look at how strategy, design and engineering combine to move real business metrics."}
          </p>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-7xl space-y-8">
          {(items || []).map((c, i) => (
            <Reveal key={c.id} delay={(i % 2) * 0.06}>
              <Link
                to={`/case-studies/${c.slug}`}
                data-testid={`case-study-card-${c.slug}`}
                className="group grid overflow-hidden rounded-sm border border-border bg-background transition-colors duration-300 hover:border-foreground md:grid-cols-2"
              >
                <div className="aspect-[16/10] overflow-hidden md:aspect-auto">
                  <img src={resolveMedia(c.cover)} alt={c.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="flex flex-col justify-center p-8 md:p-14">
                  <span className="text-xs uppercase tracking-[0.2em] text-brand">{c.industry}</span>
                  <h2 className="mt-4 font-display text-3xl tracking-tight md:text-4xl">{c.title}</h2>
                  <p className="mt-4 text-muted-foreground">{c.summary}</p>
                  <div className="mt-8 flex flex-wrap gap-8">
                    {(c.results || []).slice(0, 3).map((r, j) => (
                      <div key={j}>
                        <div className="font-display text-2xl tracking-tight text-foreground">{r.value}</div>
                        <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{r.label}</div>
                      </div>
                    ))}
                  </div>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                    Read the case study
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
