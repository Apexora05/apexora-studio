import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useGet } from "@/hooks/useApi";
import { resolveMedia } from "@/lib/api";
import Seo from "@/components/site/Seo";
import { Reveal } from "@/components/site/Reveal";
import { Eyebrow } from "@/components/site/ui";

export default function Blog() {
  const { data: posts } = useGet("/posts");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => {
    const set = new Set(["All"]);
    (posts || []).forEach((p) => p.category && set.add(p.category));
    return Array.from(set);
  }, [posts]);

  const filtered = (posts || []).filter((p) => {
    const matchesCat = category === "All" || p.category === category;
    const matchesQuery =
      !query ||
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      (p.excerpt || "").toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const featured = filtered.find((p) => p.featured) || filtered[0];
  const rest = filtered.filter((p) => p.id !== featured?.id);

  return (
    <div data-testid="blog-page">
      <Seo title="Journal — Apexora Studio" description="Essays on premium web design, performance and conversion." path="/blog" />

      <section className="px-5 pt-36 sm:px-8 md:pt-44">
        <div className="mx-auto max-w-7xl">
          <Eyebrow>The Journal</Eyebrow>
          <h1 className="mt-8 max-w-4xl font-display text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
            Ideas on design that performs.
          </h1>

          <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  data-testid={`blog-category-${c.toLowerCase()}`}
                  className={`rounded-full border px-4 py-1.5 text-sm transition-colors duration-300 ${
                    category === c ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 border-b border-border pb-2 md:w-64">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                data-testid="blog-search-input"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          {/* Featured */}
          {featured && (
            <Reveal>
              <Link to={`/blog/${featured.slug}`} className="group grid gap-8 md:grid-cols-2 md:items-center" data-testid={`blog-featured-${featured.slug}`}>
                <div className="aspect-[16/10] overflow-hidden rounded-sm bg-secondary">
                  <img src={resolveMedia(featured.cover)} alt={featured.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div>
                  <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    <span className="text-brand">{featured.category}</span>
                    <span>·</span>
                    <span>{featured.read_time} min read</span>
                  </div>
                  <h2 className="mt-4 font-display text-3xl tracking-tight md:text-4xl transition-colors group-hover:text-brand">{featured.title}</h2>
                  <p className="mt-4 text-lg text-muted-foreground">{featured.excerpt}</p>
                  <p className="mt-6 text-sm text-muted-foreground">By {featured.author}</p>
                </div>
              </Link>
            </Reveal>
          )}

          {/* Grid */}
          <div className="mt-20 grid gap-x-8 gap-y-14 md:grid-cols-3">
            {rest.map((post, i) => (
              <Reveal key={post.id} delay={(i % 3) * 0.06}>
                <Link to={`/blog/${post.slug}`} className="group block" data-testid={`blog-card-${post.slug}`}>
                  <div className="aspect-[16/11] overflow-hidden rounded-sm bg-secondary">
                    <img src={resolveMedia(post.cover)} alt={post.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="mt-5 flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    <span className="text-brand">{post.category}</span>
                    <span>·</span>
                    <span>{post.read_time} min</span>
                  </div>
                  <h3 className="mt-3 font-display text-xl tracking-tight transition-colors group-hover:text-brand">{post.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                </Link>
              </Reveal>
            ))}
          </div>
          {filtered.length === 0 && <p className="text-muted-foreground">No articles found.</p>}
        </div>
      </section>
    </div>
  );
}
