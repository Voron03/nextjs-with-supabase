"use client";

import { cn } from "@/lib/utils";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push("/protected/profile");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 text-gray-900", className)} {...props}>

      <Card className="rounded-3xl border border-gray-100 bg-white/80 backdrop-blur-xl shadow-xl text-gray-900">

        {/* HEADER */}
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-gray-900">
            Bon retour 👋
          </CardTitle>

          <CardDescription className="text-gray-600">
            Connectez-vous à votre espace CESIZen
          </CardDescription>
        </CardHeader>

        {/* FORM */}
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-5">

              {/* EMAIL */}
              <div className="grid gap-2">
                <Label className="text-gray-700">Email</Label>
                <Input
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 rounded-xl text-gray-900 placeholder:text-gray-400"
                />
              </div>

              {/* PASSWORD */}
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-700">Mot de passe</Label>

                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-gray-500 hover:text-gray-700 underline"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>

                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 rounded-xl text-gray-900"
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
                className="w-full h-11 rounded-xl bg-black text-white hover:bg-gray-800 transition transform hover:scale-[1.02] active:scale-95"
              >
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>

              {/* SIGNUP */}
              <p className="text-center text-sm text-gray-600">
                Pas de compte ?{" "}
                <Link
                  href="/auth/sign-up"
                  className="text-black font-medium hover:underline"
                >
                  S'inscrire
                </Link>
              </p>

            </div>
          </form>
        </CardContent>

      </Card>
    </div>
  );
}