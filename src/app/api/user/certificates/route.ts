import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getPool, isDatabaseConfigured } from "@/lib/db";
import { getSessionUser } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "Accounts are not configured." }, { status: 503 });
  }

  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in first." }, { status: 401 });
  }

  const result = await getPool().query<{
    id: string;
    title: string;
    completed_count: number;
    issued_at: string;
  }>(
    `SELECT id, title, completed_count, issued_at
     FROM cscosmos_certificates
     WHERE user_id = $1
     ORDER BY issued_at DESC`,
    [user.id]
  );

  return NextResponse.json(
    { ok: true, certificates: result.rows },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "Accounts are not configured." }, { status: 503 });
  }

  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in first." }, { status: 401 });
  }

  const learning = await getPool().query<{ completed: string[] }>(
    "SELECT completed FROM cscosmos_learning WHERE user_id = $1",
    [user.id]
  );
  const completed = learning.rows[0]?.completed?.length ?? 0;

  if (completed < 10) {
    return NextResponse.json(
      { ok: false, error: "Complete at least 10 topics before claiming a certificate." },
      { status: 403 }
    );
  }

  const id = randomUUID();
  await getPool().query(
    `INSERT INTO cscosmos_certificates (id, user_id, title, completed_count)
     VALUES ($1, $2, $3, $4)`,
    [id, user.id, "CSCosmos Learning Certificate", completed]
  );

  return NextResponse.json({ ok: true, id });
}
