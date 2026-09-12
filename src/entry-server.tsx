import { renderToString } from "react-dom/server"
import { App } from "@/App"
import { docs } from "@/nav"

export function render(url: string) {
  return renderToString(<App url={url} />)
}

/** Every URL the build has to emit a file for. */
export const routes = [
  {
    path: "/",
    title: "monitor — 服务器探针文档",
    desc: "用 Rust 写的服务器探针：hub 单二进制 6.0 MiB，agent 1.7 MiB，默认只监听回环。安全、极简、高效。",
  },
  ...docs.map((d) => ({ path: d.path, title: `${d.label} — monitor 文档`, desc: d.desc })),
]
