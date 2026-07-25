import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "@/App.css";

import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { SiteProvider, useSite } from "@/context/SiteContext";
import { Toaster } from "@/components/ui/sonner";
import { resolveMedia } from "@/lib/api";

import SiteLayout from "@/components/site/SiteLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Portfolio from "@/pages/Portfolio";
import PortfolioDetail from "@/pages/PortfolioDetail";
import CaseStudies from "@/pages/CaseStudies";
import CaseStudyDetail from "@/pages/CaseStudyDetail";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
import Contact from "@/pages/Contact";
import Legal from "@/pages/Legal";
import NotFound from "@/pages/NotFound";

import AdminLogin from "@/pages/admin/AdminLogin";
import Dashboard from "@/pages/admin/Dashboard";
import Enquiries from "@/pages/admin/Enquiries";
import MediaLibrary from "@/pages/admin/MediaLibrary";
import Settings from "@/pages/admin/Settings";
import SeoManager from "@/pages/admin/SeoManager";
import Users from "@/pages/admin/Users";
import PageEditor from "@/pages/admin/PageEditor";
import CollectionManager from "@/pages/admin/CollectionManager";

function BrandMeta() {
  const { settings } = useSite();
  const { pathname } = useLocation();
  useEffect(() => {
    if (settings?.favicon_url) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) { link = document.createElement("link"); link.rel = "icon"; document.head.appendChild(link); }
      link.href = resolveMedia(settings.favicon_url);
    }
  }, [settings]);
  useEffect(() => {
    if (!pathname.startsWith("/admin") && settings?.brand_name) {
      // default title if a page didn't set one
    }
  }, [pathname, settings]);
  return null;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SiteProvider>
          <BrowserRouter>
            <BrandMeta />
            <Toaster position="top-center" />
            <Routes>
              {/* Public marketing site */}
              <Route element={<SiteLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/portfolio/:slug" element={<PortfolioDetail />} />
                <Route path="/case-studies" element={<CaseStudies />} />
                <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Legal type="privacy" />} />
                <Route path="/terms" element={<Legal type="terms" />} />
              </Route>

              {/* Admin */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="enquiries" element={<Enquiries />} />
                <Route path="pages/:pageId" element={<PageEditor />} />
                <Route path="services" element={<CollectionManager collectionKey="services" />} />
                <Route path="portfolio" element={<CollectionManager collectionKey="portfolio" />} />
                <Route path="case-studies" element={<CollectionManager collectionKey="case-studies" />} />
                <Route path="blog" element={<CollectionManager collectionKey="blog" />} />
                <Route path="testimonials" element={<CollectionManager collectionKey="testimonials" />} />
                <Route path="faqs" element={<CollectionManager collectionKey="faqs" />} />
                <Route path="media" element={<MediaLibrary />} />
                <Route path="seo" element={<SeoManager />} />
                <Route path="settings" element={<Settings />} />
                <Route path="users" element={<ProtectedRoute requireRole="admin"><Users /></ProtectedRoute>} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SiteProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
