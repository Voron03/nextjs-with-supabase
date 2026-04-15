import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function isAdmin(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (error) return false;

  return data?.role === "admin";
}
