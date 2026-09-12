import { useEffect, useState } from "react"
import { ChevronRight } from "lucide-react"
import { useHeadings } from "@/lib/headings"
import { cn } from "@/lib/utils"

export function Toc({ path }: { path: string }) {
  const heads = useHeadings(path)
  const [active, setActive] = useState("")

  useEffect(() => {
    setActive("")
    const nodes = [...document.querySelectorAll<HTMLElement>(".prose h2, .prose h3")].filter((h) => h.id)
    if (!nodes.length) return
    // rootMargin pins the active line to the heading nearest the top of the
    // viewport; without it every heading on a short page counts as visible.
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-80px 0px -70% 0px" },
    )
    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [path])

  if (heads.length < 2) return null
  return (
    <nav className="text-[0.8125rem]">
      <p className="mb-3 font-medium text-foreground">本页内容</p>
      <ul className="space-y-2 border-l border-border">
        {heads.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={cn(
                "-ml-px block border-l py-0.5 leading-snug transition-colors",
                h.level === 3 ? "pl-6" : "pl-4",
                active === h.id
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/** The same list for narrow screens, where the aside is absent. <details> so the
 *  collapse costs no JavaScript and works before hydration. */
export function TocMobile({ path }: { path: string }) {
  const heads = useHeadings(path)
  if (heads.length < 2) return null
  return (
    <details className="group mt-8 rounded-lg border border-border xl:hidden">
      <summary className="flex cursor-pointer items-center gap-2 px-4 py-2.5 text-sm font-medium marker:content-none">
        <ChevronRight className="size-4 text-muted-foreground transition-transform group-open:rotate-90" />
        本页内容
      </summary>
      <ul className="border-t border-border px-4 py-3 text-sm">
        {heads.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={cn("block py-1.5 text-muted-foreground", h.level === 3 && "pl-4")}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </details>
  )
}
