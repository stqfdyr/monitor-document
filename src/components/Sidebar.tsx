import { nav } from "@/nav"
import { A } from "@/lib/router"
import { cn } from "@/lib/utils"

export function Sidebar({ path, onNavigate }: { path: string; onNavigate?: () => void }) {
  return (
    <nav className="space-y-7 text-sm">
      {nav.map((section) => (
        <div key={section.title}>
          <p className="mb-2.5 px-3 text-xs font-medium tracking-wide text-muted-foreground">
            {section.title}
          </p>
          <ul className="space-y-0.5">
            {section.items.map((item) => (
              <li key={item.path}>
                <A
                  to={item.path}
                  onClick={onNavigate}
                  className={cn(
                    "block rounded-md px-3 py-1.5 transition-colors",
                    item.path === path
                      ? "bg-accent font-medium text-foreground"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                  )}
                >
                  {item.label}
                </A>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}
