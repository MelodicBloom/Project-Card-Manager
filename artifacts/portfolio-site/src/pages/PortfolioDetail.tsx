import { useParams } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github, Tag, Calendar, Code2, Star } from "lucide-react";
import type { CSSProperties } from "react";
import { usePortfolio, vtName } from "@/lib/portfolio";
import { useViewTransitionNavigate } from "@/lib/view-transition";
import { swatchStyle } from "@/components/PortfolioCard";

export default function PortfolioDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { projects } = usePortfolio();
  const go = useViewTransitionNavigate();
  const project = projects.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
  const back = (e: React.MouseEvent) => go("/projects", e, "back");

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-14">
        <div className="text-center">
          <p className="text-6xl mb-4">🔍</p>
          <h1 className="text-2xl font-bold mb-2">Project not found</h1>
          <p className="text-muted-foreground mb-6">“{slug}” isn't in the portfolio index.</p>
          <button onClick={back} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium mx-auto">
            <ArrowLeft className="w-4 h-4" /> Back to projects
          </button>
        </div>
      </div>
    );
  }

  const updated = new Date(project.pushedAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  const fade = (d: number) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.12 + d, type: "spring" as const, stiffness: 240, damping: 26 } });

  return (
    <div className="min-h-screen bg-background pt-14">
      <div className="pf-swatch h-72 relative overflow-hidden flex items-end" style={swatchStyle(project, vtName(project.slug))}>
        <div className="pf-grain absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
        <div className="relative max-w-5xl mx-auto w-full px-6 pb-10">
          <button onClick={back} className="flex items-center gap-1.5 text-white/75 hover:text-white text-sm mb-5 transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Projects
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 w-fit" style={{ viewTransitionName: `${vtName(project.slug)}-title` } as CSSProperties}>
            {project.title}
          </h1>
          <p className="text-white/75 text-lg font-mono">{project.slug}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <motion.p {...fade(0)} className="text-muted-foreground leading-relaxed text-base">
              {project.description || "No description yet."}
            </motion.p>
            <motion.div {...fade(0.06)} className="flex flex-wrap gap-3">
              {project.homepage && (
                <a href={project.homepage} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:opacity-90 transition-opacity">
                  <ExternalLink className="w-4 h-4" /> Open live demo
                </a>
              )}
              <a href={project.repoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-muted text-foreground rounded-xl font-medium text-sm hover:bg-muted/70 transition-colors">
                <Github className="w-4 h-4" /> View source
              </a>
            </motion.div>
          </div>

          <motion.div {...fade(0.1)} className="space-y-5">
            <div className="bg-card border border-card-border rounded-2xl p-5 grid grid-cols-2 gap-3">
              <div className="bg-muted rounded-xl p-3">
                <div className="text-lg font-bold text-foreground flex items-center gap-1.5"><Code2 className="w-4 h-4 text-primary" />{project.language ?? "—"}</div>
                <div className="text-xs text-muted-foreground">Language</div>
              </div>
              <div className="bg-muted rounded-xl p-3">
                <div className="text-lg font-bold text-foreground flex items-center gap-1.5"><Star className="w-4 h-4 text-primary" />{project.stars}</div>
                <div className="text-xs text-muted-foreground">Stars</div>
              </div>
              <div className="bg-muted rounded-xl p-3 col-span-2">
                <div className="text-lg font-bold text-foreground flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary" />{updated}</div>
                <div className="text-xs text-muted-foreground">Last pushed</div>
              </div>
            </div>
            {project.topics.length > 0 && (
              <div className="bg-card border border-card-border rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Tag className="w-4 h-4 text-primary" /> Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {project.topics.map((t) => (
                    <span key={t} className="text-xs px-2.5 py-1 bg-primary/10 text-primary rounded-full font-medium">{t}</span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
