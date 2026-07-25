import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useGet } from "@/hooks/useApi";
import { resolveMedia } from "@/lib/api";
import Seo from "@/components/site/Seo";
import { Reveal } from "@/components/site/Reveal";
import { Eyebrow } from "@/components/site/ui";

export default function BlogDetail() {
  const { slug } = useParams();
  const { data: post, loading } = useGet(`/posts/${slug}`, [slug]);
  const { data: allPosts } = useGet("/posts");

  if (loading) return <div className="grid min-h-[60vh] place-items-center pt-24 text-muted-foreground">Loading…</div>;
  if (!post) return <div className="grid min-h-[60vh] place-items-center pt-24 text-muted-foreground">Article not found.</div>;

  const related = (allPosts || []).filter((p) => p.id !== post.id && p.category === post.category).slice(0, 3);
  const paragraphs = (post.content || "").split("\n").filter((p) => p.trim());

  return (
    <article data-testid="blog-detail-page">
      <Seo
        title={post.seo?.meta_title || `${post.title} — Apexora Journal`}
        description={post.seo?.meta_description || post.excerpt}
        image={resolveMedia(post.cover)}
        path={`/blog/${slug}`}
        schema={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          author: { "@type": "Person", name: post.author },
          image: resolveMedia(post.cover),
          datePublished: post.published_at,
        }}
      />

      <section className="px-5 pt-32 sm:px-8 md:pt-40">
        <div className="mx-auto max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground" data-testid="back-to-blog">
            <ArrowLeft className="h-4 w-4" /> The Journal
          </Link>
          <Eyebrow className="mt-8">{post.category}</Eyebrow>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.02] tracking-tight sm:text-5xl md:text-6xl">{post.title}</h1>
          <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
            <span>By {post.author}</span>
            <span>·</span>
            <span>{post.read_time} min read</span>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-5xl overflow-hidden rounded-sm">
          <img src={resolveMedia(post.cover)} alt={post.title} className="h-[40vh] w-full object-cover md:h-[60vh]" />
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 md:py-24">
        <div className="mx-auto max-w-3xl">
          {paragraphs.map((p, i) => (
            <p key={i} className="mb-6 text-lg leading-relaxed text-foreground/90">{p}</p>
          ))}
          <div className="mt-10 flex flex-wrap gap-2">
            {(post.tags || []).map((t) => (
              <span key={t} className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">#{t}</span>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-border px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-display text-2xl tracking-tight md:text-3xl">Related articles</h2>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {related.map((r, i) => (
                <Reveal key={r.id} delay={i * 0.06}>
                  <Link to={`/blog/${r.slug}`} className="group block" data-testid={`related-article-${r.slug}`}>
                    <div className="aspect-[16/11] overflow-hidden rounded-sm bg-secondary">
                      <img src={resolveMedia(r.cover)} alt={r.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <h3 className="mt-4 font-display text-lg tracking-tight transition-colors group-hover:text-brand">{r.title}</h3>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
