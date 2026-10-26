import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Filter, X, Github } from "lucide-react";
import { usePortfolio, GITHUB_ORG } from "@/lib/portfolio";
import { PortfolioCard } from "@/components/PortfolioCard";

/** In-site experiments that have hand-written detail pages (kept from v0). */
const LOCAL_EXPERIMENTS = [
  { title: "Paint Swirl Generator", href: "/project/paint-swirl", emoji: "🌀" },
  { title: "Particle Gravity Field", href: "/project/particle-gravity", emoji: "⚛️" },
];

export default function Projects() {
  const { projects, isLive } = usePortfolio();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const languages = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((p) => p.language && counts.set(p.language, (counts.get(p.language) ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([l]) => l);
  }, [projects]);

  const filtered = projects.filter((p) => {
    const matchCat = activeFilter === "all" || p.language === activeFilter || (activeFilter === "live" && !!p.homepage);
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.topics.some((t) => t.includes(q));
    return matchCat && matchSearch;
  });

  const chips = [{ id: "all", label: "All" }, { id: "live", label: "Live demos" }, ...languages.map((l) => ({ id: l, label: l }))];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-20">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Projects</h1>
          <p className="text-muted-foreground flex items-center gap-2 flex-wrap">
            A live index of the {GITHUB_ORG} studio, fed from GitHub.
            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${isLive ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-muted"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"}`} />
              {isLive ? "live" : "snapshot"}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="flex flex-wrap items-center gap-1 bg-muted rounded-xl p-1">
            {chips.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === cat.id ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 min-w-48 max-w-72">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search projects or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-8 py-2 text-sm bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <span className="text-sm text-muted-foreground ml-auto">{filtered.length} project{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-muted-foreground">No projects match your search.</p>
            <button onClick={() => { setSearchQuery(""); setActiveFilter("all"); }} className="mt-4 text-primary text-sm hover:underline">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p, i) => <PortfolioCard key={p.slug} project={p} index={i} />)}
          </div>
        )}

        <div className="mt-14 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>In-site experiments:</span>
          {LOCAL_EXPERIMENTS.map((x) => (
            <Link key={x.href} href={x.href} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-full hover:text-foreground transition-colors">
              <span>{x.emoji}</span>{x.title}<ArrowRight className="w-3 h-3" />
            </Link>
          ))}
          <a href={`https://github.com/${GITHUB_ORG}`} target="_blank" rel="noreferrer" className="ml-auto inline-flex items-center gap-1.5 hover:text-foreground">
            <Github className="w-4 h-4" /> github.com/{GITHUB_ORG}
          </a>
        </div>
      </div>
    </div>
  );
}
