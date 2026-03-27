import { useEffect, useState, type JSX } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import data from "../app/dashboard/data.json"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { useNavigate } from "react-router-dom"

interface UserProfile {
  first_name: string;
  last_name: string;
  civility: string;
  date_of_birth: Date
}

export default function Dashboard(): JSX.Element {
  const navigate = useNavigate()
  const supabase: SupabaseClient = createClient(
    import.meta.env.VITE_SUPABASE_URL as string,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY as string
  )

  const [userProfile, setUserProfile] = useState<UserProfile>()

  const checkOnboardingCompletion = async () => {
    await supabase.auth.getUser().then(async (authUser) => {
      await supabase
        .from("profile")
        .select()
        .eq("user_id", authUser.data.user?.id)
        .then((res) => {
          if (res.error) {
            throw new Error(
              `error code ${res.error.code} : ${res.error.message}`
            )
          }
          if (res.data) {
            if (res.data && !res.data[0].has_done_onboarding) {
              return navigate("/welcome")
            }
            setUserProfile(res.data[0])
          }
          
        })
    })
  }

  useEffect(() => {
    checkOnboardingCompletion()    
  }, [])

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      {userProfile && 
        <AppSidebar userProfile={userProfile} variant="inset" />
      }
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
