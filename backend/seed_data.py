"""Realistic seed content for Apexora Studio. Idempotent — only inserts when
a collection/document is missing so admin edits are never overwritten."""
import uuid
from datetime import datetime, timezone, timedelta

from database import db

IMG = {
    "hero": "https://images.unsplash.com/photo-1481026469463-66327c86e544?q=80&w=1600&auto=format&fit=crop",
    "hero2": "https://images.unsplash.com/photo-1479293581560-aee98bb24f7f?q=80&w=1600&auto=format&fit=crop",
    "studio1": "https://images.unsplash.com/photo-1627917932033-74123f070958?q=80&w=1600&auto=format&fit=crop",
    "studio2": "https://images.unsplash.com/photo-1742440710226-450e3b85c100?q=80&w=1600&auto=format&fit=crop",
    "p1": "https://images.unsplash.com/photo-1634084462412-b54873c0a56d?q=80&w=1600&auto=format&fit=crop",
    "p2": "https://images.unsplash.com/photo-1642132652860-471b4228023e?q=80&w=1600&auto=format&fit=crop",
    "p3": "https://images.pexels.com/photos/205316/pexels-photo-205316.png?auto=compress&cs=tinysrgb&w=1600",
    "p4": "https://images.unsplash.com/photo-1559028012-481c04fa702d?q=80&w=1600&auto=format&fit=crop",
    "p5": "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=1600&auto=format&fit=crop",
    "p6": "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=1600&auto=format&fit=crop",
    "blog1": "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=1600&auto=format&fit=crop",
    "blog2": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1600&auto=format&fit=crop",
    "blog3": "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1600&auto=format&fit=crop",
}


def _now():
    return datetime.now(timezone.utc).isoformat()


SETTINGS = {
    "id": "site",
    "brand_name": "Apexora Studio",
    "logo_text": "Apexora",
    "logo_url": "",
    "favicon_url": "",
    "tagline": "A luxury digital design studio.",
    "email": "hello@apexora.studio",
    "phone": "+1 (415) 555-0142",
    "address": "340 Bryant Street, San Francisco, CA 94107",
    "socials": {
        "twitter": "https://twitter.com/apexora",
        "instagram": "https://instagram.com/apexora.studio",
        "linkedin": "https://linkedin.com/company/apexora",
        "dribbble": "https://dribbble.com/apexora",
    },
    "footer_note": "Designing the web's most trusted brands from San Francisco.",
    "nav": [
        {"label": "Work", "path": "/portfolio"},
        {"label": "Services", "path": "/services"},
        {"label": "Studio", "path": "/about"},
        {"label": "Journal", "path": "/blog"},
        {"label": "Contact", "path": "/contact"},
    ],
}

