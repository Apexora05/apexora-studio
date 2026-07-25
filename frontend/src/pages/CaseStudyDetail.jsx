import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
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

export default function CaseStudyDetail() {
  const { slug } = useParams();
  const { data: cs, loading } = useGet(`/case-studies/${slug}`, [slug]);

  if (loading) return <div className="grid min-h-[60vh] place-items-center pt-24 text-muted-foreground">Loading…</div>;
  if (!cs) return <div className="grid min-h-[60vh] place-items-center pt-24 text-muted-foreground">Case study not found.</div>;

  return (
    <div data-testid="case-study-detail-page">
      <Seo title={cs.seo?.meta_title || `${cs.title} — Apexora Studio`} description={cs.seo?.meta_description || cs.summary} image={resolveMedia(cs.cover)} path={`/case-studies/${slug}`} />

      <section className="px-5 pt-32 sm:px-8 md:pt-40">
        <div className="mx-auto max-w-5xl">
          <Link to="/case-studies" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground" data-testid="back-to-case-studies">
            <ArrowLeft className="h-4 w-4" /> All case studies
          </Link>
          <Eyebrow className="mt-8">{cs.industry} · {cs.client}</Eyebrow>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1] tracking-tight sm:text-5xl md:text-6xl">{cs.title}</h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">{cs.summary}</p>
        </div>
        <div className="mx-auto mt-12 max-w-6xl overflow-hidden rounded-sm">
          <img src={resolveMedia(cs.cover)} alt={cs.title} className="h-[45vh] w-full object-cover md:h-[65vh]" />
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 border-y border-border py-12 sm:grid-cols-2 lg:grid-cols-4">
            {(cs.results || []).map((r, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div className="font-display text-4xl tracking-tight text-brand md:text-5xl">{r.value}</div>
                <p className="mt-2 text-sm uppercase tracking-[0.16em] text-muted-foreground">{r.label}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-12">
            <Block title="The Challenge">{cs.challenge}</Block>
            <Block title="The Solution">{cs.solution}</Block>
            <Block title="Process">{cs.process}</Block>
          </div>

          {/* Before / After */}
          {(cs.before_image || cs.after_image) && (
            <div className="mt-12 grid gap-6 border-t border-border pt-12 md:grid-cols-2">
              {cs.before_image && (
                <Reveal>
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Before</span>
                  <div className="mt-3 overflow-hidden rounded-sm">
                    <img src={resolveMedia(cs.before_image)} alt="Before" loading="lazy" className="w-full object-cover grayscale" />
                  </div>
                </Reveal>
              )}
              {cs.after_image && (
                <Reveal delay={0.08}>
                  <span className="text-xs uppercase tracking-[0.2em] text-brand">After</span>
                  <div className="mt-3 overflow-hidden rounded-sm ring-1 ring-brand/30">
                    <img src={resolveMedia(cs.after_image)} alt="After" loading="lazy" className="w-full object-cover" />
                  </div>
                </Reveal>
              )}
            </div>
          )}

          {(cs.gallery || []).length > 0 && (
            <div className="mt-12 grid gap-6">
              {cs.gallery.map((g, i) => (
                <Reveal key={i} className="overflow-hidden rounded-sm">
                  <img src={resolveMedia(g)} alt={`${cs.title} ${i + 1}`} loading="lazy" className="w-full object-cover" />
                </Reveal>
              ))}
            </div>
          )}

          <div className="mt-16 flex justify-center">
            <BtnLink to="/contact" variant="primary" dataTestid="case-study-cta">Start your project</BtnLink>
          </div>
        </div>
      </section>
    </div>
  );
}
