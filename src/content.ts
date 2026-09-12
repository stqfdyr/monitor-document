import type { ComponentType } from "react"

// One eager glob constitutes the whole page table: eighteen short pages weigh
// less than a screenshot, and eager loading means navigation never waits.
const mods = import.meta.glob("./content/**/*.mdx", { eager: true }) as Record<
  string,
  { default: ComponentType }
>

export const pages: Record<string, ComponentType> = Object.fromEntries(
  Object.entries(mods).map(([file, m]) => [file.replace(/^\.\/content|\.mdx$/g, ""), m.default]),
)

/** Plain-text bodies keyed by route, built by the searchIndex() plugin. Imported
 *  dynamically, so it costs nothing until search is opened. */
export const loadIndex = () =>
  import("virtual:search-index").then((m) => m.default as Record<string, string>)
