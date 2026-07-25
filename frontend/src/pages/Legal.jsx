import Seo from "@/components/site/Seo";
import { Eyebrow } from "@/components/site/ui";
import { useSite } from "@/context/SiteContext";

const CONTENT = {
  privacy: {
    title: "Privacy Policy",
    eyebrow: "Legal",
    sections: [
      { h: "1. Introduction", p: "Apexora Studio (\"we\", \"us\") respects your privacy. This policy explains what information we collect when you use our website and how we use it. By using this site you agree to the practices described here." },
      { h: "2. Information We Collect", p: "We collect information you provide directly — such as your name, email, company and message when you submit an enquiry or subscribe to our journal. We also collect limited technical data (browser type, pages visited) to improve the site." },
      { h: "3. How We Use Information", p: "We use your information to respond to enquiries, deliver requested content, improve our services and, where you have opted in, send occasional updates. We never sell your personal data to third parties." },
      { h: "4. Cookies & Analytics", p: "We may use cookies and privacy-respecting analytics to understand how visitors use our site. You can disable cookies in your browser settings at any time." },
      { h: "5. Data Retention", p: "We retain enquiry data for as long as necessary to serve you and to comply with legal obligations. You may request deletion of your data at any time." },
      { h: "6. Your Rights", p: "You have the right to access, correct or delete your personal data, and to withdraw consent for marketing communications. To exercise these rights, contact us using the details below." },
      { h: "7. Contact", p: "Questions about this policy can be directed to our team via the contact details in the footer of this site." },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    eyebrow: "Legal",
    sections: [
      { h: "1. Agreement", p: "These terms govern your use of the Apexora Studio website. By accessing the site you agree to be bound by them. If you do not agree, please do not use the site." },
      { h: "2. Use of the Site", p: "You agree to use this website lawfully and not to attempt to disrupt its operation, misuse forms, or access areas you are not authorised to access." },
      { h: "3. Intellectual Property", p: "All content, design, code and imagery on this site are the property of Apexora Studio or its licensors and may not be reproduced without written permission." },
      { h: "4. Client Work", p: "Project engagements are governed by a separate written agreement. Nothing on this website constitutes a binding offer of services or pricing." },
      { h: "5. Limitation of Liability", p: "The site is provided \"as is\". To the fullest extent permitted by law, we are not liable for any indirect or consequential loss arising from its use." },
      { h: "6. Third-Party Links", p: "Our site may link to external sites. We are not responsible for the content or practices of those sites." },
      { h: "7. Changes", p: "We may update these terms from time to time. Continued use of the site after changes constitutes acceptance of the revised terms." },
    ],
  },
};

export default function Legal({ type = "privacy" }) {
  const data = CONTENT[type];
  const { settings } = useSite();
  const path = type === "privacy" ? "/privacy" : "/terms";

  return (
    <div data-testid={`${type}-page`}>
      <Seo title={`${data.title} — Apexora Studio`} description={`${data.title} for ${settings?.brand_name || "Apexora Studio"}.`} path={path} />
      <section className="px-5 pt-36 sm:px-8 md:pt-44">
        <div className="mx-auto max-w-3xl">
          <Eyebrow>{data.eyebrow}</Eyebrow>
          <h1 className="mt-8 font-display text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl">{data.title}</h1>
          <p className="mt-6 text-sm text-muted-foreground">Last updated {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" })}</p>
        </div>
      </section>
      <section className="px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-3xl space-y-10">
          {data.sections.map((s, i) => (
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
