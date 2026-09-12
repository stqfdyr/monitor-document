import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { GithubMark } from "@/components/GithubMark"
import { Button } from "@/components/ui/button"
import { Search } from "@/components/Search"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Sidebar } from "@/components/Sidebar"
import { A } from "@/lib/router"
import { REPO } from "@/site"

export function Header({ path }: { path: string }) {
  const [menu, setMenu] = useState(false)
  // The drawer is a fixed overlay; leaving the body scrollable behind it would
  // scroll the page rather than the menu.
  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menu])

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[88rem] items-center gap-3 px-4 lg:px-8">
          <Button variant="ghost" size="icon-sm" className="lg:hidden" aria-label="目录" onClick={() => setMenu(true)}>
            <Menu />
          </Button>

          <A to="/" className="flex items-baseline gap-2">
            <span className="font-semibold tracking-tight">monitor</span>
            <span className="hidden text-xs text-muted-foreground sm:inline">文档</span>
          </A>

          <div className="ml-auto flex items-center gap-1.5">
            <Search />
            <Button variant="ghost" size="icon-sm" asChild aria-label="GitHub">
              <a href={REPO} target="_blank" rel="noreferrer"><GithubMark className="size-4" /></a>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {menu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenu(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-background shadow-xl">
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-border pr-2 pl-5">
              <span className="font-semibold tracking-tight">monitor</span>
              <Button variant="ghost" size="icon-sm" aria-label="关闭" onClick={() => setMenu(false)}>
                <X />
              </Button>
            </div>
            <div className="thin-scroll flex-1 overflow-y-auto px-2 py-5">
              <Sidebar path={path} onNavigate={() => setMenu(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
