import { ArrowRight, X } from "lucide-react"
import { GithubMark } from "@/components/GithubMark"
import { Button } from "@/components/ui/button"
import { A } from "@/lib/router"
import { REPO } from "@/site"
// The same fence the docs use, so the hero command passes through the same
// build-time highlighter and carries the same copy button.
import HeroInstall from "@/hero-install.mdx"

const SIZES = [
  { who: "Hub", bin: "6.0 MiB", rss: "6.1 MiB" },
  { who: "Agent", bin: "1.7 MiB", rss: "3.8 MiB" },
]

const SECURITY = [
  {
    t: "agent 不监听任何端口",
    d: "连接由 agent 主动向 hub 发起，被监控的机器不必开端口，也不必改防火墙。",
  },
  {
    t: "agent 不写文件，也不存状态",
    d: "只读 /proc 和 statvfs，没有配置文件、数据库或缓存。累加、判重启这些有状态的事都在 hub 侧，卸载就是删掉一个二进制和一份服务定义。",
  },
  {
    t: "两个服务都降权运行",
    d: "systemd 单元带 DynamicUser、NoNewPrivileges、ProtectSystem=strict、ProtectHome、PrivateTmp、PrivateDevices，并限死地址族与内存上限。hub 以专用用户运行，只写得了 data/ 一个目录，连自己的二进制都改不了。",
  },
  {
    t: "默认只监听回环",
    d: "一键脚本写死 --listen 127.0.0.1，面板要经过反向代理才在公网上。agent 与安装脚本拒绝明文连远程 hub。",
  },
]

const FEATURES = [
  {
    t: "Rust，没有 GC，也没有语言运行时",
    d: "单个静态二进制，不依赖解释器、虚拟机或运行时库。内存不随负载起伏：空转 6.1 MiB，200 个节点同时在线 8.4 MiB，占一颗核的 2.5%。",
  },
  {
    t: "功能已经收束到极致",
    d: "代码质量高到离谱。没写的代码不占体积，不占内存，也不会有漏洞。",
  },
]

const DOING = ["服务器基础信息", "网络延迟", "流量统计"]

const NOT_DOING = [
  "web terminal",
  "远程 SSH",
  "通知与告警",
  "插件系统",
  "ICMP / HTTP 探测",
  "agent 自动更新",
  "Windows / macOS 兼容",
  "VPS 指标汇总",
]

export function Home({ found = true }: { found?: boolean }) {
  return (
    <main className="flex-1">
      {!found && (
        <div className="border-b border-border bg-muted/40">
          <p className="mx-auto max-w-[88rem] px-4 py-3 text-sm text-muted-foreground lg:px-8">
            这个地址上没有页面。下面是首页。
          </p>
        </div>
      )}

      {/* hero */}
      <section className="mx-auto max-w-[88rem] px-4 pt-20 pb-16 text-center lg:px-8 lg:pt-32 lg:pb-24">
        <h1 className="mx-auto max-w-3xl text-4xl leading-[1.15] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          安全、极简、高效。
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-[1.0625rem] leading-[1.7] text-muted-foreground">
          用 Rust 写的轻量级服务器探针。
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <A to="/install/quick-start">快速开始<ArrowRight /></A>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={REPO} target="_blank" rel="noreferrer"><GithubMark className="size-4" />源码</a>
          </Button>
        </div>

        <div className="mx-auto mt-16 max-w-3xl lg:mt-20">
          <h2 className="text-xl font-semibold tracking-tight">五分钟装好</h2>
          {/* The install URL is longer than the block is wide; wrapping beats a
              hero command that ends in a cut-off. Copy still yields the real lines. */}
          <div className="prose mt-6 text-left [&_pre]:[overflow-wrap:anywhere] [&_pre]:whitespace-pre-wrap">
            <HeroInstall />
          </div>
        </div>
      </section>

      {/* sizes */}
      <section className="border-y border-border bg-muted/20">
        <div className="mx-auto max-w-[88rem] px-4 py-12 lg:px-8 lg:py-16">
          {/* Three equal columns rather than shrink-to-fit: the band is the full
              content width, and a table sized to its text would float in the middle
              of it. */}
          {/* Equal thirds, and the three cells read left / centre / right: the row
              then spans the band with even gaps. Right-aligning both numbers instead
              leaves the first one past the centre line. */}
          <table className="tnum w-full table-fixed border-collapse">
            <thead>
              <tr className="text-sm font-normal text-muted-foreground">
                <th className="pb-3 font-normal" />
                <th className="pb-3 text-center font-normal">可执行文件</th>
                <th className="pb-3 text-right font-normal">空转内存</th>
              </tr>
            </thead>
            <tbody>
              {SIZES.map((s) => (
                <tr key={s.who} className="border-t border-border">
                  <th className="py-5 text-left align-baseline text-base font-medium">{s.who}</th>
                  <td className="py-5 text-center text-3xl font-semibold tracking-tight lg:text-4xl">{s.bin}</td>
                  <td className="py-5 text-right text-3xl font-semibold tracking-tight lg:text-4xl">{s.rss}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* security */}
      <section className="mx-auto max-w-[88rem] px-4 py-20 lg:px-8 lg:py-28">
        <h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          安全放在第一位。
        </h2>
        <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {SECURITY.map((f) => (
            <div key={f.t} className="border-t border-border pt-5">
              <h3 className="text-base font-semibold tracking-tight">{f.t}</h3>
              <p className="mt-2 text-[0.9375rem] leading-[1.7] text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* scope */}
      <section className="border-t border-border bg-muted/20">
        <div className="mx-auto grid max-w-[88rem] gap-10 px-4 py-20 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:py-28">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">我们只有</h2>
            <ul className="mt-8 grid gap-px overflow-hidden rounded-lg border border-border bg-border">
              {DOING.map((n) => (
                <li key={n} className="bg-background px-4 py-3.5 text-[0.9375rem]">{n}</li>
              ))}
            </ul>
            <p className="mt-8 text-2xl font-semibold tracking-tight sm:text-3xl">就是这么极简。</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">这些我们不做</h2>
            <ul className="mt-8 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
              {NOT_DOING.map((n) => (
                <li
                  key={n}
                  className="flex items-center gap-2 bg-background px-4 py-3.5 text-[0.9375rem] text-muted-foreground"
                >
                  {n}
                  {/* A stroked icon rather than the ❌ glyph: it inherits the text
                      colour, so the mark stays black on light and white on dark. */}
                  <X className="size-3.5 shrink-0 stroke-[2.5] text-foreground" aria-label="不做" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* why it is small */}
      <section className="mx-auto max-w-[88rem] px-4 py-20 lg:px-8 lg:py-28">
        <h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          它为什么这么小、这么省。
        </h2>
        <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.t} className="border-t border-border pt-5">
              <h3 className="text-base font-semibold tracking-tight">{f.t}</h3>
              <p className="mt-2 text-[0.9375rem] leading-[1.7] text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
