/**
 * Live portfolio index fed by public GitHub org metadata.
 * Client-side fetch (no token) with a committed build-time snapshot as
 * initial data / fallback, so GitHub Pages (static) and rate limits are fine.
 */
import { useQuery } from "@tanstack/react-query";
import snapshot from "@/data/github-repos.snapshot.json";

export const GITHUB_ORG = "MelodicBloom";
const ORG_REPOS_URL = `https://api.github.com/orgs/${GITHUB_ORG}/repos?per_page=100&sort=updated`;

/** Curated allowlist, in display order. Repos that 404/disappear are skipped. */
export const PORTFOLIO_ALLOWLIST = [
  "wildfire-iridescent",
  "morphism-nextjs",
  "mochi-ui",
  "lithomemphis",
  "melodyfire",
  "neobrutalism-lab",
  "seed-loom",
  "ripple-viscous-fluid-simulator",
  "fur-shader-playground",
  "Project-Card-Manager",
  "nacre-orchid-atelier",
  "chromaflora-prime",
  "svg-filter-lab",
  "kozo-dreams",
  "woodmorphism",
  "shader-grammar",
  "aurora",
  "aether",
  "flore-orthography-memphis-ui",
  "Artisan-Solutions-Hub",
] as const;

export interface GithubRepo {
  name: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  pushed_at: string;
  html_url: string;
  fork: boolean;
  archived: boolean;
  stargazers_count?: number;
}

export interface PortfolioProject {
  slug: string;
  title: string;
  description: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  pushedAt: string;
  year: number;
  repoUrl: string;
  stars: number;
  hue: number;
}

const order = new Map<string, number>(
  PORTFOLIO_ALLOWLIST.map((n, i) => [n.toLowerCase(), i]),
);

const ACRONYMS = new Set(["ui", "ux", "svg", "css", "gl", "ai"]);

function titleize(name: string) {
  return name
    .split(/[-_]/)
    .map((w) => (ACRONYMS.has(w.toLowerCase()) ? w.toUpperCase() : w === "nextjs" ? "Next.js" : w[0]?.toUpperCase() + w.slice(1)))
    .join(" ");
}

/** Stable hue per repo so each card gets its own tactile swatch. */
function hueFor(name: string) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
}

export function toPortfolio(repos: GithubRepo[]): PortfolioProject[] {
  return repos
    .filter((r) => !r.fork && !r.archived && order.has(r.name.toLowerCase()))
    .sort((a, b) => order.get(a.name.toLowerCase())! - order.get(b.name.toLowerCase())!)
    .map((r) => ({
      slug: r.name,
      title: titleize(r.name),
      description: r.description ?? "",
      homepage: r.homepage || null,
      language: r.language,
      topics: r.topics ?? [],
      pushedAt: r.pushed_at,
      year: new Date(r.pushed_at).getFullYear(),
      repoUrl: r.html_url,
      stars: r.stargazers_count ?? 0,
      hue: hueFor(r.name),
    }));
}

async function fetchRepos(): Promise<GithubRepo[]> {
  const res = await fetch(ORG_REPOS_URL, { headers: { Accept: "application/vnd.github+json" } });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  return res.json();
}

const snapshotRepos = snapshot as GithubRepo[];

export function usePortfolio() {
  const q = useQuery({
    queryKey: ["github-org-repos", GITHUB_ORG],
    queryFn: fetchRepos,
    initialData: snapshotRepos,
    initialDataUpdatedAt: 0, // treat snapshot as stale → refetch live on mount
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
  // On error react-query keeps the last data (the snapshot), so the grid never empties.
  return { projects: toPortfolio(q.data ?? snapshotRepos), isLive: q.isSuccess && q.dataUpdatedAt > 0, error: q.error };
}

/** View-transition name shared by a card and its detail hero. */
export const vtName = (slug: string) => `repo-${slug.toLowerCase().replace(/[^a-z0-9-]/g, "-")}`;
