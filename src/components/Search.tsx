import { useEffect, useMemo, useRef, useState } from "react"
import { Search as SearchIcon } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { docs, sectionOf } from "@/nav"
import { loadIndex } from "@/content"
import { navigate } from "@/lib/router"
import { cn } from "@/lib/utils"

type Hit = { path: string; label: string; section: string; line: string }

/** Loaded on first open and then retained. Eighteen pages of prose is a few tens
 *  of KB, so the index is a plain object and matching is indexOf: no library, and
 *  nothing that can drift from the MDX. */
let body: Record<string, string> | null = null

/** Bolds the query within a snippet. Greyscale, so emphasis is weight and
 *  contrast rather than a highlight colour. */
function mark(line: string, q: string) {
  const needle = q.trim()
  if (!needle) return line
  const parts = line.split(new RegExp(`(${needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig"))
  return parts.map((part, i) =>
    part.toLowerCase() === needle.toLowerCase()
      ? <b key={i} className="font-medium text-foreground">{part}</b>
      : part,
  )
}

export function Search() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState("")
  const [ready, setReady] = useState(false)
  const [active, setActive] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setOpen((v) => !v) }
    }
    addEventListener("keydown", onKey)
    return () => removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => { if (open && !body) loadIndex().then((i) => { body = i; setReady(true) }) }, [open])

  const hits = useMemo<Hit[]>(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return []
    void ready
    return docs
      .map((d) => {
        const text = body?.[d.path] ?? ""
        const inTitle = (d.label + d.desc + (d.keywords ?? "")).toLowerCase().includes(needle)
        const at = text.toLowerCase().indexOf(needle)
        if (!inTitle && at < 0) return null
        const line = at < 0 ? d.desc : text.slice(Math.max(0, at - 30), at + 70).trim()
        return { path: d.path, label: d.label, section: sectionOf(d.path), line, inTitle }
      })
      .filter((h): h is Hit & { inTitle: boolean } => !!h)
      // A page whose title or keywords match is the likely intent; one that merely
      // mentions the word is a fallback.
      .sort((a, b) => Number(b.inTitle) - Number(a.inTitle))
      .slice(0, 8)
  }, [q, ready])

  // Reset the cursor whenever the result set changes beneath it.
  useEffect(() => setActive(0), [q])

  const open_ = (h: Hit) => { setOpen(false); setQ(""); navigate(h.path); scrollTo({ top: 0 }) }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-8 items-center gap-2 rounded-md border border-border bg-muted/40 px-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted sm:w-56"
      >
        <SearchIcon className="size-3.5" />
        <span className="hidden sm:inline">搜索文档</span>
        <kbd className="ml-auto hidden rounded border border-border bg-background px-1.5 font-mono text-[0.6875rem] sm:inline">
          ⌘K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setQ("") }}>
        <DialogContent
          showCloseButton={false}
          className="top-[12%] max-w-xl translate-y-0 gap-0 overflow-hidden p-0"
          onOpenAutoFocus={(e) => { e.preventDefault(); input.current?.focus() }}
        >
          <DialogTitle className="sr-only">搜索文档</DialogTitle>
          <div className="flex items-center gap-2 border-b border-border px-4">
            <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
            <input
              ref={input}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜索文档…"
              onKeyDown={(e) => {
                if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                  e.preventDefault()
                  if (!hits.length) return
                  const next = (active + (e.key === "ArrowDown" ? 1 : hits.length - 1)) % hits.length
                  setActive(next)
                  list.current?.children[next]?.scrollIntoView({ block: "nearest" })
                } else if (e.key === "Enter" && hits[active]) {
                  open_(hits[active])
                }
              }}
              className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div ref={list} className="max-h-80 overflow-y-auto p-2 thin-scroll">
            {hits.map((h, i) => (
              <button
                key={h.path}
                onClick={() => open_(h)}
                onMouseMove={() => setActive(i)}
                className={cn(
                  "block w-full rounded-md px-3 py-2 text-left transition-colors",
                  i === active && "bg-accent",
                )}
              >
                <span className="text-sm font-medium">{h.label}</span>
                <span className="ml-2 text-xs text-muted-foreground">{h.section}</span>
                <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                  {mark(h.line, q)}
                </span>
              </button>
            ))}
            <p className={cn("px-3 py-6 text-center text-sm text-muted-foreground", (hits.length || !q) && "hidden")}>
              没有匹配的内容
            </p>
            <p className={cn("px-3 py-6 text-center text-sm text-muted-foreground", q && "hidden")}>
              输入关键词，比如 nginx、流量、批量
            </p>
          </div>
          <div className="flex gap-4 border-t border-border px-4 py-2 text-[0.6875rem] text-muted-foreground">
            <span><kbd className="font-mono">↑↓</kbd> 选择</span>
            <span><kbd className="font-mono">↵</kbd> 打开</span>
            <span><kbd className="font-mono">esc</kbd> 关闭</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