HOME = {
    "id": "home",
    "hero": {
        "eyebrow": "Web Design Studio — Est. San Francisco",
        "headline": "Websites that change how people perceive your business.",
        "subheadline": "We design premium websites that build trust, elevate brands and convert visitors into customers.",
        "primary_cta": {"label": "View Portfolio", "path": "/portfolio"},
        "secondary_cta": {"label": "Request Free Website Audit", "path": "/contact"},
        "image": IMG["hero"],
    },
    "marquee": ["Brand Systems", "Editorial Web", "E-commerce", "Product UX", "Motion", "SEO", "Conversion", "Design"],
    "why": {
        "eyebrow": "Why Apexora",
        "title": "Design that earns trust and moves numbers.",
        "items": [
            {"no": "01", "title": "Perception is strategy", "text": "Your website is the first handshake. We craft a first impression that positions you as the obvious premium choice."},
            {"no": "02", "title": "Craft over templates", "text": "Every pixel, transition and line of type is deliberate. No page builders, no template smell — only bespoke design."},
            {"no": "03", "title": "Built to convert", "text": "Beautiful is not enough. We engineer clarity, speed and persuasion into every scroll so visitors become customers."},
            {"no": "04", "title": "Performance obsessed", "text": "Sub-second loads, perfect Core Web Vitals and accessibility baked in. Fast sites feel expensive — and rank higher."},
        ],
    },
    "process": {
        "eyebrow": "Our Process",
        "title": "A studio process, refined over 200+ launches.",
        "steps": [
            {"no": "01", "title": "Discover", "text": "We immerse in your business, audience and competitors to find the angle only you can own."},
            {"no": "02", "title": "Design", "text": "Art direction, editorial layouts and a living design system — reviewed together in high-fidelity."},
            {"no": "03", "title": "Build", "text": "Pixel-perfect, accessible, lightning-fast development with a CMS your team actually enjoys."},
            {"no": "04", "title": "Grow", "text": "Launch, measure, iterate. We optimise for conversion and search long after go-live."},
        ],
    },
    "industries": {
        "eyebrow": "Industries We Serve",
        "title": "Trusted across categories that demand credibility.",
        "items": ["SaaS & Technology", "Finance & Fintech", "Luxury & Fashion", "Health & Wellness", "Real Estate", "Professional Services", "Hospitality", "E-commerce"],
    },
    "cta": {
        "title": "Let's build a website worthy of your ambition.",
        "text": "Book a free website audit and we'll show you exactly where you're leaving trust — and revenue — on the table.",
        "button": {"label": "Request Free Website Audit", "path": "/contact"},
    },
    "seo": {
        "meta_title": "Apexora Studio — Premium Web Design That Converts",
        "meta_description": "Apexora Studio is a luxury web design studio crafting premium, high-converting websites for ambitious brands.",
    },
}

