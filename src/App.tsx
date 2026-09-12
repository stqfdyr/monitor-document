import { useEffect } from "react"
import { ArrowLeft, ArrowRight, PencilLine } from "lucide-react"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { Toc, TocMobile } from "@/components/Toc"
import { mdxComponents } from "@/components/Mdx"
import { Home } from "@/Home"
import { docs, sectionOf } from "@/nav"
import { pages } from "@/content"
import { A, usePath } from "@/lib/router"
import { REPO_DOC } from "@/site"
import dates from "virtual:page-dates"
import { MDXProvider } from "@mdx-js/react"

export function App({ url }: { url: string }) {
  const path = usePath(url)
  const i = docs.findIndex((d) => d.path === path)
  const doc = docs[i]
  const Page = pages[path]

  useEffect(() => {
    document.title = doc ? `${doc.label} — monitor 文档` : "monitor — 服务器探针文档"
  }, [doc])

  return (
    <MDXProvider components={mdxComponents}>
      <div className="flex min-h-dvh flex-col">
        <Header path={path} />

        {path === "/" || !Page ? (
          <Home found={path === "/"} />
        ) : (
          <div className="mx-auto flex w-full max-w-[88rem] flex-1 gap-10 px-4 lg:px-8">
            <aside className="thin-scroll sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-52 shrink-0 overflow-y-auto py-10 lg:block">
              <Sidebar path={path} />
            </aside>

            <main className="w-full min-w-0 max-w-3xl py-10 lg:py-14">
              <p className="mb-2.5 text-[0.8125rem] text-muted-foreground">{sectionOf(path)}</p>
              <h1 className="text-[2rem] leading-[1.25] font-semibold tracking-tight">{doc.label}</h1>
              <TocMobile path={path} />
              <div className="prose mt-10"><Page /></div>

              <div className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5 text-[0.8125rem] text-muted-foreground">
                <a
                  href={`${REPO_DOC}/edit/main/src/content${path}.mdx`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                >
                  <PencilLine className="size-3.5" />
                  在 GitHub 上修改这一页
                </a>
                {dates[path] && (
                  <span>最后更新 {dates[path].slice(0, 10)}</span>
                )}
              </div>

              <nav className="mt-10 grid gap-3 sm:grid-cols-2">
                {docs[i - 1] ? (
                  <A to={docs[i - 1].path} className="group rounded-lg border border-border p-4 transition-colors hover:bg-accent/50">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><ArrowLeft className="size-3" />上一页</span>
                    <span className="mt-1 block text-sm font-medium">{docs[i - 1].label}</span>
                  </A>
                ) : <span />}
                {docs[i + 1] && (
                  <A to={docs[i + 1].path} className="group rounded-lg border border-border p-4 text-right transition-colors hover:bg-accent/50 sm:col-start-2">
                    <span className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">下一页<ArrowRight className="size-3" /></span>
                    <span className="mt-1 block text-sm font-medium">{docs[i + 1].label}</span>
                  </A>
                )}
              </nav>
            </main>

            <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-52 shrink-0 overflow-y-auto py-14 xl:block">
              <Toc path={path} />
            </aside>
          </div>
        )}

        <footer className="border-t border-border">
          <div className="mx-auto flex max-w-[88rem] flex-col gap-2 px-4 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
            <p>MIT 许可 · 安全、极简、高效</p>
            <a href={REPO_DOC} target="_blank" rel="noreferrer" className="hover:text-foreground">
              这份文档的源码
            </a>
          </div>
        </footer>
      </div>
    </MDXProvider>
  )
}
