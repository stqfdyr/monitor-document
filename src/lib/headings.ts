import { useEffect, useState } from "react"

export type Heading = { id: string; text: string; level: number }

/** Reads the headings from the rendered page rather than the MDX source: the list
 *  must match what actually appears on screen. */
export function useHeadings(path: string) {
  const [heads, setHeads] = useState<Heading[]>([])
  useEffect(() => {
    setHeads(
      [...document.querySelectorAll<HTMLElement>(".prose h2, .prose h3")]
        .filter((h) => h.id)
        .map((h) => ({
          id: h.id,
          // The heading carries an anchor link; its "#" is not part of the title.
          text: h.dataset.title ?? h.textContent ?? "",
          level: h.tagName === "H2" ? 2 : 3,
        })),
    )
  }, [path])
  return heads
}
