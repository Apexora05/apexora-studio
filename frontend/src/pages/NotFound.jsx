import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Seo from "@/components/site/Seo";
import { BtnLink } from "@/components/site/ui";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-5" data-testid="not-found-page">
      <Seo title="Page not found — Apexora Studio" description="The page you're looking for doesn't exist." />
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[28vw] leading-none tracking-tighter text-foreground md:text-[16rem]"
        >
          404
        </motion.h1>
        <p className="mt-6 text-lg text-muted-foreground">This page has wandered off the grid.</p>
        <div className="mt-10 flex justify-center gap-3">
          <BtnLink to="/" variant="primary" dataTestid="notfound-home">Back home</BtnLink>
          <BtnLink to="/portfolio" variant="outline" dataTestid="notfound-work">View work</BtnLink>
        </div>
      </div>
    </div>
  );
}
