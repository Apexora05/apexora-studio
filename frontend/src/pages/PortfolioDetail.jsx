import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useGet } from "@/hooks/useApi";
import { resolveMedia } from "@/lib/api";
import Seo from "@/components/site/Seo";
import { Reveal } from "@/components/site/Reveal";
import { Eyebrow, BtnLink } from "@/components/site/ui";

function Block({ title, children }) {
  return (
    <Reveal className="border-t border-border py-10 md:grid md:grid-cols-12 md:gap-8">
      <h3 className="mb-4 font-display text-xl tracking-tight md:col-span-3 md:mb-0">{title}</h3>
      <div className="text-lg leading-relaxed text-muted-foreground md:col-span-9">{children}</div>
    </Reveal>
  );
}

export default function PortfolioDetail() {
  const { slug } = useParams();
  const { data: project, loading } = useGet(`/portfolio/${slug}`, [slug]);

  if (loading) return <div className="grid min-h-[60vh] place-items-center pt-24 text-muted-foreground">Loading…</div>;
  if (!project) return <div className="grid min-h-[60vh] place-items-center pt-24 text-muted-foreground">Project not found.</div>;

  return (
    <div data-testid="portfolio-detail-page">
      <Seo title={`${project.title} — Apexora Studio`} description={project.overview} image={resolveMedia(project.cover)} path={`/portfolio/${slug}`} />

      <section className="px-5 pt-32 sm:px-8 md:pt-40">
        <div className="mx-auto max-w-7xl">
          <Link to="/portfolio" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground" data-testid="back-to-work">
            <ArrowLeft className="h-4 w-4" /> All work
          </Link>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow>{project.industry}</Eyebrow>
              <h1 className="mt-5 font-display text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">{project.title}</h1>
            </div>
            {project.live_url && (
              <BtnLink to={project.live_url} external variant="accent" dataTestid="live-demo-button">
                Live Demo
              </BtnLink>
            )}
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-7xl overflow-hidden rounded-sm">
          <img src={resolveMedia(project.cover)} alt={project.title} className="h-[50vh] w-full object-cover md:h-[75vh]" />
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          {/* Results */}
          {(project.results || []).length > 0 && (
            <div className="grid gap-8 border-y border-border py-12 sm:grid-cols-3">
              {project.results.map((r, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="font-display text-5xl tracking-tight text-brand md:text-6xl">{r.value}</div>
                  <p className="mt-2 text-sm uppercase tracking-[0.18em] text-muted-foreground">{r.label}</p>
                </Reveal>
              ))}
            </div>
          )}

          <div className="mt-12">
            <Block title="Overview">{project.overview}</Block>
            <Block title="The Problem">{project.problem}</Block>
            <Block title="The Solution">{project.solution}</Block>
            <Block title="Process">{project.process}</Block>
            <Block title="Technologies">
              <div className="flex flex-wrap gap-2">
                {(project.technologies || []).map((t) => (
                  <span key={t} className="rounded-full border border-border px-4 py-1.5 text-sm text-foreground">{t}</span>
                ))}
              </div>
            </Block>
          </div>

          {/* Gallery */}
          {(project.gallery || []).length > 0 && (
            <div className="mt-16 grid gap-6 md:grid-cols-2">
              {project.gallery.map((g, i) => (
                <Reveal key={i} delay={(i % 2) * 0.08} className={`overflow-hidden rounded-sm ${i === 0 ? "md:col-span-2" : ""}`}>
                  <img src={resolveMedia(g)} alt={`${project.title} ${i + 1}`} loading="lazy" className="w-full object-cover" />
                </Reveal>
              ))}
            </div>
          )}

          {project.live_url && (
            <div className="mt-16 flex justify-center">
              <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline" data-testid="live-demo-inline">
                Visit the live site <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
