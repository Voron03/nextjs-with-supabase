import { createClient } from "@supabase/supabase-js";
import { isAdmin } from "@/lib/isAdmin";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return Response.json({ error: "No token" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    const supabaseUser = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: userData, error: userError } =
      await supabaseUser.auth.getUser(token);

    if (userError || !userData?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminId = userData.user.id;

    const admin = await isAdmin(adminId);

    if (!admin) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    // 👇 1. auth users
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.listUsers();

    if (authError) {
      return Response.json(
        { error: authError.message },
        { status: 500 }
      );
    }

    // 👇 2. profiles
    const { data: profiles, error: profileError } =
      await supabaseAdmin
        .from("profiles")
        .select("id, role, is_active");

    if (profileError) {
      return Response.json(
        { error: profileError.message },
        { status: 500 }
      );
    }

    // 👇 3. merge данных
    const users = authData.users.map((u) => {
      const profile = profiles?.find((p) => p.id === u.id);

      return {
        id: u.id,
        email: u.email,
        created_at: u.created_at,

        // 👇 from profiles
        role: profile?.role ?? "user",
        is_active: profile?.is_active ?? true,
      };
    });

    return Response.json({ users });
  } catch (err: any) {
    console.error("ADMIN USERS ERROR:", err);

    return Response.json(
      { error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}
