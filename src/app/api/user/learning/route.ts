import { NextRequest, NextResponse } from "next/server";
import { getPool, isDatabaseConfigured } from "@/lib/db";
import { getSessionUser } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

function validStringArray(value: unknown, max: number): value is string[] {
  return (
    Array.isArray(value) &&
    value.length <= max &&
    value.every((item) => typeof item === "string" && item.length > 0 && item.length <= 160)
  );
}

function validNotes(value: unknown): value is Record<string, string> {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.values(value as Record<string, unknown>).every(
      (item) => typeof item === "string" && item.length <= 20000
    )
  );
}

function validVisited(value: unknown): value is Record<string, number> {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.values(value as Record<string, unknown>).every(
      (item) => typeof item === "number" && Number.isFinite(item)
    )
  );
}

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "Accounts are not configured." }, { status: 503 });
  }

  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in first." }, { status: 401 });
  }

  const result = await getPool().query<{
    bookmarks: string[];
    completed: string[];
    visited: Record<string, number>;
    notes: Record<string, string>;
  }>(
    `SELECT bookmarks, completed, visited, notes
     FROM cscosmos_learning
     WHERE user_id = $1`,
    [user.id]
  );

  const row = result.rows[0];
  return NextResponse.json(
    {
      ok: true,
      learning: {
        bookmarks: row?.bookmarks ?? [],
        completed: row?.completed ?? [],
        visited: row?.visited ?? {},
        notes: row?.notes ?? {},
      },
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}

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

  const payload = body as {
    bookmarks?: unknown;
    completed?: unknown;
    visited?: unknown;
    notes?: unknown;
  };

  if (
    !validStringArray(payload.bookmarks, 500) ||
    !validStringArray(payload.completed, 500) ||
    !validVisited(payload.visited) ||
    !validNotes(payload.notes)
  ) {
    return NextResponse.json({ ok: false, error: "Invalid learning state." }, { status: 400 });
  }

  await getPool().query(
    `INSERT INTO cscosmos_learning (user_id, bookmarks, completed, visited, notes, updated_at)
     VALUES ($1, $2, $3, $4::jsonb, $5::jsonb, NOW())
     ON CONFLICT (user_id) DO UPDATE SET
       bookmarks = EXCLUDED.bookmarks,
       completed = EXCLUDED.completed,
       visited = EXCLUDED.visited,
       notes = EXCLUDED.notes,
       updated_at = NOW()`,
    [
      user.id,
      payload.bookmarks,
      payload.completed,
      JSON.stringify(payload.visited),
      JSON.stringify(payload.notes),
    ]
  );

  return NextResponse.json({ ok: true });
}
