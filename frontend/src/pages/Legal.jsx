import { useGet } from "@/hooks/useApi";
import Seo from "@/components/site/Seo";
import { Eyebrow } from "@/components/site/ui";
import { useSite } from "@/context/SiteContext";

const FALLBACK = {
  privacy: { eyebrow: "Legal", title: "Privacy Policy" },
  terms: { eyebrow: "Legal", title: "Terms & Conditions" },
};

export default function Legal({ type = "privacy" }) {
  const { settings } = useSite();
  const { data: page } = useGet(`/pages/${type}`, [type]);
  const { data: seo } = useGet(`/seo-by-path?path=/${type}`, [type]);
  const hero = page?.hero || FALLBACK[type];
  const sections = page?.sections || [];
  const path = `/${type}`;

  return (
    <div data-testid={`${type}-page`}>
      <Seo
        title={seo?.meta_title || `${hero.title} — ${settings?.brand_name || "Apexora Studio"}`}
        description={seo?.meta_description || `${hero.title} for ${settings?.brand_name || "Apexora Studio"}.`}
        image={seo?.og_image}
        path={path}
      />
      <section className="px-5 pt-36 sm:px-8 md:pt-44">
        <div className="mx-auto max-w-3xl">
          <Eyebrow>{hero.eyebrow || "Legal"}</Eyebrow>
          <h1 className="mt-8 font-display text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl">{hero.title}</h1>
          <p className="mt-6 text-sm text-muted-foreground">Last updated {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" })}</p>
        </div>
      </section>
      <section className="px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-3xl space-y-10">
          {sections.map((s, i) => (
            <div key={i}>
              <h2 className="font-display text-2xl tracking-tight">{s.h}</h2>
              <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{s.p}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
