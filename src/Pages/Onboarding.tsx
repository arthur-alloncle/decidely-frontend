import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, type ChangeEvent, type JSX } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { FieldDescription } from "@/components/ui/field"
import { useNavigate } from "react-router-dom"

import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"

export default function Onboarding(): JSX.Element {
  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2>(1)

  const [data, setData] = useState({
    civility: "none",
    firstName: "",
    lastName: "",
    tone: "neutral",
  })

  const supabase: SupabaseClient = createClient(
    import.meta.env.VITE_SUPABASE_URL as string,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY as string
  )

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    await supabase
      .from("profile")
      .upsert({
        user_id: user?.id,
        civility: data.civility,
        first_name: data.firstName,
        last_name: data.lastName,
        date_of_birth: user?.user_metadata.dob,
        tone: data.tone,
        has_done_onboarding: true,
      })
      .then((res) => {
        if (res.error) {
          throw new Error(`error code ${res.error.code} : ${res.error.message}`)
        }
        navigate("/dashboard")
      })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md rounded-2xl shadow-xl">
        <CardContent className="space-y-6 p-6">
          {step === 1 && (
            <>
              <h2 className="text-xl font-semibold">Ton profil</h2>

              <div className="space-y-2">
                <Label>Civilité</Label>
                <RadioGroup
                  value={data.civility}
                  onValueChange={(value: string) =>
                    setData((prev) => ({ ...prev, civility: value }))
                  }
                >
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mr" id="mr" />
                      <Label htmlFor="mr">Monsieur</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mrs" id="mrs" />
                      <Label htmlFor="mrs">Madame</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="none" id="none" />
                      <Label htmlFor="none">Non précisé</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Prénom</Label>
                <Input
                  name="firstName"
                  value={data.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>Nom</Label>
                <Input
                  name="lastName"
                  value={data.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button
                className="w-full"
                onClick={() => setStep(2)}
                disabled={!data.firstName || !data.lastName}
              >
                Suivant
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-semibold">Personnalisation</h2>

              <RadioGroup
                value={data.tone}
                onValueChange={(value: string) =>
                  setData((prev) => ({ ...prev, tone: value }))
                }
                className="space-y-3"
              >
                <FieldLabel htmlFor="feminine">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>Féminin</FieldTitle>
                      <FieldDescription>Tu es bien alignée</FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value="feminine" id="feminine" />
                  </Field>
                </FieldLabel>

                <FieldLabel htmlFor="masculine">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>Masculin</FieldTitle>
                      <FieldDescription>Tu es bien aligné</FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value="masculine" id="masculine" />
                  </Field>
                </FieldLabel>

                <FieldLabel htmlFor="neutral">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>Neutre</FieldTitle>
                      <FieldDescription>
                        Tu as un bon alignement
                      </FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value="neutral" id="neutral" />
                  </Field>
                </FieldLabel>
              </RadioGroup>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  //   className="w-full"
                  onClick={() => setStep(1)}
                >
                  Précédent
                </Button>
                <Button className="grow" onClick={handleSubmit}>
                  Enregistrer
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
