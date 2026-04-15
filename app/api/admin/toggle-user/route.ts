import { createClient } from "@supabase/supabase-js";
import { isAdmin } from "@/lib/isAdmin";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const supabaseUser = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return Response.json({ error: "No token" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    const { data: userData } = await supabaseUser.auth.getUser(token);

    const adminId = userData.user?.id;

    if (!adminId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await isAdmin(adminId);

    if (!admin) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { userId, isActive } = await req.json();

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ is_active: isActive })
      .eq("id", userId);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
