import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { resolveMedia } from "@/lib/api";

export default function ProjectCard({ project, index = 0 }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: (index % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group"
      data-testid={`project-card-${project.slug}`}
    >
      <Link to={`/portfolio/${project.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-secondary">
          <motion.img
            src={resolveMedia(project.cover)}
            alt={project.title}
            loading="lazy"
            style={{ y }}
            className="h-[116%] w-full scale-105 object-cover transition-[filter,transform] duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
          <span className="absolute left-4 top-4 rounded-full bg-background/85 px-3 py-1 text-xs tracking-tight text-foreground backdrop-blur">
            {project.industry}
          </span>
        </div>
        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl tracking-tight transition-colors duration-300 group-hover:text-brand">
              {project.title}
            </h3>
            <p className="mt-1 max-w-md text-sm text-muted-foreground line-clamp-2">{project.overview}</p>
          </div>
          <span className="mt-1 shrink-0 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
