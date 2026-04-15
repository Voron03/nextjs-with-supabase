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

    const userId = userData.user.id;

    const admin = await isAdmin(userId);

    if (!admin) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return Response.json({ users: data?.users ?? [] });
  } catch (err: any) {
    console.error("ADMIN USERS ERROR:", err);

    return Response.json(
      { error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}
