// Refresh the committed GitHub snapshot: node scripts/snapshot-repos.mjs
import { writeFile } from "node:fs/promises";
const res = await fetch("https://api.github.com/orgs/MelodicBloom/repos?per_page=100&sort=updated", {
  headers: { Accept: "application/vnd.github+json" },
});
if (!res.ok) throw new Error(`GitHub API ${res.status}`);
const keep = ["name", "description", "homepage", "language", "topics", "pushed_at", "html_url", "fork", "archived", "stargazers_count"];
const repos = (await res.json()).map((r) => Object.fromEntries(keep.map((k) => [k, r[k]])));
await writeFile(new URL("../src/data/github-repos.snapshot.json", import.meta.url), JSON.stringify(repos, null, 2) + "\n");
console.log(`wrote ${repos.length} repos`);
