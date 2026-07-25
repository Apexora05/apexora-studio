import { Outlet } from "react-router-dom";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import SmoothScroll from "@/components/site/SmoothScroll";

export default function SiteLayout() {
  return (
    <SmoothScroll>
      <div className="grain relative min-h-screen bg-background text-foreground">
        <Nav />
        <main className="relative z-10">
          <Outlet />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
