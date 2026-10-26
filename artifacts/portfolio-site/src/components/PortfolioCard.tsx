import { motion } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import type { CSSProperties } from "react";
import { type PortfolioProject, vtName } from "@/lib/portfolio";
import { useViewTransitionNavigate } from "@/lib/view-transition";

export function swatchStyle(p: PortfolioProject, name?: string): CSSProperties {
  return {
    background: `radial-gradient(120% 90% at 20% 15%, hsl(${p.hue} 85% 72%) 0%, transparent 55%),
      radial-gradient(90% 120% at 90% 90%, hsl(${(p.hue + 70) % 360} 75% 55%) 0%, transparent 60%),
      linear-gradient(135deg, hsl(${(p.hue + 200) % 360} 55% 30%), hsl(${(p.hue + 30) % 360} 65% 45%))`,
    viewTransitionName: name,
  } as CSSProperties;
}

export function PortfolioCard({ project, index }: { project: PortfolioProject; index: number }) {
  const go = useViewTransitionNavigate();
  const href = `/projects/${project.slug}`;
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return (
    <motion.a
      href={`${base}${href}`}
      onClick={(e) => go(href, e)}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 12) * 0.03, type: "spring", stiffness: 260, damping: 24 }}
      whileHover={{ y: -6, rotate: index % 2 ? 0.6 : -0.6 }}
      whileTap={{ scale: 0.97 }}
      className="pf-card group block bg-card border border-card-border rounded-2xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      style={{ viewTransitionName: `${vtName(project.slug)}-card` } as CSSProperties}
    >
      <div className="pf-swatch h-32 relative overflow-hidden" style={swatchStyle(project, vtName(project.slug))}>
        <div className="pf-grain absolute inset-0" />
        {project.language && (
          <span className="absolute left-3 bottom-3 text-[11px] font-mono px-2 py-0.5 rounded-full bg-black/35 text-white backdrop-blur-sm">
            {project.language}
          </span>
        )}
        {project.homepage && (
          <span className="absolute right-3 top-3 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-white/85 text-black">
            Live
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3
            className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors"
            style={{ viewTransitionName: `${vtName(project.slug)}-title` } as CSSProperties}
          >
            {project.title}
          </h3>
          <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-3 min-h-[3.6em]">
          {project.description || "No description yet."}
        </p>
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1 min-w-0">
            {project.topics.slice(0, 2).map((t) => (
              <span key={t} className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground truncate">{t}</span>
            ))}
          </div>
          <span className="text-xs text-muted-foreground flex items-center gap-2 shrink-0">
            {project.stars > 0 && (<span className="flex items-center gap-0.5"><Star className="w-3 h-3" />{project.stars}</span>)}
            {project.year}
          </span>
        </div>
      </div>
    </motion.a>
  );
}
