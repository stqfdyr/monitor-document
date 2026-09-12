import { StrictMode } from "react"
import { createRoot, hydrateRoot } from "react-dom/client"
import { App } from "@/App"
import { toPath } from "@/lib/router"
import "@/index.css"

const root = document.getElementById("root")!
const path = toPath(location.pathname)
const app = <StrictMode><App url={path} /></StrictMode>

// Every route is prerendered, so hydration is the normal case. A path that was
// not prerendered -- an old link or a typo -- arrives at 404.html with empty
// markup.
if (root.firstChild) hydrateRoot(root, app)
else createRoot(root).render(app)