ABOUT = {
    "id": "about",
    "hero": {
        "eyebrow": "The Studio",
        "title": "We design the web's most trusted brands.",
        "text": "Apexora is a small, senior studio obsessed with the craft of digital design. We partner with a handful of ambitious companies each year to build websites that feel inevitable.",
        "image": IMG["studio1"],
    },
    "mission": {"title": "Mission", "text": "To make premium design accessible to ambitious businesses — turning websites from digital brochures into their most persuasive salesperson."},
    "vision": {"title": "Vision", "text": "A web where great design is the standard, not the exception. Where every brand earns trust in the first three seconds."},
    "philosophy": {
        "title": "Our Philosophy",
        "text": "We believe restraint is luxury. The best websites say more with less — generous space, confident typography, and motion that guides rather than distracts. We design for the moment a visitor decides whether to trust you.",
    },
    "why_design": {
        "title": "Why Great Design Matters",
        "text": "94% of first impressions are design-related. A premium site doesn't just look better — it commands higher prices, shortens sales cycles and compounds credibility across every channel you invest in.",
    },
    "values": [
        {"no": "01", "title": "Craft", "text": "We sweat the details others skip. Craft is our signature."},
        {"no": "02", "title": "Clarity", "text": "We remove until only the essential remains."},
        {"no": "03", "title": "Partnership", "text": "We work as an extension of your team, not a vendor."},
        {"no": "04", "title": "Momentum", "text": "We ship, measure and improve — relentlessly."},
    ],
    "timeline": [
        {"year": "2016", "title": "Founded in San Francisco", "text": "Apexora begins as a two-person studio with a single belief: design is a business advantage."},
        {"year": "2019", "title": "First eight-figure launch", "text": "A fintech redesign lifts trust-driven conversions by 61% and puts us on the map."},
        {"year": "2022", "title": "200th project shipped", "text": "We refine our studio process into the four phases we use today."},
        {"year": "2025", "title": "A global roster", "text": "Now partnering with brands across four continents, still senior-only, still small by design."},
    ],
    "team": [
        {"name": "Elena Vasquez", "role": "Founder & Creative Director", "image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop"},
        {"name": "Marcus Chen", "role": "Design Director", "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop"},
        {"name": "Priya Nair", "role": "Lead Engineer", "image": "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop"},
        {"name": "James Okafor", "role": "Strategy & Growth", "image": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop"},
    ],
    "seo": {
        "meta_title": "About — Apexora Studio",
        "meta_description": "Meet Apexora Studio: a senior, San Francisco-based web design studio building the web's most trusted brands.",
    },
}

SERVICES = [
    {"slug": "website-design", "title": "Website Design", "summary": "Bespoke, conversion-focused websites designed from a blank canvas.", "icon": "layout", "order": 1,
     "description": "We design premium marketing sites that position you as the category leader — from art direction and design systems to pixel-perfect, responsive pages.",
     "features": ["Custom art direction", "Design system", "Responsive & accessible", "Copy guidance"]},
    {"slug": "website-redesign", "title": "Website Redesign", "summary": "Transform an underperforming site into a credibility engine.", "icon": "refresh-cw", "order": 2,
     "description": "A full audit and redesign that preserves what works and rebuilds what doesn't — improving trust, clarity and conversion without losing your SEO equity.",
     "features": ["UX & conversion audit", "SEO-safe migration", "Modern design system", "Analytics setup"]},
    {"slug": "landing-pages", "title": "Landing Pages", "summary": "High-converting pages engineered for campaigns and launches.", "icon": "target", "order": 3,
     "description": "Focused, persuasive landing pages built to turn ad spend and launches into measurable pipeline.",
     "features": ["Message-market fit", "A/B ready structure", "Fast load", "Lead capture"]},
    {"slug": "ecommerce-websites", "title": "E-commerce Websites", "summary": "Editorial storefronts that make products feel desirable.", "icon": "shopping-bag", "order": 4,
     "description": "Premium e-commerce experiences with considered product storytelling, frictionless checkout and a merchandising CMS.",
     "features": ["Product storytelling", "Optimised checkout", "Merchandising CMS", "Speed tuned"]},
    {"slug": "ui-ux-design", "title": "UI/UX Design", "summary": "Product interfaces that feel effortless and look inevitable.", "icon": "figma", "order": 5,
     "description": "End-to-end product design — research, flows, wireframes and polished UI systems your engineers will love to build.",
     "features": ["User research", "Flows & wireframes", "Design system", "Prototypes"]},
    {"slug": "website-maintenance", "title": "Website Maintenance", "summary": "Ongoing care so your site stays fast, secure and fresh.", "icon": "shield", "order": 6,
     "description": "Retainer-based updates, monitoring, security and content support — a dedicated team on standby for your site.",
     "features": ["Content updates", "Security & backups", "Uptime monitoring", "Priority support"]},
    {"slug": "website-optimization", "title": "Website Optimization", "summary": "Squeeze more speed, trust and conversion from every page.", "icon": "gauge", "order": 7,
     "description": "CRO and performance engineering — from Core Web Vitals to messaging tests that lift conversion.",
     "features": ["Core Web Vitals", "CRO experiments", "Heatmap analysis", "Speed engineering"]},
    {"slug": "seo-ready-development", "title": "SEO Ready Development", "summary": "Clean, technical foundations that search engines reward.", "icon": "search", "order": 8,
     "description": "Semantic markup, structured data, sitemaps and fast rendering — everything search engines need to rank you.",
     "features": ["Schema markup", "XML sitemap", "Technical SEO", "Fast rendering"]},
]

PORTFOLIO = [
    {"slug": "meridian-capital", "title": "Meridian Capital", "client": "Meridian Capital", "industry": "Finance & Fintech", "featured": True, "order": 1,
     "categories": ["Website Design", "Finance"], "tags": ["fintech", "trust", "editorial"],
     "cover": IMG["p1"], "live_url": "https://example.com",
     "technologies": ["React", "FastAPI", "Framer Motion", "MongoDB"],
     "overview": "A private wealth firm needed a website that felt as considered as their advice. We built a restrained, editorial experience that signals trust before a single word is read.",
     "problem": "Meridian's legacy site looked like a discount broker — generic stock photography and cluttered layouts undermined their premium positioning and cost them high-net-worth leads.",
     "solution": "We designed a calm, typographic system with generous whitespace, bespoke data visualisations and subtle motion that communicates precision and confidence.",
     "process": "Discovery workshops, a new visual language, a component library, then a fast accessible build with a CMS for their marketing team.",
     "results": [{"value": "+61%", "label": "Qualified enquiries"}, {"value": "0.8s", "label": "Load time"}, {"value": "+2.4x", "label": "Avg. session"}],
     "gallery": [IMG["p1"], IMG["p2"], IMG["studio2"]]},
    {"slug": "atelier-nord", "title": "Atelier Nord", "client": "Atelier Nord", "industry": "Luxury & Fashion", "featured": True, "order": 2,
     "categories": ["E-commerce", "Fashion"], "tags": ["luxury", "commerce"],
     "cover": IMG["p2"], "live_url": "https://example.com",
     "technologies": ["React", "Node", "Stripe", "Sanity"],
     "overview": "A Scandinavian fashion house wanted an e-commerce experience as tactile as their garments.",
     "problem": "Their catalogue felt transactional and failed to convey craftsmanship, hurting average order value.",
     "solution": "An editorial storefront with immersive product stories, cinematic imagery and a frictionless checkout.",
     "process": "Art direction, merchandising strategy, a headless commerce build and motion design.",
     "results": [{"value": "+38%", "label": "AOV"}, {"value": "+52%", "label": "Conversion"}, {"value": "-40%", "label": "Bounce"}],
     "gallery": [IMG["p2"], IMG["p4"], IMG["p5"]]},
    {"slug": "northwind-saas", "title": "Northwind", "client": "Northwind Labs", "industry": "SaaS & Technology", "featured": True, "order": 3,
     "categories": ["Website Design", "SaaS"], "tags": ["saas", "product"],
     "cover": IMG["p3"], "live_url": "https://example.com",
     "technologies": ["Next.js", "FastAPI", "PostgreSQL"],
     "overview": "A developer platform needed a marketing site that spoke to engineers without alienating buyers.",
     "problem": "Two audiences, one homepage — the previous site converted neither well.",
     "solution": "A dual-track narrative with interactive product demos and a crisp, technical aesthetic.",
     "process": "Positioning, messaging, design system and a component-driven build.",
     "results": [{"value": "+120%", "label": "Trial signups"}, {"value": "+3.1x", "label": "Demo requests"}, {"value": "98", "label": "Lighthouse"}],
     "gallery": [IMG["p3"], IMG["p1"], IMG["p6"]]},
    {"slug": "verde-wellness", "title": "Verde", "client": "Verde Wellness", "industry": "Health & Wellness", "featured": False, "order": 4,
     "categories": ["Website Design", "Wellness"], "tags": ["wellness", "brand"],
     "cover": IMG["p4"], "live_url": "https://example.com",
     "technologies": ["React", "FastAPI", "MongoDB"],
     "overview": "A wellness brand needed a serene digital home that mirrored their in-studio calm.",
     "problem": "A busy, high-contrast site felt at odds with their brand promise of calm.",
     "solution": "A soft, spacious editorial design with gentle motion and a booking flow.",
     "process": "Brand refresh, design system, build and integrations.",
     "results": [{"value": "+44%", "label": "Bookings"}, {"value": "+2x", "label": "Newsletter"}, {"value": "1.1s", "label": "Load"}],
     "gallery": [IMG["p4"], IMG["p5"], IMG["studio1"]]},
    {"slug": "harborview-realty", "title": "Harborview", "client": "Harborview Realty", "industry": "Real Estate", "featured": False, "order": 5,
     "categories": ["Website Design", "Real Estate"], "tags": ["realestate"],
     "cover": IMG["p5"], "live_url": "https://example.com",
     "technologies": ["React", "FastAPI", "Mapbox"],
     "overview": "A luxury realty group wanted listings to feel like a coffee-table book.",
     "problem": "Generic listing portals commoditised their premium properties.",
     "solution": "An immersive, map-driven experience with cinematic property tours.",
     "process": "Design system, map integration, CMS and build.",
     "results": [{"value": "+70%", "label": "Enquiries"}, {"value": "+3.5m", "label": "Avg. time"}, {"value": "+29%", "label": "Return visits"}],
     "gallery": [IMG["p5"], IMG["p6"], IMG["p2"]]},
    {"slug": "cadence-studio", "title": "Cadence", "client": "Cadence Studio", "industry": "Professional Services", "featured": False, "order": 6,
     "categories": ["Website Design", "Agency"], "tags": ["agency", "portfolio"],
     "cover": IMG["p6"], "live_url": "https://example.com",
     "technologies": ["React", "FastAPI", "MongoDB"],
     "overview": "A production studio needed a portfolio that let their work breathe.",
     "problem": "Their reel was buried under heavy navigation and slow galleries.",
     "solution": "A fast, full-bleed portfolio with buttery transitions and a lean CMS.",
     "process": "Art direction, motion design and a performant build.",
     "results": [{"value": "+85%", "label": "Reel views"}, {"value": "0.9s", "label": "Load"}, {"value": "+48%", "label": "Enquiries"}],
     "gallery": [IMG["p6"], IMG["p3"], IMG["p1"]]},
]

CASE_STUDIES = [
    {"slug": "meridian-trust-rebuild", "title": "Rebuilding trust for Meridian Capital", "client": "Meridian Capital", "industry": "Finance", "featured": True, "order": 1,
     "cover": IMG["p1"], "before_image": IMG["studio2"], "after_image": IMG["p1"],
     "summary": "How an editorial redesign lifted qualified enquiries by 61% for a private wealth firm.",
     "challenge": "Meridian's digital presence contradicted their premium, high-touch service. High-net-worth prospects were bouncing before booking a consultation, and the sales team blamed the website — rightly so.",
     "solution": "We rebuilt the brand's digital language around restraint and precision: a serif-accented type system, generous whitespace, bespoke data visualisation and motion that felt engineered rather than decorative.",
     "process": "Two discovery workshops mapped the buyer journey. We prototyped a new homepage narrative, validated it with five client interviews, then rolled the system across 40 pages with an SEO-safe migration.",
     "results": [{"value": "+61%", "label": "Qualified enquiries"}, {"value": "+2.4x", "label": "Session duration"}, {"value": "0.8s", "label": "Median load"}, {"value": "#1", "label": "For 12 key terms"}],
     "gallery": [IMG["p1"], IMG["p2"], IMG["studio2"]],
     "seo": {"meta_title": "Case Study: Meridian Capital — Apexora Studio", "meta_description": "How Apexora lifted qualified enquiries 61% for Meridian Capital."}},
    {"slug": "atelier-nord-commerce", "title": "An editorial storefront for Atelier Nord", "client": "Atelier Nord", "industry": "Fashion", "featured": True, "order": 2,
     "cover": IMG["p2"], "before_image": IMG["p5"], "after_image": IMG["p2"],
     "summary": "Turning a transactional catalogue into a desirable, high-AOV commerce experience.",
     "challenge": "Atelier Nord's craftsmanship was invisible online. Their store looked like every other Shopify theme, and average order value stagnated despite a loyal audience.",
     "solution": "We designed an immersive, editorial storefront where each product told a story — cinematic imagery, considered typography and a checkout stripped of friction.",
     "process": "We rebuilt the merchandising strategy, art-directed a new photography style guide, and shipped a headless commerce build with motion design throughout.",
     "results": [{"value": "+38%", "label": "Average order value"}, {"value": "+52%", "label": "Conversion rate"}, {"value": "-40%", "label": "Bounce rate"}, {"value": "+2.1x", "label": "Returning buyers"}],
     "gallery": [IMG["p2"], IMG["p4"], IMG["p5"]],
     "seo": {"meta_title": "Case Study: Atelier Nord — Apexora Studio", "meta_description": "An editorial e-commerce redesign that lifted AOV 38%."}},
    {"slug": "northwind-dual-audience", "title": "Speaking to two audiences for Northwind", "client": "Northwind Labs", "industry": "SaaS", "featured": False, "order": 3,
     "cover": IMG["p3"], "before_image": IMG["p6"], "after_image": IMG["p3"],
     "summary": "A dual-track narrative that doubled trial signups without alienating engineers.",
     "challenge": "Northwind sold to developers but needed buy-in from buyers. Their old site tried to please both and converted neither.",
     "solution": "We designed a dual-track homepage — an engineer's technical proof path and a buyer's value path — unified by one crisp system.",
     "process": "Positioning sprints, message testing, interactive demos and a component-driven build.",
     "results": [{"value": "+120%", "label": "Trial signups"}, {"value": "+3.1x", "label": "Demo requests"}, {"value": "98", "label": "Lighthouse score"}, {"value": "-33%", "label": "Bounce rate"}],
     "gallery": [IMG["p3"], IMG["p1"], IMG["p6"]],
     "seo": {"meta_title": "Case Study: Northwind — Apexora Studio", "meta_description": "How a dual-audience redesign doubled trial signups."}},
]

POSTS = [
    {"slug": "psychology-of-premium-web-design", "title": "The psychology of premium web design", "category": "Design", "tags": ["branding", "psychology"],
     "author": "Elena Vasquez", "cover": IMG["blog1"], "status": "published", "featured": True, "read_time": 6,
     "excerpt": "Why the first three seconds decide whether a visitor trusts your business — and how design controls that verdict.",
     "content": "Every visitor makes a snap judgement about your credibility in milliseconds. Research from Google shows users form aesthetic impressions in as little as 50 milliseconds — long before they read a single word.\n\nPremium design works because it signals competence. Generous whitespace communicates confidence. Considered typography suggests attention to detail. Smooth, purposeful motion implies engineering rigor. Together, these cues tell a visitor: this is a company that takes itself — and you — seriously.\n\nThe brands that win online aren't necessarily the ones with the most features. They're the ones that feel the most trustworthy in the first three seconds. That feeling is designable.",
     "published_at": _now()},
    {"slug": "web-performance-is-a-feature", "title": "Web performance is a feature, not a chore", "category": "Engineering", "tags": ["performance", "core-web-vitals"],
     "author": "Priya Nair", "cover": IMG["blog2"], "status": "published", "featured": True, "read_time": 5,
     "excerpt": "Fast sites feel expensive. Here's how Core Web Vitals quietly shape perception and revenue.",
     "content": "Speed is invisible until it's missing. A one-second delay in load time can reduce conversions by up to 20%. But performance is more than a metric — it's a feeling.\n\nWhen a page responds instantly, it feels premium and reliable. When it stutters, users subconsciously distrust the brand behind it. Core Web Vitals — LCP, CLS and INP — are Google's attempt to quantify that feeling.\n\nAt Apexora we treat performance as a design constraint from day one: budget every image, defer every non-critical script and animate only transform and opacity. The result is a site that feels as considered as it looks.",
     "published_at": _now()},
    {"slug": "designing-with-restraint", "title": "Designing with restraint: less, but better", "category": "Design", "tags": ["minimalism", "editorial"],
     "author": "Marcus Chen", "cover": IMG["blog3"], "status": "published", "featured": False, "read_time": 4,
     "excerpt": "Luxury isn't more — it's the confidence to remove everything that isn't essential.",
     "content": "Dieter Rams said it best: good design is as little design as possible. Restraint is the hardest discipline in our craft because it requires taste and courage.\n\nEvery element you add competes for attention. Every element you remove clarifies. The most premium websites in the world — from Aesop to Apple — win by subtraction, not addition.\n\nRestraint doesn't mean boring. It means intentional. A single, perfectly-timed animation carries more weight than a dozen competing ones.",
     "published_at": _now()},
    {"slug": "conversion-copy-meets-design", "title": "Where conversion copy meets design", "category": "Strategy", "tags": ["conversion", "copywriting"],
     "author": "James Okafor", "cover": IMG["p4"], "status": "published", "featured": False, "read_time": 7,
     "excerpt": "The best-designed page in the world fails if the words don't earn the click.",
     "content": "Design and copy are not separate disciplines — they're one conversation with the visitor. A headline sets the promise; the layout paces the argument; the button closes it.\n\nWe write and design in tandem. Hierarchy isn't just visual — it's rhetorical. The order in which ideas appear determines whether a visitor believes you by the time they reach the call to action.\n\nGreat conversion design is invisible persuasion: it feels like clarity, not selling.",
     "published_at": _now()},
    {"slug": "the-case-for-a-real-cms", "title": "The case for a CMS your team actually enjoys", "category": "Engineering", "tags": ["cms", "workflow"],
     "author": "Priya Nair", "cover": IMG["p3"], "status": "published", "featured": False, "read_time": 5,
     "excerpt": "A beautiful site that only developers can edit is a liability. Ownership is a feature.",
     "content": "The moment a website launches, it starts to age. The difference between a site that stays sharp and one that decays is whether the team can update it themselves.\n\nWe build every Apexora site on a content model designed around how your team actually works — clear fields, live previews and no code required. Every heading, image and section is editable.\n\nOwnership isn't just convenient — it's strategic. Teams that can publish freely ship more, test more and win more.",
     "published_at": _now()},
    {"slug": "motion-with-meaning", "title": "Motion with meaning", "category": "Design", "tags": ["motion", "animation"],
     "author": "Marcus Chen", "cover": IMG["blog1"], "status": "draft", "featured": False, "read_time": 4,
     "excerpt": "Animation should guide attention and reward interaction — never decorate for its own sake.",
     "content": "Motion is a language. Used well, it orients users, creates continuity and adds delight. Used poorly, it distracts and slows everything down.\n\nOur rule is simple: every animation must earn its place by improving comprehension or feedback. Entrances reveal hierarchy. Hover states confirm interactivity. Transitions preserve context between views.\n\nThe best motion is felt, not noticed.",
     "published_at": None},
]

TESTIMONIALS = [
    {"quote": "Apexora didn't just redesign our website — they redefined how the market sees us. Enquiries are up, and every one arrives already trusting us.", "name": "Sarah Lindqvist", "role": "CMO", "company": "Meridian Capital", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop", "featured": True, "order": 1},
    {"quote": "The most professional studio we've worked with. Their eye for detail is unreal and the site performs beautifully.", "name": "David Osei", "role": "Founder", "company": "Northwind Labs", "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop", "featured": True, "order": 2},
    {"quote": "Our new storefront finally feels as premium as our products. Average order value jumped within the first month.", "name": "Ingrid Solberg", "role": "Creative Director", "company": "Atelier Nord", "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop", "featured": True, "order": 3},
    {"quote": "Working with Apexora felt like adding a senior design team overnight. Calm, sharp and genuinely collaborative.", "name": "Thomas Bergström", "role": "CEO", "company": "Harborview Realty", "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop", "featured": False, "order": 4},
    {"quote": "They translated a fuzzy brief into a website that feels inevitable. I can't imagine our brand any other way now.", "name": "Amara Blake", "role": "Founder", "company": "Verde Wellness", "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop", "featured": False, "order": 5},
]

FAQS = [
    {"question": "How much does a website cost?", "answer": "Most studio engagements range from $12k for a focused landing page system to $60k+ for a full brand website with a custom CMS. We scope precisely after a free discovery call.", "order": 1},
    {"question": "How long does a project take?", "answer": "A typical marketing website takes 6–10 weeks from kickoff to launch. Landing pages can ship in 2–3 weeks. We share a clear timeline before we begin.", "order": 2},
    {"question": "Do you work with our existing brand?", "answer": "Absolutely. We can design within your existing brand guidelines or evolve them. Many clients use a website project as a catalyst for a light brand refresh.", "order": 3},
    {"question": "Can our team edit the website ourselves?", "answer": "Yes. Every Apexora site ships with a purpose-built CMS. Every heading, image, and section is editable without touching code — and changes go live instantly.", "order": 4},
    {"question": "Do you handle SEO and performance?", "answer": "Performance and technical SEO are built in from day one — semantic markup, structured data, sitemaps and sub-second loads. We also offer ongoing optimization retainers.", "order": 5},
    {"question": "What happens after launch?", "answer": "We offer maintenance and growth retainers for content updates, monitoring, security and continued conversion optimization. We're partners, not a one-and-done vendor.", "order": 6},
]

SEO_PAGES = {
    "/": HOME["seo"],
    "/about": ABOUT["seo"],
    "/services": {"meta_title": "Services — Apexora Studio", "meta_description": "Website design, redesign, e-commerce, UI/UX and SEO development from a premium studio."},
    "/portfolio": {"meta_title": "Work — Apexora Studio", "meta_description": "Selected premium website projects by Apexora Studio."},
    "/case-studies": {"meta_title": "Case Studies — Apexora Studio", "meta_description": "In-depth stories of measurable results from Apexora Studio."},
    "/blog": {"meta_title": "Journal — Apexora Studio", "meta_description": "Essays on premium web design, performance and conversion."},
    "/contact": {"meta_title": "Contact — Apexora Studio", "meta_description": "Start a project or request a free website audit from Apexora Studio."},
}


async def seed_all():
    if not await db.settings.find_one({"id": "site"}):
        await db.settings.insert_one({**SETTINGS, "updated_at": _now()})
    if not await db.pages.find_one({"id": "home"}):
        await db.pages.insert_one({**HOME, "updated_at": _now()})
    if not await db.pages.find_one({"id": "about"}):
        await db.pages.insert_one({**ABOUT, "updated_at": _now()})

    if await db.services.count_documents({}) == 0:
        for s in SERVICES:
            await db.services.insert_one({"id": str(uuid.uuid4()), **s, "created_at": _now(), "updated_at": _now()})
    if await db.portfolio.count_documents({}) == 0:
        for p in PORTFOLIO:
            await db.portfolio.insert_one({"id": str(uuid.uuid4()), **p, "created_at": _now(), "updated_at": _now()})
    if await db.case_studies.count_documents({}) == 0:
        for c in CASE_STUDIES:
            await db.case_studies.insert_one({"id": str(uuid.uuid4()), **c, "created_at": _now(), "updated_at": _now()})
    if await db.posts.count_documents({}) == 0:
        for i, p in enumerate(POSTS):
            await db.posts.insert_one({"id": str(uuid.uuid4()), **p, "created_at": (datetime.now(timezone.utc) - timedelta(days=i*3)).isoformat(), "updated_at": _now()})
    if await db.testimonials.count_documents({}) == 0:
        for t in TESTIMONIALS:
            await db.testimonials.insert_one({"id": str(uuid.uuid4()), **t, "created_at": _now()})
    if await db.faqs.count_documents({}) == 0:
        for f in FAQS:
            await db.faqs.insert_one({"id": str(uuid.uuid4()), **f, "created_at": _now()})
    if await db.seo.count_documents({}) == 0:
        for path, val in SEO_PAGES.items():
            await db.seo.insert_one({"id": str(uuid.uuid4()), "path": path, **val, "og_image": "", "canonical": "", "robots": "index,follow", "updated_at": _now()})
