import { createClient } from "@supabase/supabase-js";
import { isAdmin } from "@/lib/isAdmin";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return Response.json({ error: "No token" }, { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");

  const supabaseUser = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: userData } = await supabaseUser.auth.getUser(token);

  const userId = userData.user?.id;

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = await isAdmin(userId);

  if (!admin) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  const { error } = await supabaseAdmin.auth.admin.deleteUser(body.userId);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
