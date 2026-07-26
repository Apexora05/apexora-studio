import { useRef } from "react";
import { Link } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useGet } from "@/hooks/useApi";
import { resolveMedia } from "@/lib/api";
import Seo from "@/components/site/Seo";
import { Reveal, LineReveal, Stagger, StaggerItem } from "@/components/site/Reveal";
import { BtnLink, Eyebrow, SectionHeading } from "@/components/site/ui";
import ProjectCard from "@/components/site/ProjectCard";
import { content } from "@/data/websiteContent";
function HeroImage({ src }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  return (
    <div ref={ref} className="relative overflow-hidden rounded-sm">
      <motion.img
        src={resolveMedia(src)}
        alt="Featured studio work"
        style={{ y, scale }}
        className="h-[62vh] w-full object-cover md:h-[78vh]"
      />
      <div className="absolute inset-0 ring-1 ring-inset ring-black/5" />
    </div>
  );
}

export default function Home() {
  const { data: home } = useGet("/pages/home");
  const { data: projects } = useGet("/portfolio?featured=1");
  const { data: services } = useGet("/services");
  const { data: testimonials } = useGet("/testimonials?featured=1");
  const { data: posts } = useGet("/posts");
  const { data: faqs } = useGet("/faqs");

  const hero = content.home.hero;

  return (
    <div data-testid="home-page">
      <Seo
        title={home?.seo?.meta_title || "Apexora Studio — Premium Web Design That Converts"}
        description={home?.seo?.meta_description}
        image={resolveMedia(hero.image)}
        path="/"
        schema={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Apexora Studio",
          url: window.location.origin,
          description: home?.seo?.meta_description,
        }}
      />

      {/* HERO */}
      <section className="relative px-5 pt-32 sm:px-8 md:pt-40">
        <div className="mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <Eyebrow>{hero.eyebrow || "Web Design Studio"}</Eyebrow>
          </motion.div>
          <h1 className="mt-8 max-w-5xl font-display text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            <LineReveal
              delay={0.15}
              lines={(hero.headline || "Websites that change how people perceive your business.")
                .replace("how people", "how|people")
                .split("|")}
            />
          </h1>
          <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="max-w-xl text-lg text-muted-foreground md:text-xl"
            >
              {hero.subheadline}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.7 }}
              className="flex flex-wrap items-center gap-3"
            >
              <BtnLink to={hero.primary_cta?.path || "/portfolio"} variant="primary" dataTestid="hero-primary-cta">
                {hero.primary_cta?.label || "View Portfolio"}
              </BtnLink>
              <BtnLink to={hero.secondary_cta?.path || "/contact"} variant="outline" dataTestid="hero-secondary-cta">
                {hero.secondary_cta?.label || "Request Free Website Audit"}
              </BtnLink>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="mt-16"
          >
            <HeroImage src={hero.image} />
          </motion.div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="mt-24 border-y border-border py-6" data-testid="marquee">
        <Marquee gradient={false} speed={40} autoFill>
          {(home?.marquee || ["Brand Systems", "Editorial Web", "E-commerce", "Product UX", "Motion", "SEO"]).map((t, i) => (
            <span key={i} className="mx-8 font-serif-accent text-3xl italic text-muted-foreground md:text-4xl">
              {t} <span className="not-italic text-brand">✦</span>
            </span>
          ))}
        </Marquee>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="px-5 py-28 sm:px-8 md:py-36" data-testid="featured-projects">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Featured Projects" title="Selected work for ambitious brands." />
            <Link to="/portfolio" className="group inline-flex items-center gap-2 text-sm font-medium text-foreground" data-testid="view-all-work">
              View all work
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
          <div className="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2">
            {(projects || []).map((p, i) => (
              <div key={p.id} className={i % 2 === 1 ? "md:mt-24" : ""}>
                <ProjectCard project={p} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY APEXORA — manifesto chapters */}
      <section className="border-t border-border bg-secondary/40 px-5 py-28 sm:px-8 md:py-36" data-testid="why-apexora">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow={home?.why?.eyebrow || "Why Apexora"} title={home?.why?.title || "Design that earns trust."} />
          <div className="mt-16 grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-2">
            {(home?.why?.items || []).map((item, i) => (
              <Reveal key={i} delay={(i % 2) * 0.08} className="bg-background p-8 md:p-12">
                <span className="font-serif-accent text-4xl italic text-brand">{item.no}</span>
                <h3 className="mt-6 font-display text-2xl tracking-tight">{item.title}</h3>
                <p className="mt-3 text-muted-foreground">{item.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="px-5 py-28 sm:px-8 md:py-36" data-testid="home-services">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Services" title="Everything your brand needs online." />
          <div className="mt-14 border-t border-border">
            {(services || []).map((s, i) => (
              <Link
                key={s.id}
                to="/services"
                data-testid={`service-row-${s.slug}`}
                className="group flex items-center justify-between border-b border-border py-6 transition-colors hover:bg-secondary/40"
              >
                <div className="flex items-baseline gap-6">
                  <span className="w-8 text-sm text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-2xl tracking-tight transition-transform duration-300 group-hover:translate-x-2 md:text-3xl">
                    {s.title}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="hidden max-w-xs text-right text-sm text-muted-foreground md:block">{s.summary}</span>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:text-brand group-hover:rotate-45" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* OUR PROCESS */}
      <section className="border-y border-border bg-foreground px-5 py-28 text-background sm:px-8 md:py-36" data-testid="home-process">
        <div className="mx-auto max-w-7xl">
          <Eyebrow className="text-background/60">{home?.process?.eyebrow || "Our Process"}</Eyebrow>
          <h2 className="mt-5 max-w-3xl font-display text-4xl tracking-tight sm:text-5xl md:text-6xl">
            {home?.process?.title || "A studio process, refined over 200+ launches."}
          </h2>
          <Stagger className="mt-16 grid gap-10 md:grid-cols-4">
            {(home?.process?.steps || []).map((step) => (
              <StaggerItem key={step.no}>
                <div className="text-6xl font-display text-background/20">{step.no}</div>
                <h3 className="mt-4 font-display text-2xl">{step.title}</h3>
                <p className="mt-3 text-background/60">{step.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="px-5 py-28 sm:px-8 md:py-36" data-testid="home-industries">
        <div className="mx-auto max-w-7xl grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <SectionHeading eyebrow={home?.industries?.eyebrow || "Industries We Serve"} title={home?.industries?.title || "Trusted across categories."} />
          </div>
          <div className="md:col-span-8 md:pt-4">
            <div className="flex flex-wrap gap-3">
              {(home?.industries?.items || []).map((ind, i) => (
                <Reveal as="span" key={ind} delay={i * 0.04}>
                  <span className="inline-block rounded-full border border-border px-6 py-3 text-lg tracking-tight transition-colors duration-300 hover:border-brand hover:text-brand">
                    {ind}
                  </span>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-t border-border bg-secondary/40 px-5 py-28 sm:px-8 md:py-36" data-testid="home-testimonials">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Testimonials" title="Words from the brands we build." />
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {(testimonials || []).map((t, i) => (
              <Reveal key={t.id} delay={i * 0.08} className="flex flex-col rounded-sm border border-border bg-background p-8">
                <div className="flex gap-1 text-brand">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-6 flex-1 text-lg leading-relaxed tracking-tight">“{t.quote}”</p>
                <div className="mt-8 flex items-center gap-3">
                  {t.avatar && <img src={resolveMedia(t.avatar)} alt={t.name} className="h-11 w-11 rounded-full object-cover" loading="lazy" />}
                  <div>
                    <p className="font-medium tracking-tight">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.role}, {t.company}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST ARTICLES */}
      <section className="px-5 py-28 sm:px-8 md:py-36" data-testid="home-articles">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Latest Articles" title="From the journal." />
            <Link to="/blog" className="group inline-flex items-center gap-2 text-sm font-medium" data-testid="view-all-articles">
              Read the journal
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {(posts || []).slice(0, 3).map((post, i) => (
              <Reveal key={post.id} delay={i * 0.08}>
                <Link to={`/blog/${post.slug}`} className="group block" data-testid={`article-card-${post.slug}`}>
                  <div className="aspect-[16/10] overflow-hidden rounded-sm bg-secondary">
                    <img src={resolveMedia(post.cover)} alt={post.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="mt-5 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    <span className="text-brand">{post.category}</span>
                    <span>·</span>
                    <span>{post.read_time} min read</span>
                  </div>
                  <h3 className="mt-3 font-display text-xl tracking-tight transition-colors group-hover:text-brand">{post.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border px-5 py-28 sm:px-8 md:py-36" data-testid="home-faq">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <SectionHeading eyebrow="FAQ" title="Frequently asked questions." />
          </div>
          <div className="md:col-span-8">
            <Accordion type="single" collapsible className="w-full">
              {(faqs || []).map((f) => (
                <AccordionItem key={f.id} value={f.id} data-testid={`faq-item-${f.id}`}>
                  <AccordionTrigger className="text-left font-display text-lg tracking-tight hover:no-underline md:text-xl">
                    {f.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground">{f.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 pb-28 sm:px-8 md:pb-36" data-testid="home-cta">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-sm border border-border bg-brand px-8 py-20 text-center text-white md:py-28">
          <Reveal>
            <h2 className="mx-auto max-w-3xl font-display text-4xl leading-[1.02] tracking-tight sm:text-5xl md:text-6xl">
              {home?.cta?.title || "Let's build a website worthy of your ambition."}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-white/80">{home?.cta?.text}</p>
            <div className="mt-10 flex justify-center">
              <Link
                to={home?.cta?.button?.path || "/contact"}
                data-testid="final-cta-button"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-foreground transition-transform duration-300 hover:-translate-y-0.5"
              >
                {home?.cta?.button?.label || "Request Free Website Audit"}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
