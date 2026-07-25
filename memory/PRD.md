# Apexora Studio — PRD & Build Log

## Original Problem
Production-ready premium website for a luxury web design studio "Apexora Studio" (editorial, Apple/Linear/Aesop-inspired) with a full database-driven CMS. Every text, image and section editable from admin without code; changes reflect live instantly.

## Stack
FastAPI + React + MongoDB. Auth: JWT email/password (roles admin/editor). Media: Emergent managed object storage. Email: Resend (graceful no-op until key added). Motion: framer-motion + lenis + react-fast-marquee. Fonts: Clash Display / Outfit / Cormorant Garamond.

## User Choices
- Secure email/password auth, default admin, roles admin/editor, forgot/change password.
- Email notification on every enquiry (Resend) + store + read/unread + CSV + rate limit.
- Media storage: requested Supabase → implemented via Emergent managed object storage (turnkey, no external keys) covering folders, drag&drop, replace-without-URL-change, delete, alt text, public URLs.
- Light + Dark mode, default light, toggle in nav, localStorage persistence.
- Full CMS modules for portfolio/case studies/blog with all fields.

## Implemented (2025-12)
- Public site: Home (kinetic hero line reveal, marquee, featured projects w/ parallax, why/process manifesto, services, industries, testimonials, latest articles, FAQ, CTA), About, Services, Portfolio (+detail), Case Studies (+detail), Blog (search/category/related), Contact (full form + map + rate limit + honeypot), Privacy, Terms, 404. SEO meta/OG/Twitter/canonical/schema per page.
- Admin CMS at /admin: JWT login + forgot/reset, Dashboard stats, Homepage & About page editors (deep-path editing), Services/Portfolio/Case Studies/Blog/Testimonials/FAQ managers (schema-driven CRUD), Media Library (upload/drag-drop/replace/delete/alt/folders/search), SEO Manager (per-page + GA/GSC/robots), Enquiries (read/unread/delete/CSV/detail), Settings (brand/logo/favicon/contact/socials/nav + change password), User Management (admin-only, roles).
- Backend: idempotent admin + content seeding (realistic content, no lorem), brute-force lockout (email-keyed, X-Forwarded-For aware), enquiry rate limiting, public media serving with cache headers.

## Verified
Testing agent iteration_1: backend 34/34 (after brute-force fix), frontend 100%.
Testing agent iteration_2: backend 47/47, frontend 100% — all marketing page intros (Services/Portfolio/Case Studies/Blog/Contact/Privacy/Terms) now CMS-editable via /admin/pages/:id; edit→live verified. SEO seeded for all public paths incl. /privacy and /terms.

## Full editability (nothing hardcoded)
Every marketing page is DB-driven: Home & About (deep-path editors), Services/Portfolio/Case Studies/Blog/Contact/Privacy/Terms page intros + Services CTA + legal sections (page editors), plus collections (Services, Portfolio, Case Studies, Blog, Testimonials, FAQs), Navigation, Footer, Logo, Favicon, Contact details, Social links, SEO metadata (per path), and Media — all editable from /admin.

## Credentials
admin@apexora.studio / Apexora@2025 (see /app/memory/test_credentials.md)

## Backlog / Next
- P1: Add RESEND_API_KEY to enable enquiry email notifications (currently logged only).
- P1: XML sitemap + robots.txt static routes; wire GA snippet injection from SEO settings.
- P2: Blog scheduled publishing worker; per-project SEO surfaced in list; image auto-resize variants.
- P2: Optional Supabase Storage adapter if external hosting later required.
