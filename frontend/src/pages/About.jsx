import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useGet } from "@/hooks/useApi";
import { resolveMedia } from "@/lib/api";
import Seo from "@/components/site/Seo";
import { Reveal, Stagger, StaggerItem } from "@/components/site/Reveal";
import { Eyebrow, SectionHeading, BtnLink } from "@/components/site/ui";

export default function About() {
  const { data: about } = useGet("/pages/about");
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "12%"]);

  const hero = about?.hero || {};

  return (
    <div data-testid="about-page">
      <Seo title={about?.seo?.meta_title || "About — Apexora Studio"} description={about?.seo?.meta_description} path="/about" />

      <section className="px-5 pt-36 sm:px-8 md:pt-44">
        <div className="mx-auto max-w-7xl">
          <Eyebrow>{hero.eyebrow || "The Studio"}</Eyebrow>
          <h1 className="mt-8 max-w-4xl font-display text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
            {hero.title || "We design the web's most trusted brands."}
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl">{hero.text}</p>
        </div>
        <div ref={ref} className="mx-auto mt-16 max-w-7xl overflow-hidden rounded-sm">
          <motion.img src={resolveMedia(hero.image)} alt="Apexora studio" style={{ y }} className="h-[50vh] w-full scale-110 object-cover md:h-[70vh]" />
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="px-5 py-28 sm:px-8 md:py-36">
        <div className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-2">
          {[about?.mission, about?.vision].filter(Boolean).map((b, i) => (
            <Reveal key={i} delay={i * 0.1} className="bg-background p-10 md:p-14">
              <Eyebrow>{b.title}</Eyebrow>
              <p className="mt-6 font-display text-2xl leading-snug tracking-tight md:text-3xl">{b.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Philosophy + Why design */}
      <section className="border-y border-border bg-secondary/40 px-5 py-28 sm:px-8 md:py-36">
        <div className="mx-auto grid max-w-7xl gap-16 md:grid-cols-2">
          {[about?.philosophy, about?.why_design].filter(Boolean).map((b, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <h2 className="font-display text-3xl tracking-tight md:text-4xl">{b.title}</h2>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{b.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="px-5 py-28 sm:px-8 md:py-36">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Core Values" title="What we stand for." />
          <Stagger className="mt-16 grid gap-10 md:grid-cols-4">
            {(about?.values || []).map((v) => (
              <StaggerItem key={v.no}>
                <span className="font-serif-accent text-4xl italic text-brand">{v.no}</span>
                <h3 className="mt-4 font-display text-2xl tracking-tight">{v.title}</h3>
                <p className="mt-2 text-muted-foreground">{v.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Timeline */}
      <section className="border-t border-border px-5 py-28 sm:px-8 md:py-36">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Timeline" title="A short history." />
          <div className="mt-16 border-t border-border">
            {(about?.timeline || []).map((t, i) => (
              <Reveal key={i} className="grid gap-4 border-b border-border py-8 md:grid-cols-12 md:items-baseline">
                <span className="font-display text-3xl tracking-tight text-brand md:col-span-2">{t.year}</span>
                <h3 className="font-display text-xl tracking-tight md:col-span-4">{t.title}</h3>
                <p className="text-muted-foreground md:col-span-6">{t.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="border-t border-border bg-secondary/40 px-5 py-28 sm:px-8 md:py-36">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Meet the Studio" title="Senior, by design." />
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {(about?.team || []).map((m, i) => (
              <Reveal key={i} delay={i * 0.06} className="group">
                <div className="aspect-[3/4] overflow-hidden rounded-sm bg-secondary">
                  <img src={resolveMedia(m.image)} alt={m.name} loading="lazy" className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" />
                </div>
                <h3 className="mt-4 font-display text-xl tracking-tight">{m.name}</h3>
                <p className="text-sm text-muted-foreground">{m.role}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-16">
            <BtnLink to="/contact" variant="primary" dataTestid="about-cta">Work with us</BtnLink>
          </div>
        </div>
      </section>
    </div>
  );
}
