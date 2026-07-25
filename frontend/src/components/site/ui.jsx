import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

// Premium pill button used across the marketing site.
export function BtnLink({ to, children, variant = "primary", className = "", dataTestid, external = false, icon = true }) {
  const base =
    "group relative inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-tight transition-transform duration-300 will-change-transform hover:-translate-y-0.5 active:translate-y-0";
  const styles = {
    primary: "bg-foreground text-background hover:bg-foreground/90",
    accent: "bg-brand text-white hover:brightness-110",
    outline: "border border-border text-foreground hover:border-foreground",
    ghost: "text-foreground hover:text-brand",
  };
  const content = (
    <>
      <span>{children}</span>
      {icon && (
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </>
  );
  const cls = `${base} ${styles[variant]} ${className}`;
  if (external) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className={cls} data-testid={dataTestid}>
        {content}
      </a>
    );
  }
  return (
    <Link to={to} className={cls} data-testid={dataTestid}>
      {content}
    </Link>
  );
}

export function Eyebrow({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] font-semibold text-muted-foreground ${className}`}>
      <span className="h-px w-6 bg-brand" />
      {children}
    </span>
  );
}

export function SectionHeading({ eyebrow, title, className = "", align = "left" }) {
  return (
    <div className={`${align === "center" ? "text-center mx-auto" : ""} max-w-3xl ${className}`}>
      {eyebrow && <Eyebrow className={align === "center" ? "justify-center" : ""}>{eyebrow}</Eyebrow>}
      <h2 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[0.98]">
        {title}
      </h2>
    </div>
  );
}

// Hover-tilt / lift card wrapper
export function LiftCard({ children, className = "" }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
