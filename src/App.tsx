import { Route, Routes } from "react-router-dom"
import AuthPage from "./Pages/Login"
import Onboarding from "./Pages/Onboarding"
import { Toaster } from "@/components/ui/sonner"
import Dashboard from "./Pages/Dashboard"
import Index from "./Pages/Index"

export function App() {
  return (
    <>
      <Routes>
        <Route element={<Index />} path="/" />
        <Route element={<AuthPage />} path="/auth" />
        <Route element={<Onboarding />} path="/welcome" />
        <Route element={<Dashboard />} path="/dashboard" />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
