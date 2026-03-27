import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"
import { TooltipProvider } from "./components/ui/tooltip"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <TooltipProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </TooltipProvider>
    </BrowserRouter>
  </StrictMode>
)
