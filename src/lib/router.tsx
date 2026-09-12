import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

// GitHub Pages serves the site from a subdirectory, so every href carries the
// prefix while the routes matched against do not. Both conversions live here and
// nowhere else.
export const BASE = __BASE__
export const href = (p: string) => (p === "/" ? BASE : BASE + p.replace(/^\//, ""))
export const toPath = (loc: string) => {
  const p = loc.startsWith(BASE) ? "/" + loc.slice(BASE.length) : loc
  return p.replace(/\/+$/, "") || "/"
}

export function navigate(path: string) {
  history.pushState(null, "", href(path))
  dispatchEvent(new PopStateEvent("popstate"))
}

/** Current route. `initial` is what the server rendered, so hydration matches. */
export function usePath(initial: string) {
  const [path, setPath] = useState(initial)
  useEffect(() => {
    const sync = () => setPath(toPath(location.pathname))
    sync()
    addEventListener("popstate", sync)
    return () => removeEventListener("popstate", sync)
  }, [])
  return path
}

/** An <a> that stays on the page. External and modified clicks fall through. */
export function A({ to, className, children, ...rest }: { to: string } & React.ComponentProps<"a">) {
  // A .txt is a real file beside the pages rather than a route: it keeps the base
  // prefix but leaves the SPA.
  const away = /^(https?:)?\/\//.test(to) || to.endsWith(".txt")
  return (
    <a
      href={/^(https?:)?\/\//.test(to) ? to : href(to)}
      className={cn(className)}
      {...(away ? { target: "_blank", rel: "noreferrer" } : {})}
      onClick={(e) => {
        if (away || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        navigate(to)
        scrollTo({ top: 0 })
      }}
      {...rest}
    >
      {children}
    </a>
  )
}
