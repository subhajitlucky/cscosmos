import { NextRequest, NextResponse } from "next/server";
import { getPool, isDatabaseConfigured } from "@/lib/db";
import { getSessionUser } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "Accounts are not configured." }, { status: 503 });
  }

  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in first." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const optIn = (body as { optIn?: unknown }).optIn;
  if (typeof optIn !== "boolean") {
    return NextResponse.json({ ok: false, error: "Invalid setting." }, { status: 400 });
  }

  await getPool().query("UPDATE cscosmos_users SET leaderboard_opt_in = $1 WHERE id = $2", [
    optIn,
    user.id,
  ]);

  return NextResponse.json({ ok: true, optIn });
}
