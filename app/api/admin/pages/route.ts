import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdmin } from "@/lib/isAdmin";

// ================= HELPERS =================
function getToken(req: Request) {
  return req.headers.get("authorization")?.replace("Bearer ", "");
}

async function getUser(req: Request) {
  const token = getToken(req);

  if (!token) return null;

  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data?.user) return null;

  return data.user;
}

// ================= GET PAGES =================
export async function GET(req: Request) {
  const user = await getUser(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = await isAdmin(user.id);

  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin
    .from("pages")
    .select("*");

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ pages: data });
}

// ================= CREATE PAGE =================
export async function POST(req: Request) {
  const user = await getUser(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = await isAdmin(user.id);

  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  if (!body?.title || !body?.menu_id) {
    return NextResponse.json(
      { error: "title and menu_id required" },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin.from("pages").insert({
    title: body.title,
    menu_id: body.menu_id,
    data: body.data || {},
  });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}

// ================= DELETE PAGE =================
export async function DELETE(req: Request) {
  const user = await getUser(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = await isAdmin(user.id);

  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  if (!body?.id) {
    return NextResponse.json(
      { error: "id required" },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from("pages")
    .delete()
    .eq("id_page", body.id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}
