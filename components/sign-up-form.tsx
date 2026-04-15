"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignUpForm() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== repeatPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      const user = data.user;

      if (!user) throw new Error("User not created");

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: firstName,
          last_name: lastName,
          birthday,
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      router.push("/auth/sign-up-success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-gray-900">

      <Card className="rounded-3xl border border-gray-100 bg-white/80 backdrop-blur-xl shadow-xl text-gray-900">

        {/* HEADER */}
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-gray-900">
            Créer un compte ✨
          </CardTitle>

          <CardDescription className="text-gray-600">
            Rejoignez CESIZen et commencez votre pratique
          </CardDescription>
        </CardHeader>

        {/* FORM */}
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-4">

              {/* NAME */}
              <div className="grid gap-2">
                <Label className="text-gray-700">Nom</Label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="h-11 rounded-xl text-gray-900 placeholder:text-gray-400"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label className="text-gray-700">Prénom</Label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="h-11 rounded-xl text-gray-900 placeholder:text-gray-400"
                  required
                />
              </div>

              {/* BIRTHDAY */}
              <div className="grid gap-2">
                <Label className="text-gray-700">Date de naissance</Label>
                <Input
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="h-11 rounded-xl text-gray-900"
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="grid gap-2">
                <Label className="text-gray-700">Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-xl text-gray-900 placeholder:text-gray-400"
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="grid gap-2">
                <Label className="text-gray-700">Mot de passe</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-xl text-gray-900"
                  required
                />
              </div>

              {/* CONFIRM */}
              <div className="grid gap-2">
                <Label className="text-gray-700">Confirmer</Label>
                <Input
                  type="password"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className="h-11 rounded-xl text-gray-900"
                  required
                />
              </div>

              {/* ERROR */}
              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-100 p-2 rounded-xl">
                  {error}
                </div>
              )}

              {/* BUTTON */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-black text-white hover:bg-gray-800 transition"
              >
                {isLoading ? "Création..." : "S'inscrire"}
              </Button>

              {/* LOGIN */}
              <p className="text-center text-sm text-gray-600">
                Déjà un compte ?{" "}
                <Link
                  href="/auth/login"
                  className="text-black font-medium hover:underline"
                >
                  Se connecter
                </Link>
              </p>

            </div>
          </form>
        </CardContent>

      </Card>
    </div>
  );
}