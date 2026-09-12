import { defineConfig, type Plugin } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import mdx from "@mdx-js/rollup"
import remarkGfm from "remark-gfm"
import rehypeSlug from "rehype-slug"
import rehypePrettyCode from "rehype-pretty-code"
import { execFileSync } from "node:child_process"
import { readdir, readFile } from "node:fs/promises"
import { join } from "node:path"

// The search index, reduced to plain text at build time. Not `?raw`: the mdx
// plugin claims .mdx with any query, so a raw import returns the compiled
// component rather than the source.
function searchIndex(): Plugin {
  const id = "virtual:search-index"
  const resolved = "\0" + id
  const dir = join(import.meta.dirname, "src", "content")
  return {
    name: "search-index",
    resolveId: (s) => (s === id ? resolved : null),
    async load(i) {
      if (i !== resolved) return
      const files = (await readdir(dir, { recursive: true })).filter((f) => f.endsWith(".mdx"))
      const entries = await Promise.all(
        files.map(async (f) => {
          const text = (await readFile(join(dir, f), "utf8"))
            .replace(/```[\s\S]*?```/g, " ")
            .replace(/<[^>]+>/g, " ")
            .replace(/[#*`|>[\]]/g, " ")
            .replace(/\s+/g, " ")
            .trim()
          return ["/" + f.replace(/\.mdx$/, "").replaceAll("\\", "/"), text]
        }),
      )
      return `export default ${JSON.stringify(Object.fromEntries(entries))}`
    },
  }
}

// When each page last changed, read from git at build time. CI must check out
// with fetch-depth: 0, as a shallow clone has no history to date a file by.
function pageDates(): Plugin {
  const id = "virtual:page-dates"
  const resolved = "\0" + id
  const dir = join(import.meta.dirname, "src", "content")
  return {
    name: "page-dates",
    resolveId: (s) => (s === id ? resolved : null),
    async load(i) {
      if (i !== resolved) return
      const files = (await readdir(dir, { recursive: true })).filter((f) => f.endsWith(".mdx"))
      const out: Record<string, string> = {}
      for (const f of files) {
        try {
          const iso = execFileSync("git", ["log", "-1", "--format=%cI", "--", join("src/content", f)], {
            cwd: join(import.meta.dirname), encoding: "utf8",
          }).trim()
          if (iso) out["/" + f.replace(/\.mdx$/, "")] = iso
        } catch { /* no git, or the file is not committed yet */ }
      }
      return `export default ${JSON.stringify(out)}`
    },
  }
}

// Cloudflare Pages serves the project at the root of its own subdomain, so there
// is no path prefix to carry. Moving back under a subdirectory requires changing
// this line alone.
const base = "/"

export default defineConfig({
  base,
  plugins: [
    // Before react(): the JSX mdx emits must still pass through the React
    // plugin's transform.
    { enforce: "pre", ...mdx({
      // Allows MDXProvider to supply <Note>, the code-block wrapper and the link
      // component, so no page needs to import them.
      providerImportSource: "@mdx-js/react",
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        // Highlighting runs here, at build time. The shipped page carries plain
        // spans with inline colours, so no highlighter reaches the browser and
        // code renders identically in the prerendered HTML.
        [rehypePrettyCode, { theme: { light: "github-light", dark: "github-dark" }, keepBackground: false }],
      ],
    }) },
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
    tailwindcss(),
    searchIndex(),
    pageDates(),
  ],
  resolve: { alias: { "@": import.meta.dirname + "/src" } },
  define: { __BASE__: JSON.stringify(base) },
  build: { chunkSizeWarningLimit: 900 },
})
