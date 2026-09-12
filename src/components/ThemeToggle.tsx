import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  // Starts undefined so the server and the first client render agree; the actual
  // value comes from the class the inline script in index.html set before
  // paint.
  const [dark, setDark] = useState<boolean | null>(null)
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), [])

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="切换主题"
      onClick={() => {
        const next = !document.documentElement.classList.contains("dark")
        document.documentElement.classList.toggle("dark", next)
        try { localStorage.setItem("theme", next ? "dark" : "light") } catch { /* private mode */ }
        setDark(next)
      }}
    >
      {dark ? <Moon /> : <Sun />}
    </Button>
  )
}
