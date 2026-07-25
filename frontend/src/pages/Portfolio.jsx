import { useMemo, useState } from "react";
import { useGet } from "@/hooks/useApi";
import Seo from "@/components/site/Seo";
import { Eyebrow } from "@/components/site/ui";
import ProjectCard from "@/components/site/ProjectCard";

export default function Portfolio() {
  const { data: projects } = useGet("/portfolio");
  const { data: page } = useGet("/pages/portfolio");
  const { data: seo } = useGet("/seo-by-path?path=/portfolio");
  const [filter, setFilter] = useState("All");
  const hero = page?.hero || {};

  const categories = useMemo(() => {
    const set = new Set(["All"]);
    (projects || []).forEach((p) => (p.categories || []).forEach((c) => set.add(c)));
    return Array.from(set);
  }, [projects]);

  const filtered = (projects || []).filter((p) => filter === "All" || (p.categories || []).includes(filter));

  return (
    <div data-testid="portfolio-page">
      <Seo title={seo?.meta_title || "Work — Apexora Studio"} description={seo?.meta_description || "Selected premium website projects by Apexora Studio."} image={seo?.og_image} path="/portfolio" />

      <section className="px-5 pt-36 sm:px-8 md:pt-44">
        <div className="mx-auto max-w-7xl">
          <Eyebrow>{hero.eyebrow || "Selected Work"}</Eyebrow>
          <h1 className="mt-8 max-w-4xl font-display text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
            {hero.title || "Work that earns attention."}
          </h1>
          {hero.subtext ? <p className="mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl">{hero.subtext}</p> : null}
          <div className="mt-10 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                data-testid={`portfolio-filter-${c.toLowerCase().replace(/\s+/g, "-")}`}
                className={`rounded-full border px-5 py-2 text-sm tracking-tight transition-colors duration-300 ${
                  filter === c ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-7xl grid gap-x-8 gap-y-16 md:grid-cols-2">
          {filtered.map((p, i) => (
            <div key={p.id} className={i % 2 === 1 ? "md:mt-24" : ""}>
              <ProjectCard project={p} index={i} />
            </div>
          ))}
        </div>
        {filtered.length === 0 && <p className="mx-auto max-w-7xl text-muted-foreground">No projects in this category yet.</p>}
      </section>
    </div>
  );
}
