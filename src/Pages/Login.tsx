import { useState, type ChangeEvent, type JSX, type SubmitEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"

// Types

type AuthTab = "login" | "signup";

interface FormState {
  email: string;
  password: string;
  confirmPassword: string;
  dob: string;
  acceptedTerms: boolean;
}

interface PasswordChecks {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

// ⚠️ Remplace avec tes vraies variables d'env
const supabase: SupabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY as string
);

export default function AuthPage(): JSX.Element {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AuthTab>("login");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    acceptedTerms: false,
  });

  const [passwordChecks, setPasswordChecks] = useState<PasswordChecks>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "password") {
      validatePassword(value);
    }
  };

  const validatePassword = (password: string): void => {
    setPasswordChecks({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    });
  };

  const isPasswordValid: boolean = Object.values(passwordChecks).every(Boolean);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (activeTab === "signup") {
        if (!isPasswordValid) throw new Error("Mot de passe invalide");
        if (form.password !== form.confirmPassword)
          throw new Error("Les mots de passe ne correspondent pas");
        if (!form.acceptedTerms)
          throw new Error("Veuillez accepter les CGV");

        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: {
              dob: form.dob,
            },
          },
        });

        if (error) throw error;
        toast.success("Compte créé ! Vérifie tes emails ✉️")
        navigate('/welcome')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });

        if (error) throw error;
        toast.success("Connexion réussie 🚀")
        navigate('/welcome')
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inconnue est survenue");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      
      <Card className="w-full max-w-md rounded-2xl shadow-xl">
        <CardContent className="p-6">
          <div className="flex mb-6">
            <button
              type="button"
              className={`flex-1 py-2 font-semibold ${activeTab === "login" ? "border-b-2 border-black" : "text-gray-400"}`}
              onClick={() => setActiveTab("login")}
            >
              Connexion
            </button>
            <button
              type="button"
              className={`flex-1 py-2 font-semibold ${activeTab === "signup" ? "border-b-2 border-black" : "text-gray-400"}`}
              onClick={() => setActiveTab("signup")}
            >
              Inscription
            </button>
          </div>

          <motion.form
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {activeTab === "signup" && (
              <div>
                <Label>Date de naissance</Label>
                <Input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div>
              <Label>Mot de passe</Label>
              <Input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            {activeTab === "signup" && (
              <>
                <div>
                  <Label>Confirmer le mot de passe</Label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="text-sm space-y-1">
                  <p className={passwordChecks.length ? "text-green-600" : "text-red-500"}>• 8 caractères minimum</p>
                  <p className={passwordChecks.uppercase ? "text-green-600" : "text-red-500"}>• Une majuscule</p>
                  <p className={passwordChecks.lowercase ? "text-green-600" : "text-red-500"}>• Une minuscule</p>
                  <p className={passwordChecks.number ? "text-green-600" : "text-red-500"}>• Un chiffre</p>
                  <p className={passwordChecks.special ? "text-green-600" : "text-red-500"}>• Un caractère spécial</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={form.acceptedTerms}
                    onCheckedChange={(checked: boolean) =>
                      setForm((prev) => ({ ...prev, acceptedTerms: checked }))
                    }
                  />
                  <Label htmlFor="terms">J'accepte les CGV</Label>
                </div>
              </>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={
                loading ||
                (activeTab === "signup" && (!isPasswordValid || !form.acceptedTerms))
              }
            >
              {loading
                ? "Chargement..."
                : activeTab === "login"
                ? "Se connecter"
                : "S'inscrire"}
            </Button>
          </motion.form>
        </CardContent>
      </Card>
    </div>
  );
}
