import { useRef, useState } from "react"
import { Check, Copy, Hash, Info, TriangleAlert } from "lucide-react"
import { A } from "@/lib/router"
import { cn } from "@/lib/utils"

/** Fenced blocks receive a language badge and a copy button. The button reads the
 *  rendered text, so the clipboard receives exactly what the reader sees, with no
 *  second copy of the snippet to drift. */
function Pre({ children, ...props }: React.ComponentProps<"pre">) {
  const ref = useRef<HTMLPreElement>(null)
  const [done, setDone] = useState(false)
  // "text" is what a fence with no language becomes; labelling it adds nothing.
  const lang = props["data-language" as keyof typeof props] as string | undefined
  return (
    <div className="group relative">
      <pre ref={ref} {...props}>{children}</pre>
      {lang && lang !== "text" && (
        <span className="pointer-events-none absolute top-2.5 right-3 font-mono text-[0.6875rem] text-muted-foreground/70 transition-opacity group-hover:opacity-0">
          {lang}
        </span>
      )}
      <button
        aria-label="复制"
        onClick={() => {
          navigator.clipboard?.writeText(ref.current?.innerText ?? "").then(() => {
            setDone(true)
            setTimeout(() => setDone(false), 1600)
          })
        }}
        className="absolute top-2 right-2 rounded-md border border-border bg-background/90 p-1.5 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:text-foreground focus-visible:opacity-100"
      >
        {done ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </button>
    </div>
  )
}

export function Note({ children, warn = false }: { children: React.ReactNode; warn?: boolean }) {
  const Icon = warn ? TriangleAlert : Info
  return (
    <div className={cn("flex gap-3 rounded-lg border border-border p-4", warn ? "bg-muted/60" : "bg-muted/30")}>
      <Icon className="mt-[3px] size-4 shrink-0 text-muted-foreground" />
      <div className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&>p]:my-2 text-[0.875rem] leading-[1.7]">
        {children}
      </div>
    </div>
  )
}


/** A linkable heading. rehype-slug has already assigned the id; this adds the
 *  handle that lets a reader copy a link to this section. The mark sits in the
 *  gutter, so it never reflows the title. */
function heading(Tag: "h2" | "h3") {
  return function H({ id, children, ...rest }: React.ComponentProps<"h2">) {
    return (
      <Tag id={id} data-title={typeof children === "string" ? children : undefined} className="group/h" {...rest}>
        {children}
        <a
          href={`#${id}`}
          aria-label="链接到本节"
          className="absolute -left-7 hidden translate-y-[0.2em] p-1 text-muted-foreground/60 opacity-0 transition-opacity group-hover/h:opacity-100 hover:text-foreground focus-visible:opacity-100 lg:inline-block"
        >
          <Hash className="size-4" />
        </a>
      </Tag>
    )
  }
}

export const mdxComponents = {
  pre: Pre,
  h2: heading("h2"),
  h3: heading("h3"),
  // Tables are the one block that cannot reflow, so they scroll independently
  // rather than widening the page.
  table: (p: React.ComponentProps<"table">) => (
    <div className="table-scroll"><table {...p} /></div>
  ),
  a: ({ href = "", ...p }: React.ComponentProps<"a">) =>
    href.startsWith("/") ? <A to={href} {...p} /> : <a href={href} target="_blank" rel="noreferrer" {...p} />,
  Note,
}
