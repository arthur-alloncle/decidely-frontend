import { Route, Routes } from "react-router-dom"
import AuthPage from "./Pages/Login"
// import Onboarding from "./Pages/Onboarding2"
import { Toaster } from "@/components/ui/sonner"
import Dashboard from "./Pages/Dashboard"
import Index from "./Pages/Index"
import SignupPage from "./Pages/Signup"
import LoginPage from "./Pages/Login2"
import Onboarding from "./Pages/Onboarding2"

export function App() {
  return (
    <>
      <Routes>
        <Route element={<Index />} path="/" />
        <Route element={<AuthPage />} path="/auth" />
        <Route element={<LoginPage />} path="/login" />
        <Route element={<SignupPage />} path="signup" />
        <Route element={<Onboarding />} path="/welcome" />
        <Route element={<Dashboard />} path="/dashboard" />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
