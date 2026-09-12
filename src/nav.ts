// The site map. Titles, sidebar order and the per-page description all live here
// so a page has exactly one name; the MDX files carry body text only. `desc` is
// not rendered on the page -- it feeds the meta description and the search list.
//
// One route prefix per sidebar group, so a path says which group it belongs to.
export type Item = { path: string; label: string; desc: string; keywords?: string }
export type Section = { title: string; items: Item[] }

export const nav: Section[] = [
  {
    title: "开始",
    items: [
      { path: "/guide/introduction", label: "这是什么", desc: "用 Rust 写的轻量级服务器探针，由 hub、agent 与主题三部分组成。", keywords: "简介 introduction 组成 hub agent 主题" },
      { path: "/guide/philosophy", label: "设计哲学", desc: "安全、极简、高效三条取舍的理由，以及明确不做的功能。", keywords: "philosophy 极简 安全 高效 不做" },
    ],
  },
  {
    title: "安装",
    items: [
      { path: "/install/quick-start", label: "快速开始", desc: "一键脚本或 Docker 装好 hub，配反向代理，进面板。", keywords: "quick start 安装 上手 5 分钟 docker" },
      { path: "/install/hub", label: "安装 hub", desc: "一键脚本的参数与目录结构，以及不走脚本时的命令行。", keywords: "install-hub.sh systemd 升级 卸载 端口 purge" },
      { path: "/install/docker", label: "Docker 部署", desc: "一条 docker run 或一份 compose。TZ 不设会静默算错日流量。", keywords: "docker compose ghcr dockerhub 镜像 容器 TZ 时区 volume" },
      { path: "/install/reverse-proxy", label: "反向代理", desc: "nginx、caddy、Cloudflare 隧道三份可直接抄的配置，外加四个需要注意的问题。", keywords: "nginx caddy cloudflare tunnel cloudflared 反代 TLS https 域名 websocket" },
      { path: "/install/agent", label: "接入节点", desc: "单台安装与批量注册，换发 token 与卸载。", keywords: "agent 节点 install.sh token register 批量 openrc systemd 卸载" },
    ],
  },
  {
    title: "配置",
    items: [
      { path: "/config/auth", label: "登录与安全", desc: "应急密码与 GitHub 单点登录的配置，以及登录不通时的排查路径。", keywords: "github oauth sso 登录 密码 应急 白名单 callback" },
      { path: "/config/traffic", label: "流量统计", desc: "三个流量数字的算法、周期与配额口径，以及和商家对不上的原因。", keywords: "流量 traffic 重置日 月流量 计费 sum max 上行 下行 配额" },
    ],
  },
  {
    title: "开发指南",
    items: [
      { path: "/dev/theme", label: "主题开发", desc: "主题包格式、可用的四个接口、必须处理的三种状态与本地开发。", keywords: "主题 theme theme.json dist 接口 nodes metrics 开发 上传 切换" },
      { path: "/dev/architecture", label: "架构与协议", desc: "仓库分工、线上协议、请求路径与八张数据表。", keywords: "架构 architecture 协议 json-rpc websocket 数据表 schema 路由" },
    ],
  },
  {
    title: "参考",
    items: [
      { path: "/reference/performance", label: "性能", desc: "体积、内存、CPU 与响应速度的实测数字，以及它们是怎么调出来的。", keywords: "性能 benchmark 内存 cpu 体积 延迟 压测" },
      { path: "/reference/faq", label: "常见问题", desc: "装不上、连不上、数字对不上，先查这里。", keywords: "faq 常见问题 排查 离线 掉线 打不开 502 白屏 搬家 迁移" },
    ],
  },
  {
    title: "工具",
    items: [
      { path: "/ai", label: "让 AI 帮你部署", desc: "一段可直接交给终端 AI 的提示词，含验证步骤与明确的禁止事项。", keywords: "ai llm claude chatgpt 提示词 prompt 自动部署" },
    ],
  },
]

export const docs: Item[] = nav.flatMap((s) => s.items)
export const sectionOf = (path: string) => nav.find((s) => s.items.some((i) => i.path === path))?.title ?? ""
